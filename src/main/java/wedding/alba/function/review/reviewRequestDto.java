package wedding.alba.function.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
