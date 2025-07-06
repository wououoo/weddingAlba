package wedding.alba.function.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class reviewResponseDto {

    /**
     * 게스트 리뷰 응답 DTO
     * 모집자가 게스트에게 작성한 리뷰 정보
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GuestReviewResponse {
        private Long guestReviewId;
        private Long applyId;
        private Long postingId;
        private Long userId;
        private String content;
        private Integer score;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        // 게스트 정보 (실제로는 조인을 통해 가져와야 함)
        private GuestInfo guestInfo;
        
        // 포스팅 정보 (실제로는 조인을 통해 가져와야 함)
        private PostingInfo postingInfo;
    }

    /**
     * 호스트 리뷰 응답 DTO
     * 게스트가 호스트에게 작성한 리뷰 정보
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HostReviewResponse {
        private Long hostReviewId;
        private Long applyId;
        private Long postingId;
        private Long userId;
        private String content;
        private Integer score;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        // 호스트 정보 (실제로는 조인을 통해 가져와야 함)
        private HostInfo hostInfo;
        
        // 포스팅 정보 (실제로는 조인을 통해 가져와야 함)
        private PostingInfo postingInfo;
    }

    /**
     * 게스트 정보 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GuestInfo {
        private String nickname;
        private String profileImageUrl;
        private Integer guestPower;
    }

    /**
     * 호스트 정보 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HostInfo {
        private String nickname;
        private String profileImageUrl;
        private Integer hostPower;
    }

    /**
     * 포스팅 정보 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostingInfo {
        private String title;
        private LocalDateTime appointmentDatetime;
        private String location;
    }

    /**
     * 리뷰 목록 응답 DTO (페이징 정보 포함)
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewListResponse<T> {
        private List<T> data;
        private Long totalCount;
        private Boolean hasMore;
        private Integer currentPage;
    }

    /**
     * 리뷰 카운트 응답 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewCountResponse {
        private Long count;
    }
}
