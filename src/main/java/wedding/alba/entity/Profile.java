package wedding.alba.entity;

/**
 * 사용자의 프로필 정보를 관리하는 엔티티
 * 
 * 사용자의 닉네임, 자기소개, 활동 지역, 하객력, 참여 횟수, 프로필 이미지 URL 등
 * 프로필 관련 정보를 저장합니다. User 엔티티와 1:1 관계를 가지며,
 * 사용자의 정보를 표시하거나 검색할 때 활용됩니다.
 */

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    @Id
    @Column(name = "user_id")
    private Long userId;             // 사용자 고유 식별자 (User 엔티티의 PK를 FK로 사용)
    
    @Column(name = "nickname")
    private String nickname;         // 사용자 닉네임 (서비스 내 표시용)
    
    @Column(name = "self_introduction", columnDefinition = "TEXT")
    private String selfIntroduction;  // 자기소개
    
    @Column(name = "activity_area")
    private String activityArea;      // 활동 지역 (경기 북부, 서울 동부 등)
    
    @Column(name = "guest_power")
    private Integer guestPower;       // 하객력 (능력치, 높을수록 좋음)
    
    @Column(name = "participation_count")
    private Integer participationCount; // 결혼식 참여 횟수

    @Column(name = "recruitment_count")
    private Integer recruitmentCount; // 결혼식 모집 횟수
    
    @Column(name = "profile_image_url")
    private String profileImageUrl;    // 프로필 이미지 URL
    
    /**
     * User 엔티티와의 1:1 관계 설정
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
}
