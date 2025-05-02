package wedding.alba.entity;

/**
 * 신고 정보를 관리하는 엔티티
 * 
 * 사용자가 다른 사용자나 콘텐츠에 대해 신고한 정보를 관리합니다.
 * 신고한 사용자, 신고받은 사용자, 신고 제목, 신고 사유, 신고 일시,
 * 허위 신고 여부와 같은 정보를 포함합니다.
 * 시스템의 안전성과 신뢰성을 유지하기 위한 신고 시스템을 지원합니다.
 */

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;                // 신고 고유 식별자
    
    @Column(name = "sender_id")
    private Long senderId;                // 신고한 사람(신고자) ID
    
    @Column(name = "receiver_id")
    private Long receiverId;              // 신고받은 사람(피신고자) ID
    
    @Column(name = "title")
    private String title;                 // 신고 제목
    
    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;                // 신고 사유
    
    @Column(name = "report_datetime")
    private LocalDateTime reportDatetime;  // 신고 일시
    
    @Column(name = "flag")
    private Integer flag;                 // 허위신고 여부 (0: 정상, 1: 허위신고)
}
