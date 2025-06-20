package wedding.alba.function.posting;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostingRequestDTO {
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
    private LocalTime startTime;
    private LocalTime endTime;
    private String payType;
    private String payAmount;
    private Integer targetPersonnel;
    private String guestMainRole;
    private Integer recruitmentCount;    // 모집인원
    private String detailContent;
    private List<String> tags;
}


