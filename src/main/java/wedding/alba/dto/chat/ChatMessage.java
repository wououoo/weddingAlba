package wedding.alba.dto.chat;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    
    private String messageId;           // 메시지 고유 ID
    private Long chatRoomId;           // 채팅방 ID  
    private Long senderId;             // 보낸 사람 ID
    private String senderName;         // 보낸 사람 이름
    private String senderProfileImage; // 보낸 사람 프로필 이미지
    private String content;            // 메시지 내용
    private MessageType type;          // 메시지 타입
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;   // 전송 시간
    
    public enum MessageType {
        CHAT,           // 일반 채팅
        JOIN,           // 입장
        LEAVE,          // 퇴장
        TYPING,         // 타이핑 중
        STOP_TYPING     // 타이핑 중지
    }
}
