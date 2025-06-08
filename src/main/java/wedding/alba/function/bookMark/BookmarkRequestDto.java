package wedding.alba.function.bookMark;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookmarkRequestDto {

    /**
     * 북마크할 게시글 ID
     * 필수 값입니다.
     */
    @NotNull(message = "게시글 ID는 필수입니다.")
    private Long postingId;

    /**
     * 북마크 메모
     * 사용자가 북마크에 추가할 수 있는 개인 메모입니다.
     * 최대 500자까지 가능합니다.
     */
    @Size(max = 500, message = "메모는 500자를 초과할 수 없습니다.")
    private String memo;
}