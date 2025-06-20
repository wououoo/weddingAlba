package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.PostHistory;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostHistoryRepository extends JpaRepository<PostHistory, Long> {
//
//    // 원본 모집글 ID로 이력 조회
//    List<PostHistory> findByPostingId(Long postingId);
//
//    // 사용자 ID별 모집글 이력 조회
//    List<PostHistory> findByUserId(Long userId);
//
//    // 등록 일시 범위로 이력 조회
//    List<PostHistory> findByRegistrationDatetimeBetween(LocalDateTime start, LocalDateTime end);
//
//    // 특정 지역의 모집글 이력 조회
//    List<PostHistory> findByLocationContaining(String location);
//
//    // 특정 제목의 모집글 이력 조회
//    List<PostHistory> findByTitleContaining(String title);
//
//    // 자신이 직접 결혼하는 모집글 이력 조회
//    List<PostHistory> findByIsSelf(Integer isSelf);
//
//    // 모바일 청첩장이 있는 모집글 이력 조회
//    List<PostHistory> findByHasMobileInvitation(Integer hasMobileInvitation);

}
