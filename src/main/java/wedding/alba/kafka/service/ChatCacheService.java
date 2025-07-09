package wedding.alba.kafka.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import wedding.alba.kafka.dto.ChatMessage;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * 🚀 채팅 성능 최적화를 위한 Redis 캐싱 서비스
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatCacheService {

    private final RedisTemplate<String, Object> redisTemplate;
    
    private static final String TYPING_KEY_PREFIX = "chat:typing:";
    private static final String ONLINE_USERS_KEY_PREFIX = "chat:online:";
    private static final String RECENT_MESSAGES_KEY_PREFIX = "chat:recent:";
    private static final Duration TYPING_EXPIRY = Duration.ofSeconds(10);
    private static final Duration ONLINE_EXPIRY = Duration.ofMinutes(5);
    private static final Duration RECENT_MESSAGES_EXPIRY = Duration.ofMinutes(30);

    /**
     * 🚀 타이핑 상태 캐싱 (DB 저장 없이 Redis만 사용)
     */
    public void setTypingStatus(Long chatRoomId, Long userId, String userName, boolean isTyping) {
        try {
            String key = TYPING_KEY_PREFIX + chatRoomId;
            
            if (isTyping) {
                // 타이핑 시작
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("userId", userId);
                userInfo.put("userName", userName);
                userInfo.put("timestamp", System.currentTimeMillis());
                
                redisTemplate.opsForHash().put(key, userId.toString(), userInfo);
                redisTemplate.expire(key, TYPING_EXPIRY);
                
                log.trace("타이핑 상태 저장: chatRoomId={}, userId={}", chatRoomId, userId);
            } else {
                // 타이핑 중지
                redisTemplate.opsForHash().delete(key, userId.toString());
                
                log.trace("타이핑 상태 제거: chatRoomId={}, userId={}", chatRoomId, userId);
            }
            
        } catch (Exception e) {
            log.error("타이핑 상태 캐싱 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 채팅방의 현재 타이핑 중인 사용자 목록 조회
     */
    public List<Map<String, Object>> getTypingUsers(Long chatRoomId) {
        try {
            String key = TYPING_KEY_PREFIX + chatRoomId;
            Map<Object, Object> typingUsers = redisTemplate.opsForHash().entries(key);
            
            List<Map<String, Object>> result = new ArrayList<>();
            long currentTime = System.currentTimeMillis();
            
            for (Map.Entry<Object, Object> entry : typingUsers.entrySet()) {
                @SuppressWarnings("unchecked")
                Map<String, Object> userInfo = (Map<String, Object>) entry.getValue();
                Long timestamp = (Long) userInfo.get("timestamp");
                
                // 10초 이내의 타이핑 상태만 유효
                if (currentTime - timestamp <= TYPING_EXPIRY.toMillis()) {
                    result.add(userInfo);
                } else {
                    // 만료된 타이핑 상태 제거
                    redisTemplate.opsForHash().delete(key, entry.getKey());
                }
            }
            
            return result;
            
        } catch (Exception e) {
            log.error("타이핑 사용자 목록 조회 실패: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * 🚀 온라인 사용자 상태 관리
     */
    public void setUserOnlineStatus(Long chatRoomId, Long userId, String userName, boolean isOnline) {
        try {
            String key = ONLINE_USERS_KEY_PREFIX + chatRoomId;
            
            if (isOnline) {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("userId", userId);
                userInfo.put("userName", userName);
                userInfo.put("lastSeen", System.currentTimeMillis());
                
                redisTemplate.opsForHash().put(key, userId.toString(), userInfo);
                redisTemplate.expire(key, ONLINE_EXPIRY);
                
                log.debug("사용자 온라인 상태 저장: chatRoomId={}, userId={}", chatRoomId, userId);
            } else {
                // 오프라인 시 lastSeen 업데이트 후 제거
                redisTemplate.opsForHash().delete(key, userId.toString());
                
                log.debug("사용자 오프라인 상태: chatRoomId={}, userId={}", chatRoomId, userId);
            }
            
        } catch (Exception e) {
            log.error("온라인 상태 관리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 채팅방의 온라인 사용자 목록 조회
     */
    public List<Map<String, Object>> getOnlineUsers(Long chatRoomId) {
        try {
            String key = ONLINE_USERS_KEY_PREFIX + chatRoomId;
            Map<Object, Object> onlineUsers = redisTemplate.opsForHash().entries(key);
            
            List<Map<String, Object>> result = new ArrayList<>();
            long currentTime = System.currentTimeMillis();
            
            for (Map.Entry<Object, Object> entry : onlineUsers.entrySet()) {
                @SuppressWarnings("unchecked")
                Map<String, Object> userInfo = (Map<String, Object>) entry.getValue();
                Long lastSeen = (Long) userInfo.get("lastSeen");
                
                // 5분 이내에 활동한 사용자만 온라인으로 간주
                if (currentTime - lastSeen <= ONLINE_EXPIRY.toMillis()) {
                    result.add(userInfo);
                } else {
                    // 만료된 온라인 상태 제거
                    redisTemplate.opsForHash().delete(key, entry.getKey());
                }
            }
            
            return result;
            
        } catch (Exception e) {
            log.error("온라인 사용자 목록 조회 실패: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * 🚀 최근 메시지 캐싱 (빠른 조회를 위해)
     */
    public void cacheRecentMessages(Long chatRoomId, List<ChatMessage> messages) {
        try {
            String key = RECENT_MESSAGES_KEY_PREFIX + chatRoomId;
            
            // 최근 50개 메시지만 캐싱
            List<ChatMessage> recentMessages = messages.size() > 50 
                ? messages.subList(0, 50) 
                : messages;
            
            redisTemplate.opsForValue().set(key, recentMessages, RECENT_MESSAGES_EXPIRY);
            
            log.debug("최근 메시지 캐싱: chatRoomId={}, messageCount={}", chatRoomId, recentMessages.size());
            
        } catch (Exception e) {
            log.error("최근 메시지 캐싱 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 캐시된 최근 메시지 조회
     */
    @SuppressWarnings("unchecked")
    public List<ChatMessage> getCachedRecentMessages(Long chatRoomId) {
        try {
            String key = RECENT_MESSAGES_KEY_PREFIX + chatRoomId;
            Object cached = redisTemplate.opsForValue().get(key);
            
            if (cached != null) {
                return (List<ChatMessage>) cached;
            }
            
            return null;
            
        } catch (Exception e) {
            log.error("캐시된 최근 메시지 조회 실패: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * 🚀 읽지 않은 메시지 수 캐싱
     */
    public void cacheUnreadCount(Long chatRoomId, Long userId, int count) {
        try {
            String key = "chat:unread:" + chatRoomId + ":" + userId;
            redisTemplate.opsForValue().set(key, count, Duration.ofMinutes(10));
            
            log.trace("읽지 않은 메시지 수 캐싱: chatRoomId={}, userId={}, count={}", 
                    chatRoomId, userId, count);
            
        } catch (Exception e) {
            log.error("읽지 않은 메시지 수 캐싱 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 캐시된 읽지 않은 메시지 수 조회
     */
    public Integer getCachedUnreadCount(Long chatRoomId, Long userId) {
        try {
            String key = "chat:unread:" + chatRoomId + ":" + userId;
            Object cached = redisTemplate.opsForValue().get(key);
            
            if (cached != null) {
                return (Integer) cached;
            }
            
            return null;
            
        } catch (Exception e) {
            log.error("캐시된 읽지 않은 메시지 수 조회 실패: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * 🚀 채팅방 세션 관리
     */
    public void addUserToRoom(Long chatRoomId, Long userId, String sessionId) {
        try {
            String key = "chat:sessions:" + chatRoomId;
            Map<String, Object> sessionInfo = new HashMap<>();
            sessionInfo.put("userId", userId);
            sessionInfo.put("sessionId", sessionId);
            sessionInfo.put("joinTime", System.currentTimeMillis());
            
            redisTemplate.opsForHash().put(key, userId.toString(), sessionInfo);
            redisTemplate.expire(key, Duration.ofHours(1));
            
            log.debug("사용자 채팅방 세션 추가: chatRoomId={}, userId={}, sessionId={}", 
                    chatRoomId, userId, sessionId);
            
        } catch (Exception e) {
            log.error("채팅방 세션 추가 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 채팅방에서 사용자 세션 제거
     */
    public void removeUserFromRoom(Long chatRoomId, Long userId) {
        try {
            String key = "chat:sessions:" + chatRoomId;
            redisTemplate.opsForHash().delete(key, userId.toString());
            
            log.debug("사용자 채팅방 세션 제거: chatRoomId={}, userId={}", chatRoomId, userId);
            
        } catch (Exception e) {
            log.error("채팅방 세션 제거 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 채팅방의 활성 세션 목록 조회
     */
    public List<Map<String, Object>> getActiveSessionsInRoom(Long chatRoomId) {
        try {
            String key = "chat:sessions:" + chatRoomId;
            Map<Object, Object> sessions = redisTemplate.opsForHash().entries(key);
            
            List<Map<String, Object>> result = new ArrayList<>();
            
            for (Map.Entry<Object, Object> entry : sessions.entrySet()) {
                @SuppressWarnings("unchecked")
                Map<String, Object> sessionInfo = (Map<String, Object>) entry.getValue();
                result.add(sessionInfo);
            }
            
            return result;
            
        } catch (Exception e) {
            log.error("활성 세션 목록 조회 실패: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * 🚀 캐시 정리 (스케줄링 작업용)
     */
    public void cleanupExpiredCache() {
        try {
            // 만료된 타이핑 상태 정리
            Set<String> typingKeys = redisTemplate.keys(TYPING_KEY_PREFIX + "*");
            if (typingKeys != null && !typingKeys.isEmpty()) {
                for (String key : typingKeys) {
                    Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);
                    if (ttl != null && ttl <= 0) {
                        redisTemplate.delete(key);
                    }
                }
            }

            // 만료된 온라인 상태 정리
            Set<String> onlineKeys = redisTemplate.keys(ONLINE_USERS_KEY_PREFIX + "*");
            if (onlineKeys != null && !onlineKeys.isEmpty()) {
                for (String key : onlineKeys) {
                    Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);
                    if (ttl != null && ttl <= 0) {
                        redisTemplate.delete(key);
                    }
                }
            }
            
            log.debug("만료된 채팅 캐시 정리 완료");
            
        } catch (Exception e) {
            log.error("캐시 정리 실패: {}", e.getMessage(), e);
        }
    }
}
