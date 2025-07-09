package wedding.alba.function.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * 리뷰 목록 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewListResponseDto {
    private List<ReviewResponseDto> data; // 리뷰 목록
    private Long totalCount;
    private Boolean hasMore;
    private Integer currentPage;
    private Boolean success;
    private String message;
}
