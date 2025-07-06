package wedding.alba.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.ChatRoom;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    /**
     * 1:1 채팅방 찾기 (호스트, 게스트, 포스팅으로)
     */
    Optional<ChatRoom> findByHostUserIdAndGuestUserIdAndPostingId(
        Long hostUserId, Long guestUserId, Long postingId);

    /**
     * 사용자가 생성한 채팅방 목록
     */
    List<ChatRoom> findByCreatorUserIdOrderByCreatedAtDesc(Long creatorUserId);

    /**
     * 채팅방 타입별 조회
     */
    List<ChatRoom> findByTypeOrderByCreatedAtDesc(ChatRoom.ChatRoomType type);

    /**
     * 공개 채팅방 목록
     */
    Page<ChatRoom> findByIsPublicTrueAndTypeOrderByLastActiveAtDesc(
        ChatRoom.ChatRoomType type, Pageable pageable);

    /**
     * 특정 사용자가 참여 중인 채팅방 목록 (조인 쿼리)
     */
    @Query("SELECT DISTINCT cr FROM ChatRoom cr " +
           "JOIN ChatRoomParticipant crp ON cr.chatRoomId = crp.chatRoomId " +
           "WHERE crp.userId = :userId AND crp.isActive = true " +
           "ORDER BY cr.lastMessageAt DESC, cr.createdAt DESC")
    List<ChatRoom> findChatRoomsByUserId(@Param("userId") Long userId);

    /**
     * 활성 채팅방 조회 (최근 활동 기준)
     */
    @Query("SELECT cr FROM ChatRoom cr " +
           "WHERE cr.lastActiveAt >= :since " +
           "ORDER BY cr.lastActiveAt DESC")
    List<ChatRoom> findActiveChatRooms(@Param("since") LocalDateTime since);

    /**
     * 채팅방명으로 검색 (공개 채팅방만)
     */
    @Query("SELECT cr FROM ChatRoom cr " +
           "WHERE cr.isPublic = true " +
           "AND LOWER(cr.roomName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY cr.lastActiveAt DESC")
    List<ChatRoom> searchPublicChatRooms(@Param("keyword") String keyword);

    /**
     * 비활성 채팅방 조회 (정리용)
     */
    @Query("SELECT cr FROM ChatRoom cr " +
           "WHERE cr.lastActiveAt < :threshold " +
           "AND cr.type != 'PERSONAL'")
    List<ChatRoom> findInactiveChatRooms(@Param("threshold") LocalDateTime threshold);

    /**
     * 채팅방 참여자 수 조회
     */
    @Query("SELECT COUNT(crp) FROM ChatRoomParticipant crp " +
           "WHERE crp.chatRoomId = :chatRoomId AND crp.isActive = true")
    int countActiveParticipants(@Param("chatRoomId") Long chatRoomId);
}
