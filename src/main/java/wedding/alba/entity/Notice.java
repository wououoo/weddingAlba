package wedding.alba.entity;

/**
 * 공지사항 정보를 관리하는 엔티티
 * 
 * 시스템 관리자가 작성한 공지사항 정보를 관리합니다.
 * 공지사항 제목, 내용, 공지 날짜, 작성자 ID, 공지 상태 등의 정보를 포함합니다.
 * 시스템의 중요 알림이나 업데이트 알림, 이벤트 알림 등을 사용자에게 전달하는 데 활용됩니다.
 */

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Long noticeId;               // 공지사항 고유 식별자
    
    @Column(name = "title")
    private String title;                // 공지사항 제목
    
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;              // 공지사항 내용
    
    @Column(name = "notice_date")
    private LocalDateTime noticeDate;    // 공지사항 등록 일시
    
    @Column(name = "user_id")
    private Long userId;                 // 공지사항 작성자 ID (관리자)
    
    @Column(name = "notice_status")
    private Integer noticeStatus;        // 공지사항 상태 (0: 비활성화, 1: 활성화)
}
