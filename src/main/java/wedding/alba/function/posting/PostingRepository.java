package wedding.alba.function.posting;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.Posting;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostingRepository extends JpaRepository<Posting, Long> {
    // 사용자별 모집글 조회
    List<Posting> findByUserId(Long userId);

    @Query("SELECT p FROM Posting p " +
            "WHERE p.appointmentDatetime >= :now " +
            "AND p.address like %:address% " +
            "AND p.guestMainRole like %:guestMainRole% " +
            "ORDER BY p.registrationDatetime DESC")
    Page<Posting> findPostingPageByKeyword(Pageable pageable,
                                  @Param("now") LocalDateTime now,
                                  @Param("address") String address,
                                  @Param("guestMainRole") String guestMainRole);

    List<Posting> findPostingPageByUserId(Long userId);

}
