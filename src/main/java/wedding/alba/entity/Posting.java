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

import java.time.LocalDateTime;

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
    
    @Column(name = "title")
    private String title;              // 모집글 제목
    
    @Column(name = "appointment_datetime")
    private LocalDateTime appointmentDatetime;  // 결혼식 예정 일시
    
    @CreationTimestamp
    @Column(name = "registration_datetime", updatable = false)
    private LocalDateTime registrationDatetime;  // 모집글 등록 일시
    
    @Column(name = "location")
    private String location;            // 결혼식 장소
    
    @Column(name = "is_self")
    private Integer isSelf;             // 본인 결혼식 여부 (0: 아님, 1: 본인 결혼식)
    
    @Column(name = "person_name")
    private String personName;          // 결혼식 당사자 이름
    
    @Column(name = "person_phone_number")
    private String personPhoneNumber;   // 결혼식 당사자 연락처
    
    @Column(name = "has_mobile_invitation")
    private Integer hasMobileInvitation; // 모바일 청첩장 여부 (0: 없음, 1: 있음)

    @Column(name="wages")
    private String wages;               // 급여
}
