package wedding.alba.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import wedding.alba.entity.ChatRoom;

/**
 * 채팅방 정보와 사용자 정보를 함께 담는 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomWithUserInfo {
    
    private ChatRoom chatRoom;
    
    // 호스트 정보
    private String hostName;
    private String hostNickname;
    private String hostProfileImage;
    
    // 게스트 정보
    private String guestName;
    private String guestNickname;
    private String guestProfileImage;
}
