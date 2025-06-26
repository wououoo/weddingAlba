package wedding.alba.function.applying;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplyingStatusDTO {
    private Long applyingId;
    private boolean hasApplied;  //true : 신청함, false: 신청안함
}
