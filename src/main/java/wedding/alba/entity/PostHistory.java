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

import java.time.LocalDateTime;

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
    private Long userId;                // 모집글 작성자 ID
    
    @Column(name = "title")
    private String title;                // 모집글 제목
    
    @Column(name = "appointment_datetime")
    private LocalDateTime appointmentDatetime;    // 결혼식 예정 일시
    
    @CreationTimestamp
    @Column(name = "registration_datetime", updatable = false)
    private LocalDateTime registrationDatetime;    // 이력 등록 일시
    
    @Column(name = "location")
    private String location;              // 결혼식 장소
    
    @Column(name = "is_self")
    private Integer isSelf;               // 본인 결혼식 여부 (0: 아님, 1: 본인 결혼식)
    
    @Column(name = "person_name")
    private String personName;            // 결혼식 당사자 이름
    
    @Column(name = "person_phone_number")
    private String personPhoneNumber;     // 결혼식 당사자 연락처
    
    @Column(name = "has_mobile_invitation")
    private Integer hasMobileInvitation;   // 모바일 청첩장 여부 (0: 없음, 1: 있음)
    
    @Column(name = "posting_id")
    private Long postingId;               // 원본 모집글 ID (변경 이력을 추적하기 위한 참조)
}
