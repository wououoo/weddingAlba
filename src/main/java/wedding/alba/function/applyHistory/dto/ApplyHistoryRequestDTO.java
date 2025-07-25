package wedding.alba.function.applyHistory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplyHistoryRequestDTO {
    private Long userId;
    private String prContent;
    private Integer status;

}
