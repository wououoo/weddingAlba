package wedding.alba.entity;

/**
 * 사용자 설정 정보를 관리하는 엔티티
 * 
 * 사용자의 개인화된 설정 정보를 관리합니다.
 * 푸시 알림, 이메일 알림, 채팅 알림, 신청 알림, 리뷰 알림 등
 * 다양한 형태의 알림 설정을 포함합니다.
 * 사용자가 시스템을 활용하는 방식을 개인화하고 맞춤형 사용자 경험을 제공합니다.
 */

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_settings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSetting {

    @Id
    @Column(name = "user_id")
    private Long userId;                          // 사용자 ID (기본키)
    
    @Column(name = "push_notification_enabled")
    private Integer pushNotificationEnabled;      // 푸시 알림 활성화 여부 (0: 미사용, 1: 사용)
    
    @Column(name = "email_notification_enabled")
    private Integer emailNotificationEnabled;     // 이메일 알림 활성화 여부 (0: 미사용, 1: 사용)
    
    @Column(name = "chat_notification_enabled")
    private Integer chatNotificationEnabled;      // 채팅 알림 활성화 여부 (0: 미사용, 1: 사용)
    
    @Column(name = "application_notification_enabled")
    private Integer applicationNotificationEnabled;  // 신청 관련 알림 활성화 여부 (0: 미사용, 1: 사용)
    
    @Column(name = "review_notification_enabled")
    private Integer reviewNotificationEnabled;    // 리뷰 알림 활성화 여부 (0: 미사용, 1: 사용)
}
