package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.Applying;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplyingRepository extends JpaRepository<Applying, Long> {
    
    // 사용자 ID별 신청 조회
    List<Applying> findByUserId(Long userId);
    
    // 모집글 ID별 신청 조회
    List<Applying> findByPostingId(Long postingId);
    
    // 상태별 신청 조회
    List<Applying> findByStatus(Integer status);
    
    // 사용자 ID와 모집글 ID로 신청 조회
    Optional<Applying> findByUserIdAndPostingId(Long userId, Long postingId);
    
    // 특정 사용자의 승인된 신청 조회
    List<Applying> findByUserIdAndStatus(Long userId, Integer status);
    
    // 특정 모집글의 승인된 신청 조회
    List<Applying> findByPostingIdAndStatus(Long postingId, Integer status);
    
    // 신청 일시 범위로 조회
    List<Applying> findByApplyDatetimeBetween(LocalDateTime start, LocalDateTime end);

}
