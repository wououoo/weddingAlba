package wedding.alba.kafka.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import wedding.alba.entity.ChatMessage;
import wedding.alba.entity.ChatRoom;
import wedding.alba.entity.ChatRoomParticipant;
import wedding.alba.repository.ChatMessageRepository;
import wedding.alba.repository.ChatRoomParticipantRepository;
import wedding.alba.repository.ChatRoomRepository;

import java.util.List;
import java.util.Optional;

/**
 * 채팅 성능 최적화 서비스
 * 빠른 채팅방 로딩을 위한 캐시 및 최적화된 쿼리 제공
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatOptimizationService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomParticipantRepository participantRepository;

    /**
     * 채팅방 정보 빠른 조회 (캐시 적용)
     */
    @Cacheable(value = "chatRoom", key = "#chatRoomId")
    public Optional<ChatRoom> getChatRoomFast(Long chatRoomId) {
        log.debug("채팅방 정보 조회: {}", chatRoomId);
        return chatRoomRepository.findById(chatRoomId);
    }

    /**
     * 최근 메시지 빠른 조회 (네이티브 쿼리 사용)
     */
    public List<ChatMessage> getRecentMessagesFast(Long chatRoomId, int limit) {
        log.debug("최근 메시지 조회: chatRoomId={}, limit={}", chatRoomId, limit);
        return chatMessageRepository.findRecentMessagesByChatRoomIdOptimized(
            chatRoomId, limit, 0
        );
    }

    /**
     * 사용자 참여 채팅방 빠른 조회 (캐시 적용)
     */
    @Cacheable(value = "userChatRooms", key = "#userId")
    public List<ChatRoomParticipant> getUserChatRoomsFast(Long userId) {
        log.debug("사용자 채팅방 조회: {}", userId);
        return participantRepository.findByUserIdAndIsActiveTrueOrderByJoinedAtDesc(userId);
    }

    /**
     * 읽지 않은 메시지 수 빠른 조회
     */
    @Cacheable(value = "unreadCount", key = "#chatRoomId + '_' + #userId")
    public int getUnreadCountFast(Long chatRoomId, Long userId) {
        log.debug("읽지 않은 메시지 수 조회: chatRoomId={}, userId={}", chatRoomId, userId);
        return chatMessageRepository.countUnreadMessages(chatRoomId, userId);
    }

    /**
     * 채팅방 마지막 메시지 빠른 조회
     */
    @Cacheable(value = "lastMessage", key = "#chatRoomId")
    public ChatMessage getLastMessageFast(Long chatRoomId) {
        log.debug("마지막 메시지 조회: {}", chatRoomId);
        return chatMessageRepository.findLastMessageByChatRoomId(chatRoomId);
    }

    /**
     * 채팅방 빠른 초기화 데이터 (한 번에 필요한 모든 데이터)
     */
    public ChatRoomInitData getChatRoomInitDataFast(Long chatRoomId, Long userId) {
        log.info("채팅방 초기화 데이터 조회 시작: chatRoomId={}, userId={}", chatRoomId, userId);
        
        long startTime = System.currentTimeMillis();
        
        // 병렬로 데이터 조회
        ChatRoom chatRoom = getChatRoomFast(chatRoomId).orElse(null);
        List<ChatMessage> recentMessages = getRecentMessagesFast(chatRoomId, 20);
        int unreadCount = getUnreadCountFast(chatRoomId, userId);
        
        long endTime = System.currentTimeMillis();
        log.info("채팅방 초기화 데이터 조회 완료: {}ms", endTime - startTime);
        
        return ChatRoomInitData.builder()
            .chatRoom(chatRoom)
            .recentMessages(recentMessages)
            .unreadCount(unreadCount)
            .build();
    }

    /**
     * 채팅방 초기화 데이터 DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class ChatRoomInitData {
        private ChatRoom chatRoom;
        private List<ChatMessage> recentMessages;
        private int unreadCount;
    }
}
