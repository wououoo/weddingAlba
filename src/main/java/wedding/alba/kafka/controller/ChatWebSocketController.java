package wedding.alba.kafka.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import wedding.alba.kafka.dto.ChatMessage;
import wedding.alba.kafka.service.ChatProducer;
import wedding.alba.kafka.service.ChatMessageService;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final ChatProducer chatProducer;
    private final ChatMessageService chatMessageService;

    /**
     * 현재 인증된 사용자 ID 추출
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("인증되지 않은 사용자입니다.");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Long) {
            return (Long) principal;
        }

        throw new IllegalStateException("유효하지 않은 인증 정보입니다.");
    }

    /**
     * 채팅 메시지 전송
     * 클라이언트에서 /app/chat.sendMessage로 전송
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage, 
                          SimpMessageHeaderAccessor headerAccessor) {
        
        try {
            // 사용자 인증 정보 확인
            Principal user = headerAccessor.getUser();
            if (user != null) {
                // JWT에서 사용자 ID 추출하는 로직 구현 필요
                // chatMessage.setSenderId(extractUserIdFromPrincipal(user));
                log.debug("인증된 사용자: {}", user.getName());
            }
            
            // 기본 검증
            if (chatMessage.getChatRoomId() == null || chatMessage.getSenderId() == null) {
                log.error("필수 필드 누락: chatRoomId={}, senderId={}", 
                        chatMessage.getChatRoomId(), chatMessage.getSenderId());
                return;
            }
            
            log.debug("채팅 메시지 수신: chatRoomId={}, senderId={}, content={}", 
                    chatMessage.getChatRoomId(), chatMessage.getSenderId(), 
                    chatMessage.getContent() != null ? chatMessage.getContent().substring(0, Math.min(50, chatMessage.getContent().length())) + "..." : "null");

            // 메시지 타입 설정
            if (chatMessage.getType() == null) {
                chatMessage.setType(ChatMessage.MessageType.CHAT);
            }
            
            // Kafka로 메시지 전송 (비동기)
            chatProducer.sendChatMessage(chatMessage)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("WebSocket 메시지 Kafka 전송 실패: messageId={}, error={}", 
                                chatMessage.getMessageId(), ex.getMessage());
                    } else {
                        log.debug("WebSocket 메시지 Kafka 전송 성공: messageId={}", 
                                chatMessage.getMessageId());
                    }
                });
            
        } catch (Exception e) {
            log.error("채팅 메시지 전송 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 멘션 메시지 전송
     * 클라이언트에서 /app/chat.sendMention으로 전송
     */
    @MessageMapping("/chat.sendMention")
    public void sendMentionMessage(@Payload ChatMessage chatMessage, 
                                 SimpMessageHeaderAccessor headerAccessor) {
        try {
            if (chatMessage.getMentionUserId() == null) {
                log.error("멘션 대상 사용자 ID가 없습니다: messageId={}", chatMessage.getMessageId());
                return;
            }
            
            // 멘션 메시지 타입으로 설정
            chatMessage.setType(ChatMessage.MessageType.MENTION);
            
            log.debug("멘션 메시지 수신: chatRoomId={}, senderId={}, mentionUserId={}", 
                    chatMessage.getChatRoomId(), chatMessage.getSenderId(), chatMessage.getMentionUserId());
            
            // Kafka로 멘션 메시지 전송
            chatProducer.sendChatMessage(chatMessage);
            
        } catch (Exception e) {
            log.error("멘션 메시지 전송 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 파일 메시지 전송
     * 클라이언트에서 /app/chat.sendFile로 전송
     */
    @MessageMapping("/chat.sendFile")
    public void sendFileMessage(@Payload ChatMessage chatMessage, 
                              SimpMessageHeaderAccessor headerAccessor) {
        try {
            if (chatMessage.getAttachmentUrl() == null || chatMessage.getAttachmentUrl().isEmpty()) {
                log.error("첨부파일 URL이 없습니다: messageId={}", chatMessage.getMessageId());
                return;
            }
            
            // 파일 타입에 따라 메시지 타입 설정
            if (chatMessage.getAttachmentType() != null && 
                chatMessage.getAttachmentType().startsWith("image/")) {
                chatMessage.setType(ChatMessage.MessageType.IMAGE);
            } else {
                chatMessage.setType(ChatMessage.MessageType.FILE);
            }
            
            log.debug("파일 메시지 수신: chatRoomId={}, senderId={}, fileType={}", 
                    chatMessage.getChatRoomId(), chatMessage.getSenderId(), chatMessage.getAttachmentType());
            
            // Kafka로 파일 메시지 전송
            chatProducer.sendChatMessage(chatMessage);
            
        } catch (Exception e) {
            log.error("파일 메시지 전송 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 채팅방 입장
     * 클라이언트에서 /app/chat.addUser로 전송
     * JOIN 메시지를 DB에 저장하지 않고 세션 관리만 수행
     */
    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage chatMessage,
                       SimpMessageHeaderAccessor headerAccessor) {
        
        try {
            // 사용자 세션에 정보 저장
            headerAccessor.getSessionAttributes().put("chatRoomId", chatMessage.getChatRoomId());
            headerAccessor.getSessionAttributes().put("userId", chatMessage.getSenderId());
            headerAccessor.getSessionAttributes().put("userName", chatMessage.getSenderName());
            
            log.info("사용자 채팅방 입장 (메시지 전송 안함): userId={}, userName={}, chatRoomId={}", 
                    chatMessage.getSenderId(), chatMessage.getSenderName(), chatMessage.getChatRoomId());

            // JOIN 메시지 전송하지 않음 - 세션 관리만 수행
            // chatProducer.sendUserStatus() 호출 제거
            
        } catch (Exception e) {
            log.error("사용자 입장 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 채팅방 퇴장
     * 클라이언트에서 /app/chat.removeUser로 전송
     * LEAVE 메시지를 DB에 저장하지 않고 세션 정리만 수행
     */
    @MessageMapping("/chat.removeUser")
    public void removeUser(@Payload ChatMessage chatMessage,
                         SimpMessageHeaderAccessor headerAccessor) {
        try {
            log.info("사용자 채팅방 퇴장 (메시지 전송 안함): userId={}, userName={}, chatRoomId={}", 
                    chatMessage.getSenderId(), chatMessage.getSenderName(), chatMessage.getChatRoomId());

            // LEAVE 메시지 전송하지 않음
            // chatProducer.sendUserStatus() 호출 제거

            // 세션에서 정보 제거
            headerAccessor.getSessionAttributes().remove("chatRoomId");
            headerAccessor.getSessionAttributes().remove("userId");
            headerAccessor.getSessionAttributes().remove("userName");
            
        } catch (Exception e) {
            log.error("사용자 퇴장 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 타이핑 상태 전송
     * 클라이언트에서 /app/chat.typing으로 전송
     */
    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload ChatMessage chatMessage) {
        try {
            log.trace("타이핑 시작: userId={}, chatRoomId={}", 
                    chatMessage.getSenderId(), chatMessage.getChatRoomId());
            
            chatProducer.sendTypingStatus(
                chatMessage.getSenderId(), 
                chatMessage.getSenderName(),
                chatMessage.getChatRoomId(), 
                true
            );
            
        } catch (Exception e) {
            log.error("타이핑 상태 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 타이핑 중지 상태 전송 (토큰 기반)
     */
    @MessageMapping("/chat.stopTyping")
    public void handleStopTyping(@Payload ChatMessage chatMessage) {
        try {
            // JWT 토큰에서 사용자 ID 추출
            Long userId = getCurrentUserId();
            
            log.trace("타이핑 중지 (토큰): userId={}, chatRoomId={}", 
                    userId, chatMessage.getChatRoomId());
            
            chatProducer.sendTypingStatus(
                userId, 
                chatMessage.getSenderName() != null ? chatMessage.getSenderName() : "사용자",
                chatMessage.getChatRoomId(), 
                false
            );
            
        } catch (Exception e) {
            log.error("타이핑 중지 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 메시지 읽음 처리 (토큰 기반)
     */
    @MessageMapping("/chat.markRead")
    public void markMessagesAsRead(@Payload ChatMessage chatMessage) {
        try {
            // JWT 토큰에서 사용자 ID 추출
            Long userId = getCurrentUserId();
            
            if (chatMessage.getMessageId() == null || chatMessage.getMessageId().isEmpty()) {
                log.warn("읽음 처리할 메시지 ID가 없습니다: userId={}, chatRoomId={}", 
                        userId, chatMessage.getChatRoomId());
                return;
            }
            
            log.debug("메시지 읽음 처리 (토큰): userId={}, chatRoomId={}, lastMessageId={}", 
                    userId, chatMessage.getChatRoomId(), chatMessage.getMessageId());
            
            // DB에서 읽음 처리
            chatMessageService.markMessagesAsRead(
                chatMessage.getChatRoomId(), 
                userId, 
                chatMessage.getMessageId()
            );
            
        } catch (Exception e) {
            log.error("메시지 읽음 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 연결 해제시 처리 (WebSocket 세션 종료) (토큰 기반)
     */
    public void handleDisconnect(SimpMessageHeaderAccessor headerAccessor) {
        try {
            Long chatRoomId = (Long) headerAccessor.getSessionAttributes().get("chatRoomId");
            Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
            
            if (chatRoomId != null && userId != null) {
                log.info("WebSocket 연결 해제 (토큰, 자동 퇴장 메시지 전송 안함): userId={}, chatRoomId={}", userId, chatRoomId);
            }
            
        } catch (Exception e) {
            log.error("연결 해제 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * JWT에서 사용자 ID 추출 (토큰 기반)
     * 더 이상 필요하지 않음 - getCurrentUserId() 사용
     */
    @Deprecated
    private Long extractUserIdFromPrincipal(Principal principal) {
        return getCurrentUserId();
    }

    /**
     * 사용자 권한 검증 (토큰 기반)
     */
    private boolean hasPermissionToSendMessage(Long userId, Long chatRoomId) {
        try {
            // 실제 권한 검증 로직 구현
            // 예: 채팅방 참여자인지, 차단당하지 않았는지 등
            // chatMessageService에 isUserInChatRoom 메서드가 없다면 다른 방법 사용
            return true; // 임시로 true 반환
        } catch (Exception e) {
            log.error("권한 검증 실패: userId={}, chatRoomId={}, error={}", userId, chatRoomId, e.getMessage());
            return false;
        }
    }
}
