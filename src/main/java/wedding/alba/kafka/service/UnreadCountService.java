package wedding.alba.kafka.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import wedding.alba.kafka.dto.UnreadCountEvent;
import wedding.alba.kafka.dto.UnreadCountResponse;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * 안읽은 메시지 카운트 관리 서비스
 * Kafka 기반으로 실시간 카운트 처리
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UnreadCountService {

    private final RedisTemplate<String, String> redisTemplate;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    
    // Redis Key 패턴
    private static final String UNREAD_COUNT_KEY = "unread_count:%d:%d";  // userId:chatRoomId
    private static final String TOTAL_UNREAD_KEY = "total_unread:%d";     // userId
    private static final String USER_CHATROOMS_KEY = "user_chatrooms:%d"; // userId의 채팅방 목록
    
    // Kafka Topic
    private static final String UNREAD_COUNT_TOPIC = "unread-count-topic";

    /**
     * 새 메시지 발송 시 안읽은 카운트 증가
     */
    public void handleNewMessage(Long chatRoomId, String messageId, Long senderId, 
                               String senderName, String content, java.util.List<Long> recipientIds) {
        
        log.debug("새 메시지 안읽은 카운트 처리: chatRoomId={}, messageId={}, recipients={}", 
                chatRoomId, messageId, recipientIds);
        
        // 발신자 제외한 수신자들의 카운트 증가
        recipientIds.stream()
            .filter(recipientId -> !recipientId.equals(senderId))
            .forEach(recipientId -> {
                
                // 1. 채팅방별 카운트 증가
                String unreadKey = String.format(UNREAD_COUNT_KEY, recipientId, chatRoomId);
                redisTemplate.opsForValue().increment(unreadKey);
                
                // 2. 전체 카운트 증가
                String totalKey = String.format(TOTAL_UNREAD_KEY, recipientId);
                redisTemplate.opsForValue().increment(totalKey);
                
                // 3. 사용자 채팅방 목록에 추가 (Set 사용)
                String userRoomsKey = String.format(USER_CHATROOMS_KEY, recipientId);
                redisTemplate.opsForSet().add(userRoomsKey, chatRoomId.toString());
                
                // 4. Kafka 이벤트 발송 (실시간 업데이트용)
                UnreadCountEvent event = UnreadCountEvent.builder()
                    .eventType(UnreadCountEvent.EventType.MESSAGE_SENT)
                    .chatRoomId(chatRoomId)
                    .messageId(messageId)
                    .senderId(senderId)
                    .senderName(senderName)
                    .recipientId(recipientId)
                    .content(content)
                    .timestamp(LocalDateTime.now())
                    .build();
                
                try {
                    String eventJson = objectMapper.writeValueAsString(event);
                    kafkaTemplate.send(UNREAD_COUNT_TOPIC, eventJson);
                } catch (Exception e) {
                    log.error("Kafka 이벤트 전송 실패: {}", e.getMessage(), e);
                }
                
                log.debug("안읽은 카운트 증가: userId={}, chatRoomId={}", recipientId, chatRoomId);
            });
    }

    /**
     * 메시지 읽음 처리 (채팅방의 모든 안읽은 메시지)
     */
    public void markChatRoomAsRead(Long userId, Long chatRoomId) {
        log.debug("채팅방 읽음 처리: userId={}, chatRoomId={}", userId, chatRoomId);
        
        // 1. 현재 채팅방의 안읽은 개수 조회
        String unreadKey = String.format(UNREAD_COUNT_KEY, userId, chatRoomId);
        String unreadCountStr = redisTemplate.opsForValue().get(unreadKey);
        
        if (unreadCountStr != null) {
            int unreadCount = Integer.parseInt(unreadCountStr);
            
            if (unreadCount > 0) {
                // 2. 채팅방별 카운트 삭제
                redisTemplate.delete(unreadKey);
                
                // 3. 전체 카운트에서 차감
                String totalKey = String.format(TOTAL_UNREAD_KEY, userId);
                redisTemplate.opsForValue().increment(totalKey, -unreadCount);
                
                // 4. Kafka 이벤트 발송
                UnreadCountEvent event = UnreadCountEvent.builder()
                    .eventType(UnreadCountEvent.EventType.MESSAGE_READ)
                    .chatRoomId(chatRoomId)
                    .recipientId(userId)
                    .unreadCount(0)  // 읽음 처리 후 0
                    .timestamp(LocalDateTime.now())
                    .build();
                
                try {
                    String eventJson = objectMapper.writeValueAsString(event);
                    kafkaTemplate.send(UNREAD_COUNT_TOPIC, eventJson);
                } catch (Exception e) {
                    log.error("Kafka 이벤트 전송 실패: {}", e.getMessage(), e);
                }
                
                log.debug("채팅방 읽음 처리 완료: userId={}, chatRoomId={}, readCount={}", 
                        userId, chatRoomId, unreadCount);
            }
        }
    }

    /**
     * 사용자의 전체 안읽은 메시지 카운트 조회
     */
    public UnreadCountResponse getUserUnreadCounts(Long userId) {
        try {
            // 1. 사용자가 참여한 채팅방 목록 조회
            String userRoomsKey = String.format(USER_CHATROOMS_KEY, userId);
            Set<String> chatRoomIds = redisTemplate.opsForSet().members(userRoomsKey);
            
            Map<Long, Integer> chatRoomUnreadCounts = new HashMap<>();
            int totalUnread = 0;
            
            // 2. 각 채팅방별 안읽은 개수 조회
            if (chatRoomIds != null) {
                for (String chatRoomIdStr : chatRoomIds) {
                    Long chatRoomId = Long.parseLong(chatRoomIdStr);
                    String unreadKey = String.format(UNREAD_COUNT_KEY, userId, chatRoomId);
                    String countStr = redisTemplate.opsForValue().get(unreadKey);
                    
                    int count = 0;
                    if (countStr != null) {
                        count = Integer.parseInt(countStr);
                    }
                    
                    if (count > 0) {
                        chatRoomUnreadCounts.put(chatRoomId, count);
                        totalUnread += count;
                    }
                }
            }
            
            return UnreadCountResponse.builder()
                .userId(userId)
                .chatRoomUnreadCounts(chatRoomUnreadCounts)
                .totalUnreadCount(totalUnread)
                .lastUpdated(LocalDateTime.now().toString())
                .build();
                
        } catch (Exception e) {
            log.error("안읽은 메시지 카운트 조회 실패: userId={}", userId, e);
            return UnreadCountResponse.builder()
                .userId(userId)
                .chatRoomUnreadCounts(new HashMap<>())
                .totalUnreadCount(0)
                .lastUpdated(LocalDateTime.now().toString())
                .build();
        }
    }

    /**
     * 특정 채팅방의 안읽은 메시지 개수 조회
     */
    public int getChatRoomUnreadCount(Long userId, Long chatRoomId) {
        try {
            String unreadKey = String.format(UNREAD_COUNT_KEY, userId, chatRoomId);
            String countStr = redisTemplate.opsForValue().get(unreadKey);
            return countStr != null ? Integer.parseInt(countStr) : 0;
        } catch (Exception e) {
            log.error("채팅방 안읽은 카운트 조회 실패: userId={}, chatRoomId={}", userId, chatRoomId, e);
            return 0;
        }
    }

    /**
     * Kafka Consumer: 안읽은 카운트 이벤트 처리
     */
    @KafkaListener(topics = UNREAD_COUNT_TOPIC, groupId = "unread-count-group")
    public void handleUnreadCountEvent(String eventJson) {
        try {
            UnreadCountEvent event = objectMapper.readValue(eventJson, UnreadCountEvent.class);
            log.debug("안읽은 카운트 이벤트 처리: {}", event);
            
            switch (event.getEventType()) {
                case MESSAGE_SENT:
                    // WebSocket으로 실시간 카운트 업데이트 전송
                    sendUnreadCountUpdate(event.getRecipientId());
                    break;
                    
                case MESSAGE_READ:
                case ROOM_ENTERED:
                    // WebSocket으로 실시간 카운트 업데이트 전송
                    sendUnreadCountUpdate(event.getRecipientId());
                    break;
                    
                default:
                    log.warn("알 수 없는 이벤트 타입: {}", event.getEventType());
                    break;
            }
            
        } catch (Exception e) {
            log.error("안읽은 카운트 이벤트 처리 실패: eventJson={}, error={}", eventJson, e.getMessage(), e);
        }
    }

    /**
     * WebSocket으로 실시간 카운트 업데이트 전송
     */
    private void sendUnreadCountUpdate(Long userId) {
        try {
            UnreadCountResponse response = getUserUnreadCounts(userId);
            
            // TODO: WebSocket 서비스로 실시간 전송
            // webSocketService.sendToUser(userId, response);
            
            log.debug("실시간 카운트 업데이트 전송: userId={}, total={}", 
                    userId, response.getTotalUnreadCount());
                    
        } catch (Exception e) {
            log.error("실시간 카운트 업데이트 전송 실패: userId={}", userId, e);
        }
    }

    /**
     * 사용자별 안읽은 카운트 초기화 (디버깅용)
     */
    public void resetUserUnreadCounts(Long userId) {
        try {
            // 1. 사용자의 모든 채팅방 안읽은 카운트 삭제
            String userRoomsKey = String.format(USER_CHATROOMS_KEY, userId);
            Set<String> chatRoomIds = redisTemplate.opsForSet().members(userRoomsKey);
            
            if (chatRoomIds != null) {
                for (String chatRoomIdStr : chatRoomIds) {
                    Long chatRoomId = Long.parseLong(chatRoomIdStr);
                    String unreadKey = String.format(UNREAD_COUNT_KEY, userId, chatRoomId);
                    redisTemplate.delete(unreadKey);
                }
            }
            
            // 2. 전체 카운트 삭제
            String totalKey = String.format(TOTAL_UNREAD_KEY, userId);
            redisTemplate.delete(totalKey);
            
            // 3. 채팅방 목록 삭제
            redisTemplate.delete(userRoomsKey);
            
            log.info("사용자 안읽은 카운트 초기화 완료: userId={}", userId);
            
        } catch (Exception e) {
            log.error("사용자 안읽은 카운트 초기화 실패: userId={}", userId, e);
        }
    }
}