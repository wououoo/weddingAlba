package wedding.alba.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_room_participants",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"chat_room_id", "user_id"})
       })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_id")
    private Long participantId;

    @Column(name = "chat_room_id", nullable = false)
    private Long chatRoomId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @Builder.Default
    private ParticipantRole role = ParticipantRole.MEMBER;

    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @Column(name = "left_at")
    private LocalDateTime leftAt;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    // 읽음 상태 관리
    @Column(name = "last_read_message_id", length = 36)
    private String lastReadMessageId;

    @Column(name = "last_read_at")
    private LocalDateTime lastReadAt;

    // 알림 설정
    @Column(name = "is_notification_enabled")
    @Builder.Default
    private Boolean isNotificationEnabled = true;

    public enum ParticipantRole {
        ADMIN,      // 관리자 (채팅방 생성자, 초대/강퇴 권한)
        MODERATOR,  // 중재자 (메시지 삭제 권한)
        MEMBER      // 일반 멤버
    }

    // 편의 메서드
    public void leaveChatRoom() {
        this.isActive = false;
        this.leftAt = LocalDateTime.now();
    }

    public void updateLastRead(String messageId) {
        this.lastReadMessageId = messageId;
        this.lastReadAt = LocalDateTime.now();
    }

    public boolean isAdmin() {
        return this.role == ParticipantRole.ADMIN;
    }

    public boolean isModerator() {
        return this.role == ParticipantRole.MODERATOR || this.role == ParticipantRole.ADMIN;
    }
}
