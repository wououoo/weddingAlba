package wedding.alba.function.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 프로필 정보 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDto {
    
    private Long userId;
    private String nickname;         // 필수
    private String selfIntroduction; // 선택
    private String activityArea;     // 선택
    private Integer guestPower;      // 선택
    private Integer participationCount; // 선택
    private String profileImageUrl;  // 선택
}
