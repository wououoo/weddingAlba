package wedding.alba.function.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;

/**
 * 리뷰 생성/수정 요청 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDto {
    
    @NotNull(message = "신청 ID는 필수입니다.")
    private Long applyId;
    
    @NotNull(message = "모집글 ID는 필수입니다.")
    private Long postingId;
    
    @NotNull(message = "리뷰 대상 사용자 ID는 필수입니다.")
    private Long userId;
    
    @NotBlank(message = "리뷰 내용은 필수입니다.")
    @Size(min = 10, max = 1000, message = "리뷰 내용은 10자 이상 1000자 이하로 작성해주세요.")
    private String content;
    
    @NotNull(message = "점수는 필수입니다.")
    @Min(value = 1, message = "점수는 1점 이상이어야 합니다.")
    @Max(value = 5, message = "점수는 5점 이하여야 합니다.")
    private Integer score;
}
