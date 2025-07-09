package wedding.alba.entity;

/**
 * 사용자 정보를 관리하는 엔티티
 * 
 * 사용자의 기본 정보(이름, 성별, 생년월일 등)와 OAuth2 로그인 정보,
 * 주소 정보, 권한 정보 등을 저장합니다. 시스템의 모든 기능은 이 사용자를
 * 기반으로 동작하며, 회원가입, 로그인, 권한 관리 등에 활용됩니다.
 */

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
    private Long userId; // 사용자 고유 식별자

    // 간편 로그인 정보
    private String provider;        // OAuth2 제공자 (kakao, google, apple)
    private String providerId;      // OAuth2 제공자에서 제공하는 ID
    private String email;           // 이메일 (신원 확인 및 비밀번호 찾기용)

    // 사용자 기본 정보
    private String name;            // 사용자 이름
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Gender gender = Gender.OTHER;  // 성별 (MALE, FEMALE, OTHER)
    
    private String phoneNumber;      // 휴대폰 번호 (신원 확인 및 연락수단)
    
    // 주소 정보
    private String addressCity;      // 시/도 (서울, 경기 등)
    private String addressDistrict;  // 구/군 (강남구, 용인시 등)
    private String addressDetail;    // 상세 주소
    
    private LocalDate birth;          // 생년월일 (나이 계산용)
    
    @Enumerated(EnumType.STRING)
    @Column(name = "auth_level", nullable = false)
    @Builder.Default
    private AuthLevel authLevel = AuthLevel.USER;  // 권한 레벨 (USER, ADMIN, SUPER_ADMIN)
    
    @Column(name = "black_list", nullable = false)
    @Builder.Default
    private Integer blackList = 0;   // 블랙리스트 상태 (0: 아님, 1: 블랙리스트)
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;  // 회원가입 일시
    
    // 회원 상태 (활성/비활성)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;  // 사용자 상태 (ACTIVE, INACTIVE, DELETED)
    
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
