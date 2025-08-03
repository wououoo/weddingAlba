package wedding.alba.function.setting.userEdit;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import wedding.alba.entity.User;

import java.time.LocalDate;

/**
 * 사용자 정보 수정 요청 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEditRequestDto {
    
    @NotBlank(message = "이름은 필수 입력 항목입니다")
    private String name;
    
    private User.Gender gender;
    
    // 전화번호 검증 완화 - 비어있어도 됨
    @Pattern(regexp = "^$|^01[0-9]-\\d{3,4}-\\d{4}$", message = "올바른 전화번호 형식이 아닙니다")
    private String phoneNumber;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birth;
    
    // 주소 정보
    private String addressCity;      // 권역 (서울/경기/인천, 대전/충청 등)
    private String addressDistrict;  // 시/군/구
    private String addressDetail;    // 세부주소
}
