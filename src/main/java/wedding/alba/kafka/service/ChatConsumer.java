package wedding.alba.kafka.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wedding.alba.kafka.dto.ChatMessage;
import wedding.alba.repository.ChatRoomParticipantRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;
    private final ChatMessageService chatMessageService;
    private final UnreadCountService unreadCountService;
    private final ChatRoomParticipantRepository chatRoomParticipantRepository;

    /**
     * 🚀 배치 메시지 처리 - 성능 최적화
     * 여러 메시지를 한번에 처리하여 DB 부하 감소
     */
    @KafkaListener(topics = "chat-messages", groupId = "chat-group", containerFactory = "kafkaListenerContainerFactory")
    public void consumeChatMessagesBatch(@Payload List<String> messages,
                                        @Header(KafkaHeaders.RECEIVED_KEY) List<String> keys,
                                        Acknowledgment ack) {
        try {
            log.debug("배치 메시지 수신: {} 개", messages.size());
            
            // 메시지 파싱 및 분류
            List<ChatMessage> chatMessages = new ArrayList<>();
            List<ChatMessage> typingMessages = new ArrayList<>();
            List<ChatMessage> dbMessages = new ArrayList<>();
            
            for (String message : messages) {
                try {
                    ChatMessage chatMessage = objectMapper.readValue(message, ChatMessage.class);
                    chatMessages.add(chatMessage);
                    
                    // 메시지 타입별 분류
                    if (chatMessage.getType() == ChatMessage.MessageType.TYPING || 
                        chatMessage.getType() == ChatMessage.MessageType.STOP_TYPING) {
                        typingMessages.add(chatMessage);
                    } else if (chatMessage.getType() != ChatMessage.MessageType.JOIN && 
                              chatMessage.getType() != ChatMessage.MessageType.LEAVE) {
                        dbMessages.add(chatMessage);
                    }
                } catch (Exception e) {
                    log.error("메시지 파싱 실패: {}", e.getMessage());
                }
            }
            
            // 🚀 병렬 처리로 성능 향상
            CompletableFuture<Void> dbTask = CompletableFuture.runAsync(() -> 
                processDatabaseMessages(dbMessages));
            
            CompletableFuture<Void> typingTask = CompletableFuture.runAsync(() -> 
                processTypingMessages(typingMessages));
            
            CompletableFuture<Void> websocketTask = CompletableFuture.runAsync(() -> 
                processWebSocketMessages(chatMessages));
            
            // 모든 작업 완료 대기
            CompletableFuture.allOf(dbTask, typingTask, websocketTask).join();
            
            log.debug("배치 메시지 처리 완료: {} 개", messages.size());
            ack.acknowledge();
            
        } catch (Exception e) {
            log.error("배치 메시지 처리 오류: {}", e.getMessage(), e);
            ack.acknowledge(); // 무한 재시도 방지
        }
    }

    /**
     * 기존 단일 메시지 처리 (호환성 유지)
     */
    @KafkaListener(topics = "chat-messages-single", groupId = "chat-group-single")
    public void consumeChatMessage(@Payload String message,
                                 @Header(KafkaHeaders.RECEIVED_KEY) String key,
                                 Acknowledgment ack) {
        try {
            ChatMessage chatMessage = objectMapper.readValue(message, ChatMessage.class);
            
            log.debug("단일 메시지 수신: messageId={}, chatRoomId={}, type={}", 
                    chatMessage.getMessageId(), chatMessage.getChatRoomId(), chatMessage.getType());

            // 메시지 타입별 처리
            switch (chatMessage.getType()) {
                case CHAT:
                    handleChatMessage(chatMessage);
                    break;
                case JOIN:
                case LEAVE:
                    // JOIN/LEAVE 메시지는 무시
                    log.debug("JOIN/LEAVE 메시지 무시: messageId={}, type={}", 
                            chatMessage.getMessageId(), chatMessage.getType());
                    break;
                case TYPING:
                case STOP_TYPING:
                    handleTypingStatus(chatMessage);
                    break;
                case SYSTEM:
                    handleSystemMessage(chatMessage);
                    break;
                case MENTION:
                    handleMentionMessage(chatMessage);
                    break;
                case FILE:
                case IMAGE:
                    handleFileMessage(chatMessage);
                    break;
                default:
                    log.warn("알 수 없는 메시지 타입: {}", chatMessage.getType());
            }

            ack.acknowledge();
            
        } catch (Exception e) {
            log.error("단일 메시지 처리 오류: {}", e.getMessage(), e);
            ack.acknowledge();
        }
    }

    /**
     * 🚀 데이터베이스 메시지 배치 처리 (안읽은 카운트 포함)
     */
    @Transactional
    private void processDatabaseMessages(List<ChatMessage> messages) {
        if (messages.isEmpty()) return;
        
        try {
            // 채팅방별로 그룹화
            Map<Long, List<ChatMessage>> messagesByRoom = messages.stream()
                .collect(Collectors.groupingBy(ChatMessage::getChatRoomId));
            
            // 배치 저장 및 안읽은 카운트 업데이트
            for (Map.Entry<Long, List<ChatMessage>> entry : messagesByRoom.entrySet()) {
                List<ChatMessage> roomMessages = entry.getValue();
                
                // 1. 메시지 배치 저장
                chatMessageService.saveChatMessagesBatch(roomMessages);
                
                // 2. 각 메시지에 대해 안읽은 카운트 업데이트
                roomMessages.forEach(this::updateUnreadCounts);
            }
            
            log.debug("DB 배치 저장 및 안읽은 카운트 처리 완료: {} 개 메시지", messages.size());
            
        } catch (Exception e) {
            log.error("DB 배치 저장 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 🚀 타이핑 메시지 처리 (DB 저장 안함)
     */
    private void processTypingMessages(List<ChatMessage> typingMessages) {
        if (typingMessages.isEmpty()) return;
        
        // 채팅방별로 그룹화하여 중복 제거
        Map<Long, ChatMessage> latestTypingByRoom = new HashMap<>();
        
        for (ChatMessage message : typingMessages) {
            latestTypingByRoom.put(message.getChatRoomId(), message);
        }
        
        // 최신 타이핑 상태만 전송
        for (ChatMessage message : latestTypingByRoom.values()) {
            try {
                messagingTemplate.convertAndSend(
                    "/topic/typing/" + message.getChatRoomId(),
                    message
                );
            } catch (Exception e) {
                log.error("타이핑 상태 전송 실패: {}", e.getMessage());
            }
        }
        
        log.trace("타이핑 상태 배치 처리 완료: {} 개", latestTypingByRoom.size());
    }

    /**
     * 🚀 WebSocket 메시지 배치 전송
     */
    private void processWebSocketMessages(List<ChatMessage> messages) {
        if (messages.isEmpty()) return;
        
        // 채팅방별로 그룹화
        Map<Long, List<ChatMessage>> messagesByRoom = messages.stream()
            .filter(msg -> msg.getType() != ChatMessage.MessageType.TYPING && 
                          msg.getType() != ChatMessage.MessageType.STOP_TYPING)
            .collect(Collectors.groupingBy(ChatMessage::getChatRoomId));
        
        // 채팅방별로 전송
        for (Map.Entry<Long, List<ChatMessage>> entry : messagesByRoom.entrySet()) {
            Long chatRoomId = entry.getKey();
            List<ChatMessage> roomMessages = entry.getValue();
            
            try {
                // 단일 메시지인 경우
                if (roomMessages.size() == 1) {
                    ChatMessage message = roomMessages.get(0);
                    handleSingleWebSocketMessage(message);
                } else {
                    // 다중 메시지인 경우 배치 전송
                    messagingTemplate.convertAndSend(
                        "/topic/chat/" + chatRoomId,
                        createBatchMessage(roomMessages)
                    );
                }
                
            } catch (Exception e) {
                log.error("WebSocket 배치 전송 실패: chatRoomId={}, error={}", chatRoomId, e.getMessage());
            }
        }
        
        log.debug("WebSocket 배치 전송 완료: {} 개 채팅방", messagesByRoom.size());
    }

    /**
     * 단일 WebSocket 메시지 처리
     */
    private void handleSingleWebSocketMessage(ChatMessage message) {
        switch (message.getType()) {
            case MENTION:
                handleMentionWebSocket(message);
                break;
            case FILE:
            case IMAGE:
                handleFileWebSocket(message);
                break;
            default:
                messagingTemplate.convertAndSend(
                    "/topic/chat/" + message.getChatRoomId(),
                    message
                );
        }
    }

    /**
     * 배치 메시지 생성
     */
    private Map<String, Object> createBatchMessage(List<ChatMessage> messages) {
        Map<String, Object> batchMessage = new HashMap<>();
        batchMessage.put("type", "BATCH");
        batchMessage.put("messages", messages);
        batchMessage.put("count", messages.size());
        batchMessage.put("timestamp", LocalDateTime.now());
        return batchMessage;
    }

    /**
     * 일반 채팅 메시지 처리 (안읽은 카운트 포함)
     */
    private void handleChatMessage(ChatMessage chatMessage) {
        try {
            // 1. 메시지 DB 저장
            wedding.alba.entity.ChatMessage savedMessage = chatMessageService.saveChatMessage(chatMessage);
            
            if (savedMessage != null) {
                // 2. 안읽은 메시지 카운트 업데이트
                updateUnreadCounts(chatMessage);
                
                // 3. WebSocket으로 실시간 전송
                messagingTemplate.convertAndSend(
                    "/topic/chat/" + chatMessage.getChatRoomId(), 
                    chatMessage
                );
                
                log.debug("일반 채팅 메시지 처리 완료: messageId={}", chatMessage.getMessageId());
            }
            
        } catch (Exception e) {
            log.error("일반 채팅 메시지 처리 실패: {}", e.getMessage(), e);
            messagingTemplate.convertAndSend(
                "/topic/chat/" + chatMessage.getChatRoomId(), 
                chatMessage
            );
        }
    }

    /**
     * 타이핑 상태 처리 (DB 저장 안함, 실시간 전송만)
     */
    private void handleTypingStatus(ChatMessage chatMessage) {
        try {
            messagingTemplate.convertAndSend(
                "/topic/typing/" + chatMessage.getChatRoomId(),
                chatMessage
            );
            
            log.trace("타이핑 상태 전송: userId={}, chatRoomId={}, type={}", 
                    chatMessage.getSenderId(), chatMessage.getChatRoomId(), chatMessage.getType());
            
        } catch (Exception e) {
            log.error("타이핑 상태 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 시스템 메시지 처리 (안읽은 카운트 포함)
     */
    private void handleSystemMessage(ChatMessage chatMessage) {
        try {
            wedding.alba.entity.ChatMessage savedMessage = chatMessageService.saveChatMessage(chatMessage);
            
            // 시스템 메시지도 안읽은 카운트에 포함
            updateUnreadCounts(chatMessage);
            
            messagingTemplate.convertAndSend(
                "/topic/chat/" + chatMessage.getChatRoomId(),
                chatMessage
            );
            
            log.debug("시스템 메시지 처리 완료: messageId={}", chatMessage.getMessageId());
            
        } catch (Exception e) {
            log.error("시스템 메시지 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 멘션 메시지 WebSocket 처리
     */
    private void handleMentionWebSocket(ChatMessage chatMessage) {
        try {
            // 일반 채팅 채널로 전송
            messagingTemplate.convertAndSend(
                "/topic/chat/" + chatMessage.getChatRoomId(),
                chatMessage
            );
            
            // 멘션된 사용자에게 개별 알림 전송
            if (chatMessage.getMentionUserId() != null) {
                messagingTemplate.convertAndSendToUser(
                    chatMessage.getMentionUserId().toString(),
                    "/queue/mention",
                    chatMessage
                );
                
                log.debug("멘션 알림 전송: mentionUserId={}, messageId={}", 
                        chatMessage.getMentionUserId(), chatMessage.getMessageId());
            }
            
        } catch (Exception e) {
            log.error("멘션 WebSocket 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 멘션 메시지 처리 (안읽은 카운트 포함)
     */
    private void handleMentionMessage(ChatMessage chatMessage) {
        try {
            wedding.alba.entity.ChatMessage savedMessage = chatMessageService.saveChatMessage(chatMessage);
            
            // 멘션 메시지도 안읽은 카운트에 포함
            updateUnreadCounts(chatMessage);
            
            handleMentionWebSocket(chatMessage);
            
        } catch (Exception e) {
            log.error("멘션 메시지 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 파일 메시지 WebSocket 처리
     */
    private void handleFileWebSocket(ChatMessage chatMessage) {
        try {
            // 파일 메시지 전송
            messagingTemplate.convertAndSend(
                "/topic/chat/" + chatMessage.getChatRoomId(),
                chatMessage
            );
            
            // 파일 업로드 완료 알림
            messagingTemplate.convertAndSend(
                "/topic/file-upload/" + chatMessage.getChatRoomId(),
                createFileUploadNotification(chatMessage)
            );
            
            log.debug("파일 WebSocket 처리 완료: messageId={}, type={}", 
                    chatMessage.getMessageId(), chatMessage.getType());
            
        } catch (Exception e) {
            log.error("파일 WebSocket 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 파일/이미지 메시지 처리 (안읽은 카운트 포함)
     */
    private void handleFileMessage(ChatMessage chatMessage) {
        try {
            wedding.alba.entity.ChatMessage savedMessage = chatMessageService.saveChatMessage(chatMessage);
            
            // 파일 메시지도 안읽은 카운트에 포함
            updateUnreadCounts(chatMessage);
            
            handleFileWebSocket(chatMessage);
            
        } catch (Exception e) {
            log.error("파일 메시지 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 파일 업로드 완료 알림 생성
     */
    private Map<String, Object> createFileUploadNotification(ChatMessage chatMessage) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("messageId", chatMessage.getMessageId());
        notification.put("chatRoomId", chatMessage.getChatRoomId());
        notification.put("senderId", chatMessage.getSenderId());
        notification.put("fileName", extractFileName(chatMessage.getAttachmentUrl()));
        notification.put("fileType", chatMessage.getAttachmentType());
        notification.put("fileUrl", chatMessage.getAttachmentUrl());
        notification.put("timestamp", chatMessage.getTimestamp());
        
        return notification;
    }

    /**
     * 파일명 추출 (URL에서)
     */
    private String extractFileName(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return "알 수 없는 파일";
        }
        
        try {
            return fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        } catch (Exception e) {
            return "알 수 없는 파일";
        }
    }

    /**
     * 안읽은 메시지 카운트 업데이트
     * 채팅방의 모든 참여자 중 발송자를 제외한 나머지 사용자들의 카운트 증가
     */
    private void updateUnreadCounts(ChatMessage chatMessage) {
        try {
            // 1. 채팅방 참여자 목록 조회
            List<Long> participantIds = chatRoomParticipantRepository.findUserIdsByChatRoomId(chatMessage.getChatRoomId());
            
            if (participantIds != null && !participantIds.isEmpty()) {
                // 2. 안읽은 카운트 서비스로 처리
                unreadCountService.handleNewMessage(
                    chatMessage.getChatRoomId(),
                    chatMessage.getMessageId(),
                    chatMessage.getSenderId(),
                    chatMessage.getSenderName(),
                    chatMessage.getContent() != null ? chatMessage.getContent() : "[파일]",
                    participantIds
                );
                
                log.debug("안읽은 카운트 업데이트 완료: messageId={}, participants={}", 
                        chatMessage.getMessageId(), participantIds.size());
            }
            
        } catch (Exception e) {
            log.error("안읽은 카운트 업데이트 실패: messageId={}, error={}", 
                    chatMessage.getMessageId(), e.getMessage(), e);
        }
    }
}
