package wedding.alba.function.applying;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyingRequestDTO {
    private Long userId;
    private Long postingId;
    private Integer status;
    private String prContent;
}
