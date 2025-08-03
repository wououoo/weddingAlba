package wedding.alba.function.review;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import wedding.alba.dto.ApiResponse;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.HashMap;
import java.util.Map;

/**
 * 리뷰 관련 예외 처리 핸들러
 */
@RestControllerAdvice(assignableTypes = ReviewController.class)
@Slf4j
public class ReviewExceptionHandler {

    /**
     * Validation 에러 처리
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        
        for (FieldError error : e.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        
        log.error("Validation 에러: {}", errors);
        return ResponseEntity.badRequest()
            .body(ApiResponse.error("입력값 검증에 실패했습니다.", errors));
    }

    /**
     * 제약조건 위반 에러 처리
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleConstraintViolationException(ConstraintViolationException e) {
        Map<String, String> errors = new HashMap<>();
        
        for (ConstraintViolation<?> violation : e.getConstraintViolations()) {
            String propertyPath = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            errors.put(propertyPath, message);
        }
        
        log.error("제약조건 위반 에러: {}", errors);
        return ResponseEntity.badRequest()
            .body(ApiResponse.error("입력값 제약조건을 위반했습니다.", errors));
    }

    /**
     * 바인딩 에러 처리
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiResponse<Object>> handleBindException(BindException e) {
        Map<String, String> errors = new HashMap<>();
        
        for (FieldError error : e.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        
        log.error("바인딩 에러: {}", errors);
        return ResponseEntity.badRequest()
            .body(ApiResponse.error("요청 데이터 바인딩에 실패했습니다.", errors));
    }

    /**
     * 리뷰 관련 비즈니스 로직 에러 처리
     */
    @ExceptionHandler(ReviewBusinessException.class)
    public ResponseEntity<ApiResponse<Object>> handleReviewBusinessException(ReviewBusinessException e) {
        log.error("리뷰 비즈니스 로직 에러: {}", e.getMessage());
        return ResponseEntity.badRequest()
            .body(ApiResponse.error(e.getMessage()));
    }

    /**
     * 일반적인 RuntimeException 처리
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException e) {
        log.error("Runtime 에러: {}", e.getMessage(), e);
        return ResponseEntity.status(500)
            .body(ApiResponse.error("서버 내부 오류가 발생했습니다."));
    }

    /**
     * 리뷰 관련 커스텀 예외
     */
    public static class ReviewBusinessException extends RuntimeException {
        public ReviewBusinessException(String message) {
            super(message);
        }
        
        public ReviewBusinessException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
