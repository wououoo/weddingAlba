package wedding.alba.entity;

/**
 * 신청 취소 내역을 관리하는 엔티티
 * 
 * 사용자가 모집글 신청을 취소한 이력을 관리합니다.
 * 취소 상태(확정 전 삭제, 확정 후 삭제), 취소 일시 등의 정보를 포함합니다.
 * 신청 취소의 패턴을 분석하고 신용도 평가에 활용될 수 있습니다.
 */

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "apply_cancel_histories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplyCancelHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "apply_cancel_history_id")
    private Long applyCancelHistoryId;    // 취소 내역 고유 식별자
    
    @Column(name = "posting_id")
    private Long postingId;              // 취소한 모집글 ID
    
    @Column(name = "user_id")
    private Long userId;                // 취소한 사용자 ID
    
    @Column(name = "cancel_status")
    private String cancelStatus;         // 취소 상태 (확정 전 취소, 확정 후 취소)
    
    @Column(name = "cancel_datetime")
    private LocalDateTime cancelDatetime;  // 취소 일시
}
