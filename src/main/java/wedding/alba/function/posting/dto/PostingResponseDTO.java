package wedding.alba.function.posting.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import wedding.alba.entity.Posting;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostingResponseDTO {
    private Long postingId;
    private String title;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime appointmentDatetime;
    
    private Integer isSelf;
    private String personName;
    private String personPhoneNumber;

    private String address;
    private String buildingName;
    private String sidoSigungu;
    private Integer hasMobileInvitation;
    private String workingHours;
    
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime startTime;
    
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime endTime;
    
    private Posting.PayType payType;
    private String payTypeStr;
    private String payAmount;

    private String guestMainRole;
    private Integer targetPersonnel;  // 모집인원 (목표)
    private String detailContent;
    private List<String> tags;

    // 사욷자 및 프로필 정보
    private String nickname;
    private Long userId;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime registrationDatetime;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updateDatetime;


    public void setPayTypeStr() {
        if(this.payType == null) {
            this.payTypeStr = "";
        }
        if(this.payType.equals(Posting.PayType.HOURLY)) {
            this.payTypeStr = "시급";
        } else {
            this.payTypeStr = "일급";
        }
    }

}

