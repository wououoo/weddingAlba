package wedding.alba.function.postHistory.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import wedding.alba.enums.EnumType;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostHistoryDTO {
    private Long postHistoryId;
    private Long postingId;
    private Long userId;
    private String nickname;
    private String title;
    private Integer isSelf;
    private String personName;
    private String personPhoneNumber;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime appointmentDatetime;
    
    private String address;
    private String buildingName;
    private String sidoSigungu;
    private Integer hasMobileInvitation;
    private String workingHours;
    
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime startTime;
    
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime endTime;
    
    private EnumType.PayType payType;
    private String payTypeText;
    private String payAmount;
    private Integer targetPersonnel;
    private String guestMainRole;
    private String detailContent;
    private Integer status;
    private List<String> tags;
    private LocalDateTime registrationDatetime;
    private LocalDateTime updateDatetime;
}
