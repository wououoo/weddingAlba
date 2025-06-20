package wedding.alba.function.review;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import wedding.alba.dto.ApiResponse;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

/**
 * 리뷰 관련 REST API 컨트롤러
 * 게스트 리뷰와 호스트 리뷰 조회/생성 기능 제공
 */
@RestController
@RequiredArgsConstructor
@Slf4j
@Validated
@RequestMapping("/api/review")
public class ReviewController {
    
    private final ReviewService reviewService;
    
    /**
     * 현재 인증된 사용자 ID 추출
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("인증되지 않은 사용자입니다.");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Long) {
            return (Long) principal;
        }

        throw new IllegalStateException("유효하지 않은 인증 정보입니다.");
    }
    
    /**
     * 게스트 리뷰 목록 조회
     * GET /api/guest-reviews?page=1&limit=10
     */
    @GetMapping("/guest-reviews")
    public ResponseEntity<ApiResponse<ReviewListResponseDto>> getGuestReviews(
            @RequestParam(defaultValue = "1") @Min(1) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int limit) {
        
        Long userId = getCurrentUserId();
        log.info("게스트 리뷰 목록 조회 요청 - userId: {}, page: {}, limit: {}", userId, page, limit);
        
        try {
            ReviewListResponseDto response = reviewService.getGuestReviews(userId, page, limit);
            return ResponseEntity.ok(ApiResponse.success(response, "게스트 리뷰 목록을 성공적으로 조회했습니다."));
        } catch (Exception e) {
            log.error("게스트 리뷰 목록 조회 실패 - userId: {}, error: {}", userId, e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("게스트 리뷰 목록 조회에 실패했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 호스트 리뷰 목록 조회
     * GET /api/host-reviews?page=1&limit=10
     */
    @GetMapping("/host-reviews")
    public ResponseEntity<ApiResponse<ReviewListResponseDto>> getHostReviews(
            @RequestParam(defaultValue = "1") @Min(1) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int limit) {
        
        Long userId = getCurrentUserId();
        log.info("호스트 리뷰 목록 조회 요청 - userId: {}, page: {}, limit: {}", userId, page, limit);
        
        try {
            ReviewListResponseDto response = reviewService.getHostReviews(userId, page, limit);
            return ResponseEntity.ok(ApiResponse.success(response, "호스트 리뷰 목록을 성공적으로 조회했습니다."));
        } catch (Exception e) {
            log.error("호스트 리뷰 목록 조회 실패 - userId: {}, error: {}", userId, e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("호스트 리뷰 목록 조회에 실패했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 게스트 리뷰 카운트 조회
     * GET /api/guest-reviews/count
     */
    @GetMapping("/guest-reviews/count")
    public ResponseEntity<ApiResponse<ReviewCountResponseDto>> getGuestReviewCount() {
        Long userId = getCurrentUserId();
        log.info("게스트 리뷰 카운트 조회 요청 - userId: {}", userId);
        
        try {
            ReviewCountResponseDto response = reviewService.getGuestReviewCount(userId);
            return ResponseEntity.ok(ApiResponse.success(response, "게스트 리뷰 카운트를 성공적으로 조회했습니다."));
        } catch (Exception e) {
            log.error("게스트 리뷰 카운트 조회 실패 - userId: {}, error: {}", userId, e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("게스트 리뷰 카운트 조회에 실패했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 호스트 리뷰 카운트 조회
     * GET /api/host-reviews/count
     */
    @GetMapping("/host-reviews/count")
    public ResponseEntity<ApiResponse<ReviewCountResponseDto>> getHostReviewCount() {
        Long userId = getCurrentUserId();
        log.info("호스트 리뷰 카운트 조회 요청 - userId: {}", userId);
        
        try {
            ReviewCountResponseDto response = reviewService.getHostReviewCount(userId);
            return ResponseEntity.ok(ApiResponse.success(response, "호스트 리뷰 카운트를 성공적으로 조회했습니다."));
        } catch (Exception e) {
            log.error("호스트 리뷰 카운트 조회 실패 - userId: {}, error: {}", userId, e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("호스트 리뷰 카운트 조회에 실패했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 게스트 리뷰 생성
     * POST /api/guest-reviews
     */
    @PostMapping("/guest-reviews")
    public ResponseEntity<ApiResponse<ReviewResponseDto>> createGuestReview(@Valid @RequestBody ReviewRequestDto requestDto) {
        Long currentUserId = getCurrentUserId();
        log.info("게스트 리뷰 생성 요청 - userId: {}, applyId: {}", currentUserId, requestDto.getApplyId());
        
        try {
            ReviewResponseDto response = reviewService.createGuestReview(requestDto);
            return ResponseEntity.ok(ApiResponse.success(response, "게스트 리뷰가 성공적으로 생성되었습니다."));
            
        } catch (Exception e) {
            log.error("게스트 리뷰 생성 실패 - userId: {}, error: {}", currentUserId, e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("게스트 리뷰 생성에 실패했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 호스트 리뷰 생성
     * POST /api/host-reviews
     */
    @PostMapping("/host-reviews")
    public ResponseEntity<ApiResponse<ReviewResponseDto>> createHostReview(@Valid @RequestBody ReviewRequestDto requestDto) {
        Long currentUserId = getCurrentUserId();
        log.info("호스트 리뷰 생성 요청 - userId: {}, applyId: {}", currentUserId, requestDto.getApplyId());
        
        try {
            ReviewResponseDto response = reviewService.createHostReview(requestDto);
            return ResponseEntity.ok(ApiResponse.success(response, "호스트 리뷰가 성공적으로 생성되었습니다."));
            
        } catch (Exception e) {
            log.error("호스트 리뷰 생성 실패 - userId: {}, error: {}", currentUserId, e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("호스트 리뷰 생성에 실패했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 특정 사용자의 게스트 리뷰 목록 조회 (관리자용 또는 프로필 조회)
     * GET /api/guest-reviews/{userId}?page=1&limit=10
     */
    @GetMapping("/guest-reviews/{userId}")
    public ResponseEntity<ApiResponse<ReviewListResponseDto>> getGuestReviewsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") @Min(1) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int limit) {
        
        log.info("특정 사용자 게스트 리뷰 조회 요청 - targetUserId: {}, page: {}, limit: {}", userId, page, limit);
        
        try {
            ReviewListResponseDto response = reviewService.getGuestReviews(userId, page, limit);
            return ResponseEntity.ok(ApiResponse.success(response, "게스트 리뷰 목록을 성공적으로 조회했습니다."));
        } catch (Exception e) {
            log.error("특정 사용자 게스트 리뷰 조회 실패 - targetUserId: {}, error: {}", userId, e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("게스트 리뷰 목록 조회에 실패했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 특정 사용자의 호스트 리뷰 목록 조회 (관리자용 또는 프로필 조회)
     * GET /api/host-reviews/{userId}?page=1&limit=10
     */
    @GetMapping("/host-reviews/{userId}")
    public ResponseEntity<ApiResponse<ReviewListResponseDto>> getHostReviewsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") @Min(1) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int limit) {
        
        log.info("특정 사용자 호스트 리뷰 조회 요청 - targetUserId: {}, page: {}, limit: {}", userId, page, limit);
        
        try {
            ReviewListResponseDto response = reviewService.getHostReviews(userId, page, limit);
            return ResponseEntity.ok(ApiResponse.success(response, "호스트 리뷰 목록을 성공적으로 조회했습니다."));
        } catch (Exception e) {
            log.error("특정 사용자 호스트 리뷰 조회 실패 - targetUserId: {}, error: {}", userId, e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("호스트 리뷰 목록 조회에 실패했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 리뷰 작성 가능 여부 확인
     * GET /api/reviews/check-writable?applyId=123&reviewType=guest
     */
    @GetMapping("/reviews/check-writable")
    public ResponseEntity<ApiResponse<Boolean>> checkReviewWritable(
            @RequestParam Long applyId,
            @RequestParam String reviewType) {
        
        Long currentUserId = getCurrentUserId();
        log.info("리뷰 작성 가능 여부 확인 - userId: {}, applyId: {}, reviewType: {}", currentUserId, applyId, reviewType);
        
        try {
            boolean isWritable = reviewService.checkReviewWritable(applyId, reviewType);
            String message = isWritable ? "리뷰 작성이 가능합니다." : "이미 리뷰가 작성되었습니다.";
            return ResponseEntity.ok(ApiResponse.success(isWritable, message));
            
        } catch (Exception e) {
            log.error("리뷰 작성 가능 여부 확인 실패 - userId: {}, applyId: {}, error: {}", currentUserId, applyId, e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("리뷰 작성 가능 여부 확인에 실패했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 예외 처리 핸들러
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthenticationException(IllegalStateException e) {
        log.error("인증 오류: {}", e.getMessage());
        return ResponseEntity.status(401).body(ApiResponse.error(e.getMessage()));
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException e) {
        log.error("런타임 오류: {}", e.getMessage());
        return ResponseEntity.status(500).body(ApiResponse.error(e.getMessage()));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneralException(Exception e) {
        log.error("일반 오류: {}", e.getMessage());
        return ResponseEntity.status(500).body(ApiResponse.error("서버 오류가 발생했습니다."));
    }
}
