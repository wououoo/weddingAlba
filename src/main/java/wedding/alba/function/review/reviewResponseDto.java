package wedding.alba.function.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
<<<<<<< HEAD
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
=======

/**
 * 리뷰 응답 DTO
 * 게스트 리뷰와 호스트 리뷰 공통으로 사용
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDto {

    // 게스트 리뷰 필드
    private Long guestReviewId;
    
    // 호스트 리뷰 필드  
    private Long hostReviewId;
    
    // 공통 필드
    private Long applyId;
    private Long postingId;
    private Long userId;
    private String content;
    private Integer score;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 게스트 정보 (게스트 리뷰에서 사용)
    private GuestInfo guestInfo;
    
    // 호스트 정보 (호스트 리뷰에서 사용)
    private HostInfo hostInfo;
    
    // 모집글 정보
    private PostingInfo postingInfo;
    
>>>>>>> ac7ebf3176fa2638bce854fe964e7227718683aa
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GuestInfo {
        private String nickname;
        private String profileImageUrl;
<<<<<<< HEAD
        private Integer guestPower;
    }

    /**
     * 호스트 정보 DTO
     */
=======
        private Integer guestPower; // 게스트 평점/레벨
    }
    
>>>>>>> ac7ebf3176fa2638bce854fe964e7227718683aa
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HostInfo {
        private String nickname;
        private String profileImageUrl;
<<<<<<< HEAD
        private Integer hostPower;
    }

    /**
     * 포스팅 정보 DTO
     */
=======
        private Integer hostPower; // 호스트 평점/레벨
    }
    
>>>>>>> ac7ebf3176fa2638bce854fe964e7227718683aa
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostingInfo {
        private String title;
        private LocalDateTime appointmentDatetime;
        private String location;
    }
<<<<<<< HEAD

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
=======
>>>>>>> ac7ebf3176fa2638bce854fe964e7227718683aa
}
