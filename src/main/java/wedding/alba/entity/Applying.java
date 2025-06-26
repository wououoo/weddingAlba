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
import wedding.alba.function.applying.ApplyingRequestDTO;

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
    @Column(name = "applying_id")
    private Long applyingId;                // 신청 고유 식별자
    
    @Column(name = "user_id")
    private Long userId;                 // 신청자 ID

    @Column(name = "posting_id", nullable = false)
    private Long postingId;

    @Column(name = "status")
    private Integer status;              // 신청 상태 (0: 대기, 1: 승인, -1: 거절)
    
    @CreationTimestamp
    @Column(name = "apply_datetime", updatable = false)
    private LocalDateTime applyDatetime;  // 신청 일시
    
    @Column(name = "pr_content", columnDefinition = "TEXT")
    private String prContent;             // 자기 PR 내용 (신청 이유, 자기소개 등)
    
    @Column(name = "confirmation_datetime")
    private LocalDateTime confirmationDatetime;  // 확정 일시 (승인 혹은 거절 일시)

    // 게시글과의 연관관계 (조회 전용, 삭제 연쇄 없음)
    // optional = true: 게시글이 삭제되어도 신청글도 삭제..
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "posting_id", insertable = false, updatable = false)
    private Posting posting;

    public void toUpdateApplying(ApplyingRequestDTO applyingRequestDTO) {
        this.setStatus(applyingRequestDTO.getStatus());
        this.setPrContent(applyingRequestDTO.getPrContent());
    }
}
