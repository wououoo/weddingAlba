package wedding.alba.entity;

/**
 * 신청 내역을 관리하는 엔티티
 * 
 * 사용자의 모집글 신청 이력을 보관합니다. Applying 엔티티와 유사하지만,
 * 신청 상태의 도메인 이벤트를 기록하는 목적을 가집니다.
 * 신청자의 전체 신청 이력을 관리하고 통계나 분석에 활용됩니다.
 */

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "apply_histories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplyHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "apply_history_id")
    private Long applyHistoryId;           // 신청 내역 고유 식별자
    
    @Column(name = "user_id")
    private Long userId;                  // 신청자 ID
    
    @Column(name = "posting_id")
    private Long postingId;               // 신청한 모집글 ID
    
    @Column(name = "status")
    private Integer status;               // 신청 상태 (0: 대기, 1: 승인, -1: 거절)
    
    @Column(name = "apply_datetime")
    private LocalDateTime applyDatetime;   // 신청 일시
    
    @Column(name = "confirmation_datetime")
    private LocalDateTime confirmationDatetime;  // 확정 일시 (승인 혹은 거절 일시)
}
