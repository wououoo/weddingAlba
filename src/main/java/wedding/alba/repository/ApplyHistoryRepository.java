package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.ApplyHistory;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ApplyHistoryRepository extends JpaRepository<ApplyHistory, Long> {
    
    // 사용자 ID별 신청 내역 조회
    List<ApplyHistory> findByUserId(Long userId);
    
    // 모집글 ID별 신청 내역 조회
    List<ApplyHistory> findByPostingId(Long postingId);
    
    // 상태별 신청 내역 조회
    List<ApplyHistory> findByStatus(Integer status);
    
    // 신청 일시 범위로 내역 조회
    List<ApplyHistory> findByApplyDatetimeBetween(LocalDateTime start, LocalDateTime end);
    
    // 사용자별 상태별 신청 내역 조회
    List<ApplyHistory> findByUserIdAndStatus(Long userId, Integer status);

}
