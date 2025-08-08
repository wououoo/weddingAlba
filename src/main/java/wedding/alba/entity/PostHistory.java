package wedding.alba.entity;

/**
 * 모집글의 변경 이력을 관리하는 엔티티
 * 
 * Posting 엔티티의 변경 이력을 기록하여 모집글 수정 이력을 추적합니다.
 * 각 수정 이력은 원본 모집글과 동일한 정보 구조를 가지며, 추가로 원본 모집글의 ID를 참조합니다.
 * 모집글의 변경 이력을 추적하고 과거 상태를 보관하는 데 활용됩니다.
 */

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import wedding.alba.enums.EnumType;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "post_histories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_history_id")
    private Long postHistoryId;          // 모집글 이력 고유 식별자

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

    @Enumerated(jakarta.persistence.EnumType.STRING)
    private EnumType.PayType payType;     // 급여 타입 (시급, 일급)

    @Column(name="pay_amount")
    private String payAmount;           // 급여 금액

    @Column(name="target_personnel")
    private Integer targetPersonnel;   // 모집인원

    @Column(name="guest_main_role")
    private String guestMainRole;       // 하객 주요 역할

    @Column(name="detail_content")
    private String detailContent;     // 상세내용

    @Column(name="status")
    private Integer status;            // 0 : 1 : 확정, -1 : 취소

    @Column(name="tags")
    private String tags;              // 태그 (최대 5개)

    @CreationTimestamp
    @Column(name = "registration_datetime", updatable = false)
    private LocalDateTime registrationDatetime;  // 모집이력 등록일시

    @UpdateTimestamp
    @Column(name = "update_datetime")
    private LocalDateTime updateDatetime;   // 모집이력 수정 일시

    @Column(name = "posting_id")
    private Long postingId; // 원본 모집글 ID (변경 이력을 추적하기 위한 참조)
}
