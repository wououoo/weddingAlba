package wedding.alba.entity;

/**
 * 신청자(게스트) 리뷰를 관리하는 엔티티
 * 
 * 모집자가 하객으로 참여한 신청자(게스트)에 대해 작성한 리뷰 정보를 관리합니다.
 * 모집자가 작성한 리뷰 내용, 점수, 작성 일시 등의 정보를 포함합니다.
 * 게스트에 대한 평판을 관리하고 신용도 시스템에 활용됩니다.
 */

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "guest_reviews")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guest_review_id")
    private Long guestReviewId;           // 게스트 리뷰 고유 식별자
    
    @Column(name = "apply_id")
    private Long applyId;                // 신청 ID (어떤 신청에 대한 리뷰인지)
    
    @Column(name = "posting_id")
    private Long postingId;              // 모집글 ID (어떤 모집에 대한 리뷰인지)
    
    @Column(name = "user_id")
    private Long userId;                 // 게스트(신청자) 사용자 ID (리뷰 대상)
    
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;               // 리뷰 내용
    
    @Column(name = "score")
    private Integer score;                // 평가 점수 (1~5점)
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;      // 리뷰 작성 일시
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;      // 리뷰 수정 일시
}
