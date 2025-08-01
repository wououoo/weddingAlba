package wedding.alba.function.applyHistory.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    private String statusText;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime applyDatetime;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime confirmationDatetime;
}
