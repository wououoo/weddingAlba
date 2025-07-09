package wedding.alba.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 사용자 초대 요청 DTO (토큰 기반)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InviteUserRequest {
    private Long userId; // 초대할 사용자 ID
}
