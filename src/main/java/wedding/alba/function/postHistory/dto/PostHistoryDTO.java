package wedding.alba.function.postHistory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostHistoryDTO {
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
    private String detailContent;
    private Integer status;
    private List<String> tags;
}
