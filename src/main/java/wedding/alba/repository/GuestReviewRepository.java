package wedding.alba.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.GuestReview;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GuestReviewRepository extends JpaRepository<GuestReview, Long> {
    
    // 특정 사용자가 받은 게스트 리뷰 조회 (페이징 지원)
    Page<GuestReview> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    // 특정 사용자가 받은 게스트 리뷰 개수
    long countByUserId(Long userId);
    
    // 신청 ID별 게스트 리뷰 조회
    List<GuestReview> findByApplyId(Long applyId);
    
    // 모집글 ID별 게스트 리뷰 조회
    List<GuestReview> findByPostingId(Long postingId);
    
    // 점수별 게스트 리뷰 조회
    List<GuestReview> findByScore(Integer score);
    
    // 특정 키워드가 포함된 게스트 리뷰 검색
    List<GuestReview> findByContentContaining(String keyword);
    
    // 사용자별 평균 점수 조회
    @Query("SELECT AVG(gr.score) FROM GuestReview gr WHERE gr.userId = :userId")
    Double findAverageScoreByUserId(@Param("userId") Long userId);
    
    // 신청 ID로 게스트 리뷰 존재 여부 확인
    boolean existsByApplyId(Long applyId);
    
    // 특정 기간 내 게스트 리뷰 조회
    @Query("SELECT gr FROM GuestReview gr WHERE gr.createdAt BETWEEN :startDate AND :endDate")
    List<GuestReview> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
