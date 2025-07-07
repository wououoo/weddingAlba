package wedding.alba.function.posting;

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
    private List<Long> applyingIdList;
    private int applyCount;
    private int confirmationCount;
}
