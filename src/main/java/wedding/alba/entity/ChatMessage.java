package wedding.alba.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    @Id
    @Column(name = "message_id", length = 36) // UUID용
    private String messageId;

    @Column(name = "chat_room_id", nullable = false)
    private Long chatRoomId;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "sender_name", length = 50)
    private String senderName;

    @Column(name = "sender_profile_image", length = 500)
    private String senderProfileImage;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false)
    private MessageType type;

    @CreationTimestamp
    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp;

    // 멘션 기능용
    @Column(name = "mention_user_id")
    private Long mentionUserId;

    @Column(name = "is_system_message")
    @Builder.Default
    private Boolean isSystemMessage = false;

    // 메시지 상태
    @Column(name = "is_deleted")
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // 첨부파일 관련 (추후 확장용)
    @Column(name = "attachment_url", length = 500)
    private String attachmentUrl;

    @Column(name = "attachment_type", length = 20)
    private String attachmentType;

    public enum MessageType {
        CHAT,           // 일반 채팅
        JOIN,           // 입장
        LEAVE,          // 퇴장
        TYPING,         // 타이핑 중 (DB에 저장하지 않음)
        STOP_TYPING,    // 타이핑 중지 (DB에 저장하지 않음)
        SYSTEM,         // 시스템 메시지
        MENTION,        // 멘션 메시지
        FILE,           // 파일 전송
        IMAGE           // 이미지 전송
    }

    @PrePersist
    public void prePersist() {
        if (this.isSystemMessage == null) {
            this.isSystemMessage = false;
        }
        if (this.isDeleted == null) {
            this.isDeleted = false;
        }
    }

    // 편의 메서드
    public boolean isTypingMessage() {
        return this.type == MessageType.TYPING || this.type == MessageType.STOP_TYPING;
    }

    public void softDelete() {
        this.isDeleted = true;
        this.deletedAt = LocalDateTime.now();
        this.content = "삭제된 메시지입니다.";
    }
}
