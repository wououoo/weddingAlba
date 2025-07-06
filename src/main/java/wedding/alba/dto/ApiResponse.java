package wedding.alba.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * API 응답을 위한 공통 DTO
 * @param <T> 응답 데이터의 타입
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    /**
     * 성공 응답 생성 (데이터 포함)
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "요청이 성공적으로 처리되었습니다.", data);
    }

    /**
     * 성공 응답 생성 (데이터와 메시지 포함)
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data);
    }

    /**
     * 실패 응답 생성
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
    
    /**
     * 실패 응답 생성 (데이터 포함)
     */
    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, data);
    }
}
