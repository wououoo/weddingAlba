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
 * 사용자 정보 수정 관련 DTO 클래스
 */
public class UserEditDto {

    /**
     * 사용자 정보 수정 요청 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        
        @NotBlank(message = "이름은 필수 입력 항목입니다")
        private String name;
        
        private User.Gender gender;
        
        @Pattern(regexp = "^01[0-9]-\\d{3,4}-\\d{4}$", message = "올바른 전화번호 형식이 아닙니다")
        private String phoneNumber;
        
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate birth;
        
        // 주소 정보
        private String addressCity;      // 권역 (서울/경기/인천, 대전/충청 등)
        private String addressDistrict;  // 시/군/구
        private String addressDetail;    // 세부주소
    }
    
    /**
     * 사용자 정보 응답 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        
        private Long userId;
        private String name;
        private User.Gender gender;
        private String phoneNumber;
        
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate birth;
        
        private String addressCity;
        private String addressDistrict;
        private String addressDetail;
        
        /**
         * User 엔티티를 Response DTO로 변환
         */
        public static Response fromEntity(User user) {
            return Response.builder()
                    .userId(user.getUserId())
                    .name(user.getName())
                    .gender(user.getGender())
                    .phoneNumber(user.getPhoneNumber())
                    .birth(user.getBirth())
                    .addressCity(user.getAddressCity())
                    .addressDistrict(user.getAddressDistrict())
                    .addressDetail(user.getAddressDetail())
                    .build();
        }
    }
}
