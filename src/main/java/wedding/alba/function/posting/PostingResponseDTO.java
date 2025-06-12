package wedding.alba.function.posting;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostingResponseDTO {
    private Long postingId;
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
