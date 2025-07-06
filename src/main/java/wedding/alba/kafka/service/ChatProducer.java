package wedding.alba.kafka.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import wedding.alba.kafka.dto.ChatMessage;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    
    private static final String CHAT_TOPIC = "chat-messages";

    /**
     * 채팅 메시지를 Kafka로 전송
     */
    public CompletableFuture<SendResult<String, String>> sendChatMessage(ChatMessage message) {
        try {
            // 메시지 검증 및 기본값 설정
            validateAndSetDefaults(message);

            String messageJson = objectMapper.writeValueAsString(message);
            String key = String.valueOf(message.getChatRoomId()); // 채팅방별 파티셔닝
            
            CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(CHAT_TOPIC, key, messageJson);
            
            future.whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("채팅 메시지 전송 실패: messageId={}, error={}", 
                            message.getMessageId(), ex.getMessage(), ex);
                    handleSendFailure(message, ex);
                } else {
                    log.debug("채팅 메시지 전송 성공: messageId={}, chatRoomId={}, partition={}, offset={}", 
                            message.getMessageId(), 
                            message.getChatRoomId(),
                            result.getRecordMetadata().partition(),
                            result.getRecordMetadata().offset());
                    handleSendSuccess(message, result);
                }
            });
            
            return future;
                
        } catch (JsonProcessingException e) {
            log.error("채팅 메시지 JSON 변환 오류: messageId={}, error={}", 
                    message.getMessageId(), e.getMessage(), e);
            return CompletableFuture.failedFuture(e);
        } catch (Exception e) {
            log.error("채팅 메시지 전송 중 예상치 못한 오류: messageId={}, error={}", 
                    message.getMessageId(), e.getMessage(), e);
            return CompletableFuture.failedFuture(e);
        }
    }

    /**
     * 일반 채팅 메시지 전송
     */
    public CompletableFuture<SendResult<String, String>> sendTextMessage(Long chatRoomId, Long senderId, 
                                                                       String senderName, String content) {
        ChatMessage message = ChatMessage.builder()
                .chatRoomId(chatRoomId)
                .senderId(senderId)
                .senderName(senderName)
                .content(content)
                .type(ChatMessage.MessageType.CHAT)
                .build();
        
        return sendChatMessage(message);
    }

    /**
     * 멘션 메시지 전송
     */
    public CompletableFuture<SendResult<String, String>> sendMentionMessage(Long chatRoomId, Long senderId, 
                                                                          String senderName, String content, 
                                                                          Long mentionUserId) {
        ChatMessage message = ChatMessage.builder()
                .chatRoomId(chatRoomId)
                .senderId(senderId)
                .senderName(senderName)
                .content(content)
                .type(ChatMessage.MessageType.MENTION)
                .mentionUserId(mentionUserId)
                .build();
        
        return sendChatMessage(message);
    }

    /**
     * 파일/이미지 메시지 전송
     */
    public CompletableFuture<SendResult<String, String>> sendFileMessage(Long chatRoomId, Long senderId, 
                                                                       String senderName, String content,
                                                                       String attachmentUrl, String attachmentType) {
        ChatMessage.MessageType messageType = determineFileMessageType(attachmentType);
        
        ChatMessage message = ChatMessage.builder()
                .chatRoomId(chatRoomId)
                .senderId(senderId)
                .senderName(senderName)
                .content(content != null ? content : "파일을 전송했습니다.")
                .type(messageType)
                .attachmentUrl(attachmentUrl)
                .attachmentType(attachmentType)
                .build();
        
        return sendChatMessage(message);
    }

    /**
     * 사용자 상태 변경 (온라인/오프라인)
     */
    public CompletableFuture<SendResult<String, String>> sendUserStatus(Long userId, String senderName, 
                                                                       String status, Long chatRoomId) {
        try {
            ChatMessage.MessageType messageType = ChatMessage.MessageType.valueOf(status.toUpperCase());
            
            ChatMessage statusMessage = ChatMessage.builder()
                    .chatRoomId(chatRoomId)
                    .senderId(userId)
                    .senderName(senderName)
                    .type(messageType)
                    .content(generateStatusMessage(senderName, status))
                    .build();
            
            return sendChatMessage(statusMessage);
            
        } catch (IllegalArgumentException e) {
            log.error("잘못된 사용자 상태: status={}", status);
            return CompletableFuture.failedFuture(
                new IllegalArgumentException("지원하지 않는 사용자 상태: " + status));
        } catch (Exception e) {
            log.error("사용자 상태 전송 오류: {}", e.getMessage(), e);
            return CompletableFuture.failedFuture(e);
        }
    }

    /**
     * 타이핑 상태 전송
     */
    public CompletableFuture<SendResult<String, String>> sendTypingStatus(Long userId, String senderName, 
                                                                        Long chatRoomId, boolean isTyping) {
        try {
            ChatMessage typingMessage = ChatMessage.builder()
                    .chatRoomId(chatRoomId)
                    .senderId(userId)
                    .senderName(senderName)
                    .type(isTyping ? ChatMessage.MessageType.TYPING : ChatMessage.MessageType.STOP_TYPING)
                    .content(null) // 타이핑 메시지는 내용 없음
                    .build();
            
            return sendChatMessage(typingMessage);
            
        } catch (Exception e) {
            log.error("타이핑 상태 전송 오류: userId={}, chatRoomId={}, isTyping={}, error={}", 
                    userId, chatRoomId, isTyping, e.getMessage(), e);
            return CompletableFuture.failedFuture(e);
        }
    }

    /**
     * 시스템 메시지 전송
     */
    public CompletableFuture<SendResult<String, String>> sendSystemMessage(Long chatRoomId, String content) {
        ChatMessage systemMessage = ChatMessage.builder()
                .chatRoomId(chatRoomId)
                .senderId(0L) // 시스템 사용자 ID
                .senderName("시스템")
                .content(content)
                .type(ChatMessage.MessageType.SYSTEM)
                .build();
        
        return sendChatMessage(systemMessage);
    }

    /**
     * 대량 메시지 전송 (배치)
     */
    public void sendBatchMessages(java.util.List<ChatMessage> messages) {
        for (ChatMessage message : messages) {
            sendChatMessage(message)
                .exceptionally(throwable -> {
                    log.error("배치 메시지 전송 실패: messageId={}", message.getMessageId(), throwable);
                    return null;
                });
        }
        
        log.info("배치 메시지 전송 완료: {} 건", messages.size());
    }

    /**
     * 메시지 검증 및 기본값 설정
     */
    private void validateAndSetDefaults(ChatMessage message) {
        // 필수 필드 검증
        if (message.getChatRoomId() == null) {
            throw new IllegalArgumentException("채팅방 ID는 필수입니다.");
        }
        if (message.getSenderId() == null) {
            throw new IllegalArgumentException("발신자 ID는 필수입니다.");
        }
        if (message.getType() == null) {
            throw new IllegalArgumentException("메시지 타입은 필수입니다.");
        }

        // 기본값 설정
        if (message.getMessageId() == null || message.getMessageId().isEmpty()) {
            message.setMessageId(UUID.randomUUID().toString());
        }
        
        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now());
        }

        // 타이핑 메시지가 아닌 경우 내용 검증
        if (message.getType() != ChatMessage.MessageType.TYPING && 
            message.getType() != ChatMessage.MessageType.STOP_TYPING &&
            (message.getContent() == null || message.getContent().trim().isEmpty()) &&
            message.getAttachmentUrl() == null) {
            throw new IllegalArgumentException("메시지 내용 또는 첨부파일이 필요합니다.");
        }

        // 내용 길이 제한 (예: 1000자)
        if (message.getContent() != null && message.getContent().length() > 1000) {
            throw new IllegalArgumentException("메시지 내용이 너무 깁니다. (최대 1000자)");
        }
    }

    /**
     * 파일 타입에 따른 메시지 타입 결정
     */
    private ChatMessage.MessageType determineFileMessageType(String attachmentType) {
        if (attachmentType == null) {
            return ChatMessage.MessageType.FILE;
        }
        
        String type = attachmentType.toLowerCase();
        if (type.startsWith("image/")) {
            return ChatMessage.MessageType.IMAGE;
        } else {
            return ChatMessage.MessageType.FILE;
        }
    }

    /**
     * 상태 메시지 내용 생성
     */
    private String generateStatusMessage(String senderName, String status) {
        return switch (status.toUpperCase()) {
            case "JOIN" -> senderName + "님이 채팅방에 입장했습니다.";
            case "LEAVE" -> senderName + "님이 채팅방을 나갔습니다.";
            default -> senderName + "님의 상태가 변경되었습니다.";
        };
    }

    /**
     * 전송 성공 처리
     */
    private void handleSendSuccess(ChatMessage message, SendResult<String, String> result) {
        // 필요시 성공 메트릭 수집, 로깅 등
        log.trace("메시지 전송 성공 처리: messageId={}", message.getMessageId());
    }

    /**
     * 전송 실패 처리
     */
    private void handleSendFailure(ChatMessage message, Throwable throwable) {
        // 필요시 실패 메트릭 수집, 재시도 로직, 알림 등
        log.warn("메시지 전송 실패 처리: messageId={}, error={}", 
                message.getMessageId(), throwable.getMessage());
        
        // TODO: 실패한 메시지를 별도 저장소에 보관하여 재시도 가능하도록 구현
        // TODO: 중요한 메시지인 경우 관리자에게 알림 전송
    }

    /**
     * Kafka 서비스 상태 확인
     */
    public boolean isKafkaHealthy() {
        try {
            // 간단한 테스트 메시지 전송으로 Kafka 상태 확인
            ChatMessage testMessage = ChatMessage.builder()
                    .messageId("health-check-" + UUID.randomUUID())
                    .chatRoomId(-1L) // 테스트용 채팅방 ID
                    .senderId(-1L)   // 테스트용 사용자 ID
                    .senderName("Health Check")
                    .content("Health Check Message")
                    .type(ChatMessage.MessageType.SYSTEM)
                    .build();
            
            CompletableFuture<SendResult<String, String>> future = sendChatMessage(testMessage);
            future.get(java.util.concurrent.TimeUnit.SECONDS.toMillis(5), 
                      java.util.concurrent.TimeUnit.MILLISECONDS); // 5초 타임아웃
            
            return true;
        } catch (Exception e) {
            log.error("Kafka 상태 확인 실패: {}", e.getMessage());
            return false;
        }
    }
}
