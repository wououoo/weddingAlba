package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.Notice;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    
    // 제목에 특정 키워드가 포함된 공지사항 조회
    List<Notice> findByTitleContaining(String keyword);
    
    // 내용에 특정 키워드가 포함된 공지사항 조회
    List<Notice> findByContentContaining(String keyword);
    
    // 작성자 ID별 공지사항 조회
    List<Notice> findByUserId(Long userId);
    
    // 공지 날짜 범위로 조회
    List<Notice> findByNoticeDateBetween(LocalDateTime start, LocalDateTime end);
    
    // 공지 상태별 조회
    List<Notice> findByNoticeStatus(Integer noticeStatus);

}
