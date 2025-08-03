package wedding.alba.function.posting;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import wedding.alba.entity.Posting;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostingResponseDTO {
    private Long postingId;
    private String title;
    private LocalDateTime appointmentDatetime;
    private Integer isSelf;
    private String personName;
    private String personPhoneNumber;

    private String address;
    private String buildingName;
    private String sidoSigungu;
    private Integer hasMobileInvitation;
    private String workingHours;
    private Posting.PayType payType;
    private String payTypeStr;
    private String payAmount;

    private String guestMainRole;
    private String detailContent;
    private List<String> tags;

    // 사욛자 및 프로필 정보
    private String nickname;
    private Integer postingHistoryCount;        // 누적 모집 횟수
    private Long userId;
    private LocalDateTime registrationDatetime;

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

