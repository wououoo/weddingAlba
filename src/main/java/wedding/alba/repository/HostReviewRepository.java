package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.HostReview;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HostReviewRepository extends JpaRepository<HostReview, Long> {
    
    // 신청 ID별 호스트 리뷰 조회
    List<HostReview> findByApplyId(Long applyId);
    
    // 모집글 ID별 호스트 리뷰 조회
    List<HostReview> findByPostingId(Long postingId);
    
    // 사용자 ID별 호스트 리뷰 조회 (사용자가 작성한 리뷰)
    List<HostReview> findByUserId(Long userId);
    
    // 생성 일시 범위로 호스트 리뷰 조회
    List<HostReview> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    // 점수별 호스트 리뷰 조회
    List<HostReview> findByScore(Integer score);
    
    // 특정 키워드가 포함된 호스트 리뷰 검색
    List<HostReview> findByContentContaining(String keyword);
}
