package wedding.alba.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {
    
    private String messageId;
    private Long chatRoomId;
    private Long senderId;
    private String senderName;
    private String senderProfileImage;
    private String content;
    private String messageType; // "CHAT", "MENTION", "FILE", "IMAGE" 등
    private Long mentionUserId;
    private String attachmentUrl;
    private String attachmentType;
    
    // 검증 메서드
    public boolean isValid() {
        return chatRoomId != null && senderId != null && 
               ((content != null && !content.trim().isEmpty()) || attachmentUrl != null);
    }
    
    // 메시지 타입 기본값
    public String getMessageType() {
        return messageType != null ? messageType : "CHAT";
    }
}
