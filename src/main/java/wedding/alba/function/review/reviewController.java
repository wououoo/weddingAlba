package wedding.alba.function.review;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wedding.alba.config.JwtConfig;
import wedding.alba.dto.ApiResponse;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
@Slf4j
public class reviewController {

    private final reviewService reviewService;
    
    @Autowired
    private JwtConfig jwtConfig;

    /**
     * 게스트 리뷰 목록 조회
     * GET /api/review/guest-reviews?page=1&limit=10
     */
    @GetMapping("/guest-reviews")
    public ResponseEntity<ApiResponse<reviewResponseDto.ReviewListResponse<reviewResponseDto.GuestReviewResponse>>> getGuestReviews(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit) {
        
        try {
            Long userId = extractUserIdFromToken(request);
            
            reviewResponseDto.ReviewListResponse<reviewResponseDto.GuestReviewResponse> response = 
                    reviewService.getGuestReviews(userId, page, limit);
            
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            log.error("게스트 리뷰 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("게스트 리뷰 목록 조회 중 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("리뷰 목록을 불러오는데 실패했습니다."));
        }
    }

    /**
     * 호스트 리뷰 목록 조회
     * GET /api/review/host-reviews?page=1&limit=10
     */
    @GetMapping("/host-reviews")
    public ResponseEntity<ApiResponse<reviewResponseDto.ReviewListResponse<reviewResponseDto.HostReviewResponse>>> getHostReviews(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit) {
        
        try {
            Long userId = extractUserIdFromToken(request);
            
            reviewResponseDto.ReviewListResponse<reviewResponseDto.HostReviewResponse> response = 
                    reviewService.getHostReviews(userId, page, limit);
            
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            log.error("호스트 리뷰 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("호스트 리뷰 목록 조회 중 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("리뷰 목록을 불러오는데 실패했습니다."));
        }
    }

    /**
     * 게스트 리뷰 개수 조회
     * GET /api/review/guest-reviews/count
     */
    @GetMapping("/guest-reviews/count")
    public ResponseEntity<ApiResponse<reviewResponseDto.ReviewCountResponse>> getGuestReviewCount(
            HttpServletRequest request) {
        
        try {
            Long userId = extractUserIdFromToken(request);
            
            reviewResponseDto.ReviewCountResponse response = reviewService.getGuestReviewCount(userId);
            
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            log.error("게스트 리뷰 개수 조회 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("게스트 리뷰 개수 조회 중 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("리뷰 개수를 불러오는데 실패했습니다."));
        }
    }

    /**
     * 호스트 리뷰 개수 조회
     * GET /api/review/host-reviews/count
     */
    @GetMapping("/host-reviews/count")
    public ResponseEntity<ApiResponse<reviewResponseDto.ReviewCountResponse>> getHostReviewCount(
            HttpServletRequest request) {
        
        try {
            Long userId = extractUserIdFromToken(request);
            
            reviewResponseDto.ReviewCountResponse response = reviewService.getHostReviewCount(userId);
            
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            log.error("호스트 리뷰 개수 조회 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("호스트 리뷰 개수 조회 중 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("리뷰 개수를 불러오는데 실패했습니다."));
        }
    }
    
    /**
     * 토큰으로부터 사용자 ID값 추출
     */
    private Long extractUserIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("인증 토큰이 없습니다.");
        }

        String token = authHeader.substring(7);
        log.debug("JWT 토큰: {}", token);

        try {
            // JWT 토큰에서 사용자 ID 추출
            String userIdStr = jwtConfig.extractUserId(token);
            Long userId = Long.parseLong(userIdStr);
            log.debug("추출된 사용자 ID: {}", userId);
            return userId;
        } catch (Exception e) {
            log.error("JWT 토큰 파싱 오류: {}", e.getMessage());
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
    }
}
