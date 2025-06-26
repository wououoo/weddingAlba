package wedding.alba.function.applying;

import jakarta.validation.constraints.NotBlank;
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
    private Long applyingId;
    private Long postingId;
    private Integer status;

    @NotBlank(message = "자기소개를 입력해 주세요.")
    private String prContent;
}
