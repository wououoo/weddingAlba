package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.GuestReview;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GuestReviewRepository extends JpaRepository<GuestReview, Long> {
    
    // 신청 ID별 게스트 리뷰 조회
    List<GuestReview> findByApplyId(Long applyId);
    
    // 모집글 ID별 게스트 리뷰 조회
    List<GuestReview> findByPostingId(Long postingId);
    
    // 사용자 ID별 게스트 리뷰 조회 (사용자가 작성한 리뷰)
    List<GuestReview> findByUserId(Long userId);
    
    // 생성 일시 범위로 게스트 리뷰 조회
    List<GuestReview> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    // 점수별 게스트 리뷰 조회
    List<GuestReview> findByScore(Integer score);
    
    // 특정 키워드가 포함된 게스트 리뷰 검색
    List<GuestReview> findByContentContaining(String keyword);

}
