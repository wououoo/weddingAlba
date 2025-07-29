package wedding.alba.function.common.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import wedding.alba.enums.PayType;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommonPostResponseDTO {
    // === 공통 필드들 ===
    private Long postingId;
    private Long userId;
    private String nickname;
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
    
    private String payAmount;
    private Integer targetPersonnel;
    private String guestMainRole;
    private String detailContent;
    private List<String> tags;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime registrationDatetime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updateDatetime;
    
    // 공통 계산 필드
    private PayType payType;
    private String payTypeText;
    
    // === 구분 필드 ===
    private String dataType; // "ACTIVE" 또는 "HISTORY"

    // === PostHistoryDTO 전용 필드들 (히스토리) ===
    private Long postHistoryId; // nullable, HISTORY일 때만 사용

    // === MyPosting 관련 필드들 ===
    private int applyCount;
    private int confirmationCount;
    private int status; // 모집중(0), 모집 취소(-1), 모집 확정(1) 상태확인용
    
    // === 편의 메서드들 ===
    public boolean isActive() {
        return "ACTIVE".equals(dataType);
    }
    
    public boolean isHistory() {
        return "HISTORY".equals(dataType);
    }
    
}
