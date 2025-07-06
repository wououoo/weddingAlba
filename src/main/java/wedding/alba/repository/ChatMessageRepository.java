package wedding.alba.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.ChatMessage;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {

    /**
     * 채팅방별 메시지 조회 (페이징, 타이핑 메시지 제외)
     * 성능 최적화: 인덱스 힌트 추가
     */
    @Query(value = "SELECT cm.* FROM chat_messages cm " +
           "WHERE cm.chat_room_id = :chatRoomId " +
           "AND cm.is_deleted = false " +
           "AND cm.message_type NOT IN ('TYPING', 'STOP_TYPING') " +
           "ORDER BY cm.timestamp DESC " +
           "LIMIT :limit OFFSET :offset", nativeQuery = true)
    List<ChatMessage> findRecentMessagesByChatRoomIdOptimized(
        @Param("chatRoomId") Long chatRoomId,
        @Param("limit") int limit,
        @Param("offset") int offset);

    /**
     * 채팅방별 메시지 조회 (페이징, 타이핑 메시지 제외)
     */
    @Query("SELECT cm FROM ChatMessage cm " +
           "WHERE cm.chatRoomId = :chatRoomId " +
           "AND cm.isDeleted = false " +
           "AND cm.type NOT IN ('TYPING', 'STOP_TYPING') " +
           "ORDER BY cm.timestamp DESC")
    Page<ChatMessage> findByChatRoomIdOrderByTimestampDesc(
        @Param("chatRoomId") Long chatRoomId, Pageable pageable);

    /**
     * 특정 시간 이후 메시지 조회
     */
    List<ChatMessage> findByChatRoomIdAndTimestampAfterAndIsDeletedFalseOrderByTimestampAsc(
        Long chatRoomId, LocalDateTime since);

    /**
     * 사용자가 보낸 메시지 조회
     */
    Page<ChatMessage> findBySenderIdAndIsDeletedFalseOrderByTimestampDesc(
        Long senderId, Pageable pageable);

    /**
     * 멘션된 메시지 조회
     */
    List<ChatMessage> findByMentionUserIdAndChatRoomIdAndIsDeletedFalseOrderByTimestampDesc(
        Long mentionUserId, Long chatRoomId);

    /**
     * 시스템 메시지 조회
     */
    List<ChatMessage> findByChatRoomIdAndIsSystemMessageTrueAndIsDeletedFalseOrderByTimestampDesc(
        Long chatRoomId);

    /**
     * 채팅방 마지막 메시지 조회
     */
    @Query("SELECT cm FROM ChatMessage cm " +
           "WHERE cm.chatRoomId = :chatRoomId " +
           "AND cm.isDeleted = false " +
           "AND cm.type NOT IN ('TYPING', 'STOP_TYPING') " +
           "ORDER BY cm.timestamp DESC " +
           "LIMIT 1")
    ChatMessage findLastMessageByChatRoomId(@Param("chatRoomId") Long chatRoomId);

    /**
     * 특정 사용자의 읽지 않은 메시지 수
     */
    @Query("SELECT COUNT(cm) FROM ChatMessage cm " +
           "WHERE cm.chatRoomId = :chatRoomId " +
           "AND cm.senderId != :userId " +
           "AND cm.isDeleted = false " +
           "AND cm.type NOT IN ('TYPING', 'STOP_TYPING') " +
           "AND cm.timestamp > " +
           "(SELECT COALESCE(crp.lastReadAt, '1970-01-01') FROM ChatRoomParticipant crp " +
           " WHERE crp.chatRoomId = :chatRoomId AND crp.userId = :userId)")
    int countUnreadMessages(@Param("chatRoomId") Long chatRoomId, @Param("userId") Long userId);

    /**
     * 메시지 검색
     */
    @Query("SELECT cm FROM ChatMessage cm " +
           "WHERE cm.chatRoomId = :chatRoomId " +
           "AND cm.isDeleted = false " +
           "AND LOWER(cm.content) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY cm.timestamp DESC")
    List<ChatMessage> searchMessages(@Param("chatRoomId") Long chatRoomId, 
                                   @Param("keyword") String keyword);

    /**
     * 파일/이미지 메시지 조회
     */
    List<ChatMessage> findByChatRoomIdAndTypeInAndIsDeletedFalseOrderByTimestampDesc(
        Long chatRoomId, List<ChatMessage.MessageType> types);

    /**
     * 오래된 메시지 삭제를 위한 조회
     */
    @Query("SELECT cm FROM ChatMessage cm " +
           "WHERE cm.timestamp < :threshold " +
           "AND cm.type IN ('TYPING', 'STOP_TYPING')")
    List<ChatMessage> findOldTypingMessages(@Param("threshold") LocalDateTime threshold);
}
