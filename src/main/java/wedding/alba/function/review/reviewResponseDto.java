package wedding.alba.function.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

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
    
    /**
     * 게스트 정보 내부 클래스
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GuestInfo {
        private String nickname;
        private String profileImageUrl;
        private Integer guestPower; // 게스트 평점/레벨
    }
    
    /**
     * 호스트 정보 내부 클래스
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HostInfo {
        private String nickname;
        private String profileImageUrl;
        private Integer hostPower; // 호스트 평점/레벨
    }
    
    /**
     * 모집글 정보 내부 클래스
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
     * 게스트 리뷰 응답 생성 메서드
     */
    public static ReviewResponseDto forGuestReview(Long guestReviewId, Long applyId, Long postingId, 
            Long userId, String content, Integer score, LocalDateTime createdAt, LocalDateTime updatedAt,
            GuestInfo guestInfo, PostingInfo postingInfo) {
        return ReviewResponseDto.builder()
                .guestReviewId(guestReviewId)
                .applyId(applyId)
                .postingId(postingId)
                .userId(userId)
                .content(content)
                .score(score)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .guestInfo(guestInfo)
                .postingInfo(postingInfo)
                .build();
    }

    /**
     * 호스트 리뷰 응답 생성 메서드
     */
    public static ReviewResponseDto forHostReview(Long hostReviewId, Long applyId, Long postingId, 
            Long userId, String content, Integer score, LocalDateTime createdAt, LocalDateTime updatedAt,
            HostInfo hostInfo, PostingInfo postingInfo) {
        return ReviewResponseDto.builder()
                .hostReviewId(hostReviewId)
                .applyId(applyId)
                .postingId(postingId)
                .userId(userId)
                .content(content)
                .score(score)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .hostInfo(hostInfo)
                .postingInfo(postingInfo)
                .build();
    }
}
