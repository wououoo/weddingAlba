package wedding.alba.entity;

/**
 * 찜(북마크) 정보를 관리하는 엔티티
 * 
 * 사용자가 관심 있는 모집글을 찜한 정보를 관리합니다.
 * 사용자 ID, 모집글 ID, 찜한 날짜, 메모 등의 정보를 포함합니다.
 * 사용자가 관심 있는 모집글을 관리하고 후에 쉽게 접근할 수 있도록 합니다.
 */

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookmarks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bookmark_id")
    private Long bookmarkId;              // 북마크 고유 식별자
    
    @Column(name = "posting_id")
    private Long postingId;               // 찜한 모집글 ID
    
    @Column(name = "marc_date")
    private LocalDateTime marcDate;       // 찜한 일시
    
    @Column(name = "user_id")
    private Long userId;                  // 찜한 사용자 ID
    
    @Column(name = "memo", columnDefinition = "TEXT")
    private String memo;                  // 찜 메모 (사용자가 첨부하는 메모)
}
