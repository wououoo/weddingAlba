package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.UserSetting;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSettingRepository extends JpaRepository<UserSetting, Long> {
    
    // 사용자 ID로 설정 조회
    Optional<UserSetting> findByUserId(Long userId);
    
    // 푸시 알림이 활성화된 사용자 설정 조회
    List<UserSetting> findByPushNotificationEnabled(Integer pushNotificationEnabled);
    
    // 이메일 알림이 활성화된 사용자 설정 조회
    List<UserSetting> findByEmailNotificationEnabled(Integer emailNotificationEnabled);
    
    // 채팅 알림이 활성화된 사용자 설정 조회
    List<UserSetting> findByChatNotificationEnabled(Integer chatNotificationEnabled);
    
    // 신청 알림이 활성화된 사용자 설정 조회
    List<UserSetting> findByApplicationNotificationEnabled(Integer applicationNotificationEnabled);
    
    // 리뷰 알림이 활성화된 사용자 설정 조회
    List<UserSetting> findByReviewNotificationEnabled(Integer reviewNotificationEnabled);
}
