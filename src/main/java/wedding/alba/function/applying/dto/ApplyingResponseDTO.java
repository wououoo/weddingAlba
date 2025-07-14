package wedding.alba.function.applying.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import wedding.alba.function.posting.dto.PostingResponseDTO;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApplyingResponseDTO {
    private Long applyingId;
    private Long postingId;
    private PostingResponseDTO posting;
    private Long userId;
    private String nickname;
    private String prContent;
    private Integer status;
    private String statusText;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime applyDatetime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime confirmationDatetime;

    public void setStatusStr() {
        if(this.status == 0) {
            this.statusText = "대기";
        } else if(this.status == 1) {
            this.statusText = "승인";
        } else if(this.status == -1) {
            this.statusText = "거절";
        } else {
            this.statusText = "알수없음";
        }
    }

}
