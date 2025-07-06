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
import wedding.alba.kafka.dto.ChatMessage;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;
    private final ChatMessageService chatMessageService;

    /**
     * Kafka에서 채팅 메시지 수신 후 DB 저장 및 WebSocket으로 전송
     */
    @KafkaListener(topics = "chat-messages", groupId = "chat-group")
    public void consumeChatMessage(@Payload String message,
                                 @Header(KafkaHeaders.RECEIVED_KEY) String key,
                                 Acknowledgment ack) {
        try {
            ChatMessage chatMessage = objectMapper.readValue(message, ChatMessage.class);
            
            log.debug("채팅 메시지 수신: messageId={}, chatRoomId={}, type={}", 
                    chatMessage.getMessageId(), chatMessage.getChatRoomId(), chatMessage.getType());

            // 메시지 타입별 처리
            switch (chatMessage.getType()) {
                case CHAT:
                    handleChatMessage(chatMessage);
                    break;
                case JOIN:
                case LEAVE:
                    // JOIN/LEAVE 메시지는 DB에 저장하지 않고 무시
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

            // 수동 커밋
            ack.acknowledge();
            
        } catch (Exception e) {
            log.error("채팅 메시지 처리 오류: {}", e.getMessage(), e);
            // TODO: Dead Letter Queue 또는 재시도 로직 구현
            // 일단은 acknowledge하여 무한 재시도 방지
            ack.acknowledge();
        }
    }

    /**
     * 일반 채팅 메시지 처리
     */
    private void handleChatMessage(ChatMessage chatMessage) {
        try {
            // 데이터베이스에 저장
            wedding.alba.entity.ChatMessage savedMessage = chatMessageService.saveChatMessage(chatMessage);
            
            if (savedMessage != null) {
                // 성공적으로 저장된 경우에만 WebSocket 전송
                messagingTemplate.convertAndSend(
                    "/topic/chat/" + chatMessage.getChatRoomId(), 
                    chatMessage
                );
                
                log.debug("일반 채팅 메시지 처리 완료: messageId={}", chatMessage.getMessageId());
            }
            
        } catch (Exception e) {
            log.error("일반 채팅 메시지 처리 실패: {}", e.getMessage(), e);
            // DB 저장 실패해도 실시간 전송은 시도
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
            // 타이핑 상태는 DB에 저장하지 않고 실시간 전송만
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
     * 시스템 메시지 처리
     */
    private void handleSystemMessage(ChatMessage chatMessage) {
        try {
            // DB에 시스템 메시지로 저장
            wedding.alba.entity.ChatMessage savedMessage = chatMessageService.saveChatMessage(chatMessage);
            
            // 시스템 메시지 전송
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
     * 멘션 메시지 처리
     */
    private void handleMentionMessage(ChatMessage chatMessage) {
        try {
            // DB에 멘션 메시지로 저장
            wedding.alba.entity.ChatMessage savedMessage = chatMessageService.saveChatMessage(chatMessage);
            
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
            log.error("멘션 메시지 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 파일/이미지 메시지 처리
     */
    private void handleFileMessage(ChatMessage chatMessage) {
        try {
            // DB에 파일 메시지로 저장
            wedding.alba.entity.ChatMessage savedMessage = chatMessageService.saveChatMessage(chatMessage);
            
            // 파일 메시지 전송
            messagingTemplate.convertAndSend(
                "/topic/chat/" + chatMessage.getChatRoomId(),
                chatMessage
            );
            
            // 파일 업로드 완료 알림 (필요한 경우)
            messagingTemplate.convertAndSend(
                "/topic/file-upload/" + chatMessage.getChatRoomId(),
                createFileUploadNotification(chatMessage)
            );
            
            log.debug("파일 메시지 처리 완료: messageId={}, type={}", 
                    chatMessage.getMessageId(), chatMessage.getType());
            
        } catch (Exception e) {
            log.error("파일 메시지 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 사용자 상태 메시지 생성
     */
    private Map<String, Object> createUserStatusMessage(ChatMessage chatMessage, String action) {
        Map<String, Object> statusMessage = new HashMap<>();
        statusMessage.put("userId", chatMessage.getSenderId());
        statusMessage.put("chatRoomId", chatMessage.getChatRoomId());
        statusMessage.put("action", action);
        statusMessage.put("timestamp", LocalDateTime.now());
        statusMessage.put("userName", chatMessage.getSenderName());
        statusMessage.put("userProfileImage", chatMessage.getSenderProfileImage());
        
        return statusMessage;
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
     * 에러 응답 전송
     */
    private void sendErrorResponse(Long chatRoomId, String errorMessage, String originalMessageId) {
        try {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("type", "ERROR");
            errorResponse.put("chatRoomId", chatRoomId);
            errorResponse.put("originalMessageId", originalMessageId);
            errorResponse.put("errorMessage", errorMessage);
            errorResponse.put("timestamp", LocalDateTime.now());
            
            messagingTemplate.convertAndSend(
                "/topic/chat-error/" + chatRoomId,
                errorResponse
            );
            
        } catch (Exception e) {
            log.error("에러 응답 전송 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 메시지 처리 상태 전송 (선택적)
     */
    private void sendMessageProcessedStatus(ChatMessage chatMessage, String status) {
        try {
            Map<String, Object> statusMessage = new HashMap<>();
            statusMessage.put("messageId", chatMessage.getMessageId());
            statusMessage.put("chatRoomId", chatMessage.getChatRoomId());
            statusMessage.put("status", status); // PROCESSED, FAILED, RETRY
            statusMessage.put("timestamp", LocalDateTime.now());
            
            messagingTemplate.convertAndSend(
                "/topic/message-status/" + chatMessage.getChatRoomId(),
                statusMessage
            );
            
        } catch (Exception e) {
            log.error("메시지 처리 상태 전송 실패: {}", e.getMessage(), e);
        }
    }
}
