package wedding.alba.function.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 사용자 기본 정보 + 프로필 정보 통합 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponseDto {
    
    // User 기본 정보
    private Long userId;
    private String name;
    private String email;
    private String gender;
    private String phoneNumber;
    private LocalDate birth;
    private String addressCity;
    private String addressDistrict;
    private String addressDetail;
    
    // Profile 정보 (없을 수 있음)
    private String nickname;         // 프로필이 있을 때만 필수
    private String selfIntroduction; // 선택
    private String activityArea;     // 선택
    private Integer guestPower;      // 선택
    private Integer participationCount; // 선택
    private String profileImageUrl;  // 선택
}
