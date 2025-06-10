package wedding.alba.function.posting;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostingRequestDTO {
    private Long userId;    // userId
    private String title;
    private Integer isSelf;
    private String personName;
    private String personPhoneNumber;

    private String appointmentDatetime;
    private String location;
    private String workingHours;

}
