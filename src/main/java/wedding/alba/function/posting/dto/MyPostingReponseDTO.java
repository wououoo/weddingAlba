package wedding.alba.function.posting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MyPostingReponseDTO {
    private PostingResponseDTO posting;
    private int applyCount;
    private int confirmationCount;
    private int status;     // 모집중, 모집 취소, 모집 확정 상태확인용
}
