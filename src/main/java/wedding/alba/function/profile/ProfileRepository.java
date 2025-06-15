package wedding.alba.function.profile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.Profile;

import java.util.Optional;

/**
 * 프로필 정보 데이터 액세스 레포지토리
 */
@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    
    /**
     * 사용자 ID로 프로필 조회
     * 
     * @param userId 사용자 ID
     * @return 프로필 정보
     */
    Optional<Profile> findByUserId(Long userId);
    
    /**
     * 사용자 ID로 프로필 존재 여부 확인
     * 
     * @param userId 사용자 ID
     * @return 존재 여부
     */
    boolean existsByUserId(Long userId);
}
