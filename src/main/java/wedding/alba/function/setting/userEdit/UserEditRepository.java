package wedding.alba.function.setting.userEdit;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.User;

/**
 * 사용자 정보 수정을 위한 리포지토리
 */
@Repository
public interface UserEditRepository extends JpaRepository<User, Long> {
    // 필요한 사용자 정보 조회 및 수정 관련 쿼리 메서드 추가
}
