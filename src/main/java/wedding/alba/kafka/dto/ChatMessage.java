package wedding.alba.kafka.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)  // 🔥 알 수 없는 필드 무시
public class ChatMessage {
    
    private String messageId;           // 메시지 고유 ID
    private Long chatRoomId;           // 채팅방 ID  
    private Long senderId;             // 보낸 사람 ID (항상 1명)
    private String senderName;         // 보낸 사람 이름
    private String senderProfileImage; // 보낸 사람 프로필 이미지
    private String content;            // 메시지 내용
    private MessageType type;          // 메시지 타입
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;   // 전송 시간
    
    // 단체 채팅에서 멘션 기능을 위한 필드
    private Long mentionUserId;        // 멘션된 사용자 ID (@사용자명)
    private boolean isSystemMessage;    // 시스템 메시지 여부 (입장/퇴장 알림 등)
    
    // 파일/이미지 첨부 관련 필드
    private String attachmentUrl;      // 첨부파일 URL
    private String attachmentType;     // 첨부파일 타입 (MIME type)
    
    public enum MessageType {
        CHAT,           // 일반 채팅
        JOIN,           // 입장
        LEAVE,          // 퇴장
        TYPING,         // 타이핑 중
        STOP_TYPING,    // 타이핑 중지
        SYSTEM,         // 시스템 메시지 (공지 등)
        MENTION,        // 멘션 메시지
        FILE,           // 파일 전송
        IMAGE           // 이미지 전송
    }
    
    // 편의 메서드들
    public boolean hasAttachment() {
        return attachmentUrl != null && !attachmentUrl.trim().isEmpty();
    }
    
    public boolean isFileMessage() {
        return type == MessageType.FILE || type == MessageType.IMAGE;
    }
    
    public boolean isTypingMessage() {
        return type == MessageType.TYPING || type == MessageType.STOP_TYPING;
    }
    
    public boolean isStatusMessage() {
        return type == MessageType.JOIN || type == MessageType.LEAVE;
    }
}
