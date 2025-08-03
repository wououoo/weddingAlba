package wedding.alba.entity;

/**
 * 모집글에 대한 신청 정보를 관리하는 엔티티
 * 
 * 사용자가 특정 모집글에 하객으로 신청한 정보를 저장합니다.
 * 신청 상태(0: 대기, 1: 승인, -1: 거절), 신청 일시, PR(자기소개) 내용,
 * 확정 일시 등의 정보를 포함합니다.
 * 모집자와 신청자 간의 신청 관리와 확정 과정을 지원합니다.
 */

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "applying")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Applying {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "apply_id")
    private Long applyId;                // 신청 고유 식별자
    
    @Column(name = "user_id")
    private Long userId;                 // 신청자 ID
    
    @Column(name = "posting_id")
    private Long postingId;              // 신청한 모집글 ID
    
    @Column(name = "status")
    private Integer status;              // 신청 상태 (0: 대기, 1: 승인, -1: 거절)
    
    @CreationTimestamp
    @Column(name = "apply_datetime", updatable = false)
    private LocalDateTime applyDatetime;  // 신청 일시
    
    @Column(name = "pr_content", columnDefinition = "TEXT")
    private String prContent;             // 자기 PR 내용 (신청 이유, 자기소개 등)
    
    @Column(name = "confirmation_datetime")
    private LocalDateTime confirmationDatetime;  // 확정 일시 (승인 혹은 거절 일시)
}
