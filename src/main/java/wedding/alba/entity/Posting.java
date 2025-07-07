package wedding.alba.entity;

/**
 * 결혼식 하객 모집 글을 관리하는 엔티티
 * 
 * 사용자가 작성한 모집 글의 정보(제목, 장소, 약속 일시 등)와 관련된 정보를 저장합니다.
 * 결혼식 하객 모집을 위한 중요한 정보(자기 결혼식 여부, 결혼식 당사자 정보, 청첩장 정보 등)를 포함합니다.
 * 하객 신청, 채팅, 후기 등의 기능이 이 모집글을 기반으로 연결됩니다.
 */

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import wedding.alba.function.posting.PostingRequestDTO;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "postings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Posting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "posting_id")
    private Long postingId;            // 모집글 고유 식별자
    
    @Column(name = "user_id")
    private Long userId;              // 모집글 작성자 ID

    // Profile과의 관계 추가 (자주 사용되므로 연결)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    private Profile profile;

    // 기본정보
    @Column(name = "title")
    private String title;              // 모집글 제목

    @Column(name = "is_self")
    private Integer isSelf;             // 본인 결혼식 여부 (0: 아님, 1: 본인 결혼식)

    @Column(name = "person_name")
    private String personName;          // 결혼식 당사자 이름
    
    @Column(name = "person_phone_number")
    private String personPhoneNumber;   // 결혼식 당사자 연락처
    
    // 예식 정보
    @Column(name = "appointment_datetime")
    private LocalDateTime appointmentDatetime;  // 결혼식 예정 일시

    @Column(name = "address")
    private String address;             // 결혼식 장소 주소

    @Column(name = "building_name")
    private String buildingName;        // 건물이름

    @Column(name = "sido_sigungu")
    private String sidoSigungu;         // 시도 + 시군구
    
    @Column(name = "has_mobile_invitation")
    private Integer hasMobileInvitation; // 모바일 청첩장 여부 (0: 없음, 1: 있음)

    // 알바정보
    @Column(name="start_time")
    private LocalTime startTime;           // 근무 시작 시간

    @Column(name="end_time")
    private LocalTime endTime;           // 근무 종료 시간

    @Column(name="working_hours")
    private String workingHours;        // 근무 시간

    @Enumerated(EnumType.STRING)
    private PayType payType;             // 급여 타입 (시급, 일급)

    @Column(name="pay_amount")
    private String payAmount;           // 급여 금액

    @Column(name="target_personnel")
    private Integer targetPersonnel;   // 모집인원

    @Column(name="guest_main_role")
    private String guestMainRole;       // 하객 주요 역할

    @Column(name="detail_content")
    private String detailContent;     // 상세내용

    @Column(name="tags")
    private String tags;              // 태그 (최대 5개)

    @CreationTimestamp
    @Column(name = "registration_datetime", updatable = false)
    private LocalDateTime registrationDatetime;  // 모집글 등록 일시

    @UpdateTimestamp
    @Column(name = "update_datetime")
    private LocalDateTime updateDatetime;   // 모집글 수정 일시

    public enum PayType {
        DAILY, HOURLY
    }

    public void toUpdatePosting(PostingRequestDTO postingRequestDTO){
        this.setPostingId(postingRequestDTO.getPostingId());
        this.setUserId(postingRequestDTO.getUserId());
        this.setTitle(postingRequestDTO.getTitle());
        this.setIsSelf(postingRequestDTO.getIsSelf());
        this.setPersonName(postingRequestDTO.getPersonName());
        this.setPersonPhoneNumber(postingRequestDTO.getPersonPhoneNumber());
        this.setAppointmentDatetime(postingRequestDTO.getAppointmentDatetime());
        this.setAddress(postingRequestDTO.getAddress());
        this.setBuildingName(postingRequestDTO.getBuildingName());
        this.setSidoSigungu(postingRequestDTO.getSidoSigungu());
        this.setHasMobileInvitation(postingRequestDTO.getHasMobileInvitation());
        this.setStartTime(LocalTime.parse(postingRequestDTO.getStartTime()));
        this.setEndTime(LocalTime.parse(postingRequestDTO.getEndTime()));
        this.setWorkingHours(postingRequestDTO.getWorkingHours());
        this.setPayType(PayType.valueOf(postingRequestDTO.getPayType().toUpperCase()));
        this.setPayAmount(postingRequestDTO.getPayAmount());
        this.setTargetPersonnel(postingRequestDTO.getTargetPersonnel());
        this.setGuestMainRole(postingRequestDTO.getGuestMainRole());
        this.setDetailContent(postingRequestDTO.getDetailContent());
        this.setTags(postingRequestDTO.getTags() != null ? String.join(",", postingRequestDTO.getTags()) : null);
    }
}
