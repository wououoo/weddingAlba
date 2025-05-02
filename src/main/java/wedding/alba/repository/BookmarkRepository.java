package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.Bookmark;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    
    // 사용자 ID별 북마크 조회
    List<Bookmark> findByUserId(Long userId);
    
    // 모집글 ID별 북마크 조회
    List<Bookmark> findByPostingId(Long postingId);
    
    // 사용자 ID와 모집글 ID로 북마크 조회
    Optional<Bookmark> findByUserIdAndPostingId(Long userId, Long postingId);
    
    // 북마크 일시 범위로 조회
    List<Bookmark> findByMarcDateBetween(LocalDateTime start, LocalDateTime end);
    
    // 메모에 특정 키워드가 포함된 북마크 조회
    List<Bookmark> findByMemoContaining(String keyword);
    
    // 사용자가 특정 모집글을 북마크했는지 확인
    boolean existsByUserIdAndPostingId(Long userId, Long postingId);

}
