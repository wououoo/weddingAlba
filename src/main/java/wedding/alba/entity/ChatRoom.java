package wedding.alba.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "chat_rooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_room_id")
    private Long chatRoomId;

    @Column(name = "room_name", nullable = false, length = 100)
    private String roomName;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private ChatRoomType type;

    @Column(name = "creator_user_id", nullable = false)
    private Long creatorUserId;

    // 1:1 채팅용 필드들
    @Column(name = "host_user_id")
    private Long hostUserId;

    @Column(name = "guest_user_id")
    private Long guestUserId;

    @Column(name = "posting_id")
    private Long postingId;

    // 그룹 채팅용 필드들
    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "is_public")
    @Builder.Default
    private Boolean isPublic = false;

    @Column(name = "description", length = 500)
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    @Column(name = "last_active_at")
    private LocalDateTime lastActiveAt;

    public enum ChatRoomType {
        PERSONAL,   // 1:1 채팅
        GROUP,      // 소규모 그룹 채팅
        PUBLIC      // 대규모 공개 채팅
    }

    // 편의 메서드들
    @PrePersist
    public void prePersist() {
        if (this.isPublic == null) {
            this.isPublic = false;
        }
        if (this.lastActiveAt == null) {
            this.lastActiveAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.lastActiveAt = LocalDateTime.now();
    }
}
