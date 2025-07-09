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
public class ChatRoomResponse {
    
    private Long chatRoomId;
    private String roomName;
    private String type;
    private Long creatorUserId;
    
    // 1:1 채팅방용 필드들
    private Long hostUserId;
    private Long guestUserId;
    private Long postingId;
    
    // 1:1 채팅방 상대방 정보 (새로 추가)
    private String hostName;           // 호스트 이름
    private String hostNickname;       // 호스트 닉네임
    private String hostProfileImage;   // 호스트 프로필 이미지
    private String guestName;          // 게스트 이름
    private String guestNickname;      // 게스트 닉네임
    private String guestProfileImage;  // 게스트 프로필 이미지
    
    // 그룹 채팅방용 필드들
    private Integer maxParticipants;
    private Boolean isPublic;
    private String description;
    
    // 메타데이터
    private LocalDateTime createdAt;
    private LocalDateTime lastMessageAt;
    private LocalDateTime lastActiveAt;
    
    // 추가 정보 (선택적)
    private Integer participantCount;
    private Integer unreadMessageCount;
    private String lastMessage;
    private String lastMessageSender;
}
