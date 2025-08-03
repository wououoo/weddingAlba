package wedding.alba.function.posting;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostingRequestDTO {
    private Long userId;
    private String title;
    private Integer isSelf;
    private String personName;
    private String personPhoneNumber;

    private LocalDateTime appointmentDatetime;
    private String address;
    private String buildingName;
    private String sidoSigungu;
    private Integer hasMobileInvitation;
    private String workingHours;
    private String payType;
    private String payAmount;
    private String guestMainRole;
    private String detailContent;
    private List<String> tags;
}


