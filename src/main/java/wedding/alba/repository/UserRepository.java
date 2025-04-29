package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // OAuth2 로그인을 위한 조회 메서드
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
    
    // 이메일로 사용자 조회
    Optional<User> findByEmail(String email);
    
    // 전화번호로 사용자 조회
    Optional<User> findByPhoneNumber(String phoneNumber);
    
    // 이름과 생년월일로 사용자 조회
    Optional<User> findByNameAndBirth(String name, LocalDate birth);
    
    // 활성 상태의 사용자만 조회
    List<User> findByStatus(User.UserStatus status);
    
    // 관리자 권한을 가진 사용자 조회
    List<User> findByAuthLevelIn(List<User.AuthLevel> authLevels);
    
    // 지역별 사용자 조회
    List<User> findByAddressCityAndAddressDistrict(String addressCity, String addressDistrict);
    
    // 블랙리스트 사용자 조회
    List<User> findByBlackList(Integer blackListStatus);
    
    // JPQL을 활용한 네이티브 쿼리 예시
    @Query("SELECT u FROM User u WHERE u.name LIKE %:keyword% OR u.email LIKE %:keyword%")
    List<User> searchUsers(@Param("keyword") String keyword);
    
    // 네이티브 SQL 쿼리 예시
    @Query(value = "SELECT * FROM users WHERE DATE(created_at) = CURRENT_DATE", nativeQuery = true)
    List<User> findUsersRegisteredToday();
    
    // 이름 또는 이메일로 사용자 검색
    List<User> findByNameContainingOrEmailContaining(String name, String email);
    
    // 사용자 존재 여부 확인
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
}
