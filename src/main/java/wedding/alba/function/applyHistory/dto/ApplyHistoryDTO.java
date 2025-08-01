package wedding.alba.function.applyHistory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import wedding.alba.function.profile.ProfileResponseDto;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplyHistoryDTO {
    private Long userId;
    private Long applyHistoryId;
    private ProfileResponseDto profile;
    private Long postingId;
    private Long postHistoryId;
    private String prContent;
    private Integer status;
    private LocalDateTime applyDatetime;
    private LocalDateTime confirmationDatetime;
}
