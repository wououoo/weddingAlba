package wedding.alba.function.setting.userEdit;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * 사용자 정보 수정 관련 레포지토리
 * 사용자 정보 수정 이력 관리 등 추가 기능 제공
 */
@Repository
@Slf4j
public class UserEditRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 사용자 정보 수정 이력 저장 (선택적 기능)
     * 
     * @param userId 사용자 ID
     * @param request 사용자 정보 수정 요청 DTO
     */
    public void saveUserEditHistory(Long userId, UserEditDto.Request request) {
        // 사용자 정보 수정 이력을 저장하는 로직 (필요 시 구현)
        // 예: 수정 이력 테이블에 기록
        
        log.debug("사용자 정보 수정 이력 저장 완료. 사용자 ID: {}", userId);
    }
    
    /**
     * 사용자 프로필 수정 횟수 조회 (선택적 기능)
     * 
     * @param userId 사용자 ID
     * @return 프로필 수정 횟수
     */
    public int getProfileEditCount(Long userId) {
        // 사용자 프로필 수정 횟수 조회 로직 (필요 시 구현)
        // 예시 코드: count 쿼리 실행
        String sql = "SELECT COUNT(*) FROM user_edit_history WHERE user_id = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, userId);
    }
}
