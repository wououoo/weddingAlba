package wedding.alba.function.applying;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    
    @Query("SELECT a FROM Applying a WHERE userId = :userId AND (:status IS NULL OR a.status = :status)")
    Page<Applying> findMyPageByStatus(Pageable pageable, @Param("status") int status, @Param("userId") Long userId);

    Page<Applying> findAllByUserId(Pageable pageable, Long userId);

    // 모집글 ID별 신청 조회
    List<Applying> findByPostingId(Long postingId);

}
