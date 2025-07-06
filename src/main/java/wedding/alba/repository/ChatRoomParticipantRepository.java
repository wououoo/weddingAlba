package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.ChatRoomParticipant;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomParticipantRepository extends JpaRepository<ChatRoomParticipant, Long> {

    /**
     * 채팅방의 활성 참여자 목록
     */
    List<ChatRoomParticipant> findByChatRoomIdAndIsActiveTrueOrderByJoinedAtAsc(Long chatRoomId);

    /**
     * 사용자의 참여 채팅방 목록
     */
    List<ChatRoomParticipant> findByUserIdAndIsActiveTrueOrderByJoinedAtDesc(Long userId);

    /**
     * 특정 사용자의 특정 채팅방 참여 정보
     */
    Optional<ChatRoomParticipant> findByChatRoomIdAndUserId(Long chatRoomId, Long userId);

    /**
     * 채팅방 관리자 목록
     */
    List<ChatRoomParticipant> findByChatRoomIdAndRoleAndIsActiveTrue(
        Long chatRoomId, ChatRoomParticipant.ParticipantRole role);

    /**
     * 사용자가 관리자인 채팅방 목록
     */
    @Query("SELECT crp FROM ChatRoomParticipant crp " +
           "WHERE crp.userId = :userId " +
           "AND crp.role = 'ADMIN' " +
           "AND crp.isActive = true")
    List<ChatRoomParticipant> findAdminChatRooms(@Param("userId") Long userId);

    /**
     * 채팅방 활성 참여자 수
     */
    int countByChatRoomIdAndIsActiveTrue(Long chatRoomId);

    /**
     * 사용자의 읽지 않은 채팅방 수
     */
    @Query("SELECT COUNT(crp) FROM ChatRoomParticipant crp " +
           "JOIN ChatRoom cr ON crp.chatRoomId = cr.chatRoomId " +
           "WHERE crp.userId = :userId " +
           "AND crp.isActive = true " +
           "AND (crp.lastReadAt IS NULL OR crp.lastReadAt < cr.lastMessageAt)")
    int countUnreadChatRooms(@Param("userId") Long userId);

    /**
     * 특정 사용자가 참여 중인지 확인
     */
    boolean existsByChatRoomIdAndUserIdAndIsActiveTrue(Long chatRoomId, Long userId);

    /**
     * 사용자가 관리자인지 확인
     */
    @Query("SELECT COUNT(crp) > 0 FROM ChatRoomParticipant crp " +
           "WHERE crp.chatRoomId = :chatRoomId " +
           "AND crp.userId = :userId " +
           "AND crp.role IN ('ADMIN', 'MODERATOR') " +
           "AND crp.isActive = true")
    boolean isUserAdminOrModerator(@Param("chatRoomId") Long chatRoomId, @Param("userId") Long userId);

    /**
     * 비활성 참여자 정리용
     */
    @Query("SELECT crp FROM ChatRoomParticipant crp " +
           "WHERE crp.isActive = false " +
           "AND crp.leftAt < :threshold")
    List<ChatRoomParticipant> findInactiveParticipants(@Param("threshold") java.time.LocalDateTime threshold);
}
