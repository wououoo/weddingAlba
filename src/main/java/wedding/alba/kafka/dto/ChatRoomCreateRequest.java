package wedding.alba.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomCreateRequest {
    
    private Long creatorUserId;
    private String roomName;
    private String roomType; // "PERSONAL", "GROUP", "PUBLIC"
    private List<Long> participantIds;
    private boolean isPublic;
    private String description;
    private Integer maxParticipants;
    
    // 1:1 채팅방용 필드들
    private Long hostUserId;
    private Long guestUserId;
    private Long postingId;
    
    // 검증 메서드
    public boolean isValidForGroupRoom() {
        return creatorUserId != null && 
               roomName != null && !roomName.trim().isEmpty() &&
               (participantIds == null || participantIds.size() <= (maxParticipants != null ? maxParticipants : 100));
    }
    
    public boolean isValidForPersonalRoom() {
        return creatorUserId != null && hostUserId != null && 
               guestUserId != null && postingId != null;
    }
}
