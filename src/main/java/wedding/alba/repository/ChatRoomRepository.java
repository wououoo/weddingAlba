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
     * 특정 사용자가 참여 중인 채팅방 ID 목록 조회 (서비스에서 정렬 처리)
     */
    @Query("SELECT DISTINCT crp.chatRoomId FROM ChatRoomParticipant crp " +
           "WHERE crp.userId = :userId AND crp.isActive = true")
    List<Long> findChatRoomIdsByUserId(@Param("userId") Long userId);
    
    /**
     * 채팅방 ID 목록으로 채팅방 조회 (정렬 없이)
     */
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.chatRoomId IN :chatRoomIds")
    List<ChatRoom> findChatRoomsByIds(@Param("chatRoomIds") List<Long> chatRoomIds);
    
    /**
     * 1:1 채팅방 목록 조회 (사용자 정보 포함) - 네이티브 쿼리 사용
     */
    @Query(value = "SELECT cr.chat_room_id, cr.room_name, cr.room_type, cr.creator_user_id, " +
                   "       cr.host_user_id, cr.guest_user_id, cr.posting_id, " +
                   "       cr.max_participants, cr.is_public, cr.description, " +
                   "       cr.created_at, cr.last_message_at, cr.last_active_at, cr.updated_at, " +
                   "       hu.name AS host_name, hp.nickname AS host_nickname, hp.profile_image_url AS host_profile_image, " +
                   "       gu.name AS guest_name, gp.nickname AS guest_nickname, gp.profile_image_url AS guest_profile_image " +
                   "FROM chat_rooms cr " +
                   "LEFT JOIN users hu ON cr.host_user_id = hu.user_id " +
                   "LEFT JOIN profiles hp ON cr.host_user_id = hp.user_id " +
                   "LEFT JOIN users gu ON cr.guest_user_id = gu.user_id " +
                   "LEFT JOIN profiles gp ON cr.guest_user_id = gp.user_id " +
                   "WHERE cr.chat_room_id IN :chatRoomIds", 
           nativeQuery = true)
    List<Object[]> findChatRoomsWithUserInfoByIds(@Param("chatRoomIds") List<Long> chatRoomIds);

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
