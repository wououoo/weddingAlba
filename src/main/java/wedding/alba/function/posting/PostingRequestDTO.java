package wedding.alba.function.posting;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostingRequestDTO {
    private Long postingId;
    private Long userId;

    @NotBlank(message = "제목을 입력해 주세요.")
    private String title;

    private Integer isSelf;
    @NotBlank(message = "당사자 이름을 연락해 주세요.")
    private String personName;

    @NotBlank(message = "당사자 전화번호를 입력해 주세요.")
    @Pattern(regexp = "\\d{3}-\\d{3,4}-\\d{4}$", message = "전화번호 형식은 010-1234-1234 이어야 합니다.")
    private String personPhoneNumber;

    @NotNull(message = "예식일시를 선택해 주세요.")
    private LocalDateTime appointmentDatetime;

    @NotBlank(message="예식장 주소를 입력해 주세요.")
    private String address;
    private String buildingName;
    private String sidoSigungu;
    private Integer hasMobileInvitation;

    @NotNull(message = "근무 시작 시간을 선택해 주세요.")
    private String startTime;
    @NotNull(message = "근무 종료 시간을 선택해 주세요.")
    private String endTime;
    private String workingHours;

    private String payType;
    private String payAmount;

    @NotBlank(message = "하객 역할/업무를 입력 해 주세요.")
    private String guestMainRole;
    @Min(value = 0, message = "인원은 0명 이상이어야 합니다.")
    private Integer targetPersonnel;

    @NotBlank(message = "상세 내용을 입력 해 주세요.")
    private String detailContent;
    private List<String> tags;
}


