package wedding.alba.function.applying;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import wedding.alba.entity.Posting;
import wedding.alba.function.posting.PostingResponseDTO;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApplyingResponseDTO {
    private Long applyId;
    private Long postingId;
    private PostingResponseDTO posting;
    private Long userId;
    private String prContent;
    private Integer status;
    private String statusStr;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime applyDatetime;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime confirmationDatetime;

    public void setStatusStr() {
        if(this.status == 0) {
            this.statusStr = "대기";
        } else if(this.status == 1) {
            this.statusStr = "승인";
        } else if(this.status == -1) {
            this.statusStr = "거절";
        }
    }

}
