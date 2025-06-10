package wedding.alba.function.posting;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostingResponseDTO {
    private Long postingId;
    private Long userId;

}
