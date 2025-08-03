package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.Report;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    // 신고한 사용자 ID별 조회
    List<Report> findBySenderId(Long senderId);
    
    // 신고받은 사용자 ID별 조회
    List<Report> findByReceiverId(Long receiverId);
    
    // 신고 일시 범위로 조회
    List<Report> findByReportDatetimeBetween(LocalDateTime start, LocalDateTime end);
    
    // Flag 값별 신고 조회 (허위신고 여부)
    List<Report> findByFlag(Integer flag);
    
    // 제목에 특정 키워드가 포함된 신고 조회
    List<Report> findByTitleContaining(String keyword);
    
    // 내용에 특정 키워드가 포함된 신고 조회
    List<Report> findByReasonContaining(String keyword);

}
