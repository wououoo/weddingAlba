package wedding.alba.function.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

<<<<<<< HEAD
public class reviewRequestDto {

    /**
     * 리뷰 목록 조회 요청 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewListRequest {
        @Builder.Default
        private Integer page = 1;      // 페이지 번호 (기본값: 1)
        @Builder.Default
        private Integer limit = 10;    // 페이지당 항목 수 (기본값: 10)
    }

    /**
     * 리뷰 생성 요청 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewCreateRequest {
        private Long applyId;          // 신청 ID
        private Long postingId;        // 포스팅 ID
        private Long userId;           // 대상 사용자 ID
        private String content;        // 리뷰 내용
        private Integer score;         // 평점 (1-5)
    }

    /**
     * 리뷰 수정 요청 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewUpdateRequest {
        private String content;        // 리뷰 내용
        private Integer score;         // 평점 (1-5)
    }
=======
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
>>>>>>> ac7ebf3176fa2638bce854fe964e7227718683aa
}
