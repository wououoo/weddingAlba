package wedding.alba.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.HostReview;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HostReviewRepository extends JpaRepository<HostReview, Long> {
    
    // 특정 사용자가 받은 호스트 리뷰 조회 (페이징 지원)
    Page<HostReview> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    // 특정 사용자가 받은 호스트 리뷰 개수
    long countByUserId(Long userId);
    
    // 신청 ID별 호스트 리뷰 조회
    List<HostReview> findByApplyId(Long applyId);
    
    // 모집글 ID별 호스트 리뷰 조회
    List<HostReview> findByPostingId(Long postingId);
    
    // 점수별 호스트 리뷰 조회
    List<HostReview> findByScore(Integer score);
    
    // 특정 키워드가 포함된 호스트 리뷰 검색
    List<HostReview> findByContentContaining(String keyword);
    
    // 사용자별 평균 점수 조회
    @Query("SELECT AVG(hr.score) FROM HostReview hr WHERE hr.userId = :userId")
    Double findAverageScoreByUserId(@Param("userId") Long userId);
    
    // 신청 ID로 호스트 리뷰 존재 여부 확인
    boolean existsByApplyId(Long applyId);
    
    // 특정 기간 내 호스트 리뷰 조회
    @Query("SELECT hr FROM HostReview hr WHERE hr.createdAt BETWEEN :startDate AND :endDate")
    List<HostReview> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
