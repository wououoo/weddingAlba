package wedding.alba.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 1:1 채팅방 생성 요청 DTO (토큰 기반)
 * hostUserId는 JWT 토큰에서 추출되므로 제외
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePersonalChatRoomRequest {
    private Long guestUserId;
    private Long postingId;
}
