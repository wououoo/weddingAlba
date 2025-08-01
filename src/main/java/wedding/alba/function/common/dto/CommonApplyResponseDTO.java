package wedding.alba.function.common.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommonApplyResponseDTO {
    // == 공통 필드 ==
    private Long userId;
    private String nickname;
    private String prContent;
    private Integer status;
    private String statusText;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime applyDatetime;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime confirmationDatetime;

    // == Applying ==
    private Long applyingId;
    private Long postingId;

    // == ApplyHistory ==
    private Long applyHistoryId;
    private Long postHistoryId;
}
