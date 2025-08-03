package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.ApplyCancelHistory;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ApplyCancelHistoryRepository extends JpaRepository<ApplyCancelHistory, Long> {
    
    // 사용자 ID별 취소 내역 조회
    List<ApplyCancelHistory> findByUserId(Long userId);
    
    // 모집글 ID별 취소 내역 조회
    List<ApplyCancelHistory> findByPostingId(Long postingId);
    
    // 취소 상태별 내역 조회
    List<ApplyCancelHistory> findByCancelStatus(String cancelStatus);
    
    // 취소 일시 범위로 내역 조회
    List<ApplyCancelHistory> findByCancelDatetimeBetween(LocalDateTime start, LocalDateTime end);
    
    // 특정 사용자의 특정 취소 상태별 내역 조회
    List<ApplyCancelHistory> findByUserIdAndCancelStatus(Long userId, String cancelStatus);

}
