package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.ProfileGallery;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileGalleryRepository extends JpaRepository<ProfileGallery, Long> {

    /**
     * 특정 사용자의 모든 갤러리 이미지를 순서대로 조회
     */
    List<ProfileGallery> findByUserIdOrderByImageOrderAsc(Long userId);

    /**
     * 특정 사용자의 메인 갤러리 이미지 조회
     */
    Optional<ProfileGallery> findByUserIdAndIsMainTrue(Long userId);

    /**
     * 특정 사용자의 갤러리 이미지 개수 조회
     */
    long countByUserId(Long userId);

    /**
     * 특정 사용자의 갤러리 이미지 삭제
     */
    void deleteByUserId(Long userId);

    /**
     * 특정 사용자의 특정 이미지 삭제
     */
    void deleteByUserIdAndId(Long userId, Long id);

    /**
     * 특정 사용자의 모든 이미지를 메인이 아닌 것으로 설정
     */
    @Modifying
    @Query("UPDATE ProfileGallery pg SET pg.isMain = false WHERE pg.userId = :userId")
    void updateAllIsMainToFalseByUserId(@Param("userId") Long userId);

    /**
     * 특정 사용자의 특정 이미지를 메인으로 설정
     */
    @Modifying
    @Query("UPDATE ProfileGallery pg SET pg.isMain = true WHERE pg.userId = :userId AND pg.id = :id")
    void updateIsMainToTrueByUserIdAndId(@Param("userId") Long userId, @Param("id") Long id);

    /**
     * 특정 사용자의 갤러리 이미지 순서 업데이트
     */
    @Modifying
    @Query("UPDATE ProfileGallery pg SET pg.imageOrder = :newOrder WHERE pg.userId = :userId AND pg.id = :id")
    void updateImageOrderByUserIdAndId(@Param("userId") Long userId, @Param("id") Long id, @Param("newOrder") Integer newOrder);

    /**
     * 특정 사용자의 최대 순서 값 조회
     */
    @Query("SELECT COALESCE(MAX(pg.imageOrder), 0) FROM ProfileGallery pg WHERE pg.userId = :userId")
    Integer findMaxImageOrderByUserId(@Param("userId") Long userId);
    
    /**
     * 전체 사용자의 첫 번째 이미지(image_order = 1)를 메인으로 설정
     */
    @Modifying
    @Query("UPDATE ProfileGallery pg SET pg.isMain = true WHERE pg.imageOrder = 1 AND pg.isMain = false")
    int updateFirstImageAsMain();
}
