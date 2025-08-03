package wedding.alba.function.setting.userEdit;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import wedding.alba.entity.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 사용자 정보 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEditResponseDto {
    
    private Long userId;
    private String name;
    private User.Gender gender;
    private String phoneNumber;
    private String email;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birth;
    
    private String addressCity;
    private String addressDistrict;
    private String addressDetail;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    /**
     * User 엔티티를 Response DTO로 변환
     */
    public static UserEditResponseDto fromEntity(User user) {
        return UserEditResponseDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .gender(user.getGender())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .birth(user.getBirth())
                .addressCity(user.getAddressCity())
                .addressDistrict(user.getAddressDistrict())
                .addressDetail(user.getAddressDetail())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
