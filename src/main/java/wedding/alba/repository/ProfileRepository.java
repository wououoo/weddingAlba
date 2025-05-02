package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.Profile;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    
    // 활동 지역으로 프로필 조회
    List<Profile> findByActivityAreaContaining(String activityArea);

    
    // 닉네임으로 프로필 검색
    List<Profile> findByNicknameContaining(String nickname);
    
    // 프로필 이미지가 있는 프로필 조회
    List<Profile> findByProfileImageUrlIsNotNull();
    
    // 프로필 이미지가 없는 프로필 조회
    List<Profile> findByProfileImageUrlIsNull();
    
    // 닉네임 존재 여부 확인
    boolean existsByNickname(String nickname);
}
