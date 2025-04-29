package wedding.alba.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    // 간편 로그인 정보
    private String provider;        // OAuth2 제공자 (kakao, google, apple)
    private String providerId;      // OAuth2 제공자에서 제공하는 ID
    private String email;           // 이메일 (OAuth2에서 제공하는 경우)
    private String refreshToken;    // 리프레시 토큰

    // 사용자 기본 정보
    private String name;
    
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    private String phoneNumber;
    
    // 주소 정보
    private String addressCity;      // 시/도
    private String addressDistrict;  // 구/군
    private String addressDetail;    // 상세 주소
    
    private LocalDate birth;
    
    @Enumerated(EnumType.STRING)
    private AuthLevel authLevel;
    
    @Column(columnDefinition = "SMALLINT DEFAULT 0")
    private Integer blackList;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    // 회원 상태 (활성/비활성)
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    
    // 성별 열거형
    public enum Gender {
        MALE, FEMALE, OTHER
    }
    
    // 권한 레벨 열거형
    public enum AuthLevel {
        USER, ADMIN, SUPER_ADMIN
    }
    
    // 사용자 상태 열거형
    public enum UserStatus {
        ACTIVE, INACTIVE, DELETED
    }
}
