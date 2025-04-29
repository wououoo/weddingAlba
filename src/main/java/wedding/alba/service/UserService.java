package wedding.alba.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wedding.alba.entity.User;
import wedding.alba.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * OAuth2 로그인 처리
     * @param provider OAuth2 제공자 (kakao, google, apple)
     * @param providerId 제공자 ID
     * @param email 이메일
     * @param name 이름
     * @return 생성되거나 조회된 사용자
     */
    @Transactional
    public User processOAuthLogin(String provider, String providerId, String email, String name) {
        Optional<User> existingUser = userRepository.findByProviderAndProviderId(provider, providerId);
        
        if (existingUser.isPresent()) {
            // 기존 사용자 정보 업데이트
            User user = existingUser.get();
            if (email != null && !email.isEmpty()) {
                user.setEmail(email);
            }
            if (name != null && !name.isEmpty()) {
                user.setName(name);
            }
            return userRepository.save(user);
        } else {
            // 새 사용자 생성
            User newUser = User.builder()
                    .provider(provider)
                    .providerId(providerId)
                    .email(email)
                    .name(name)
                    .status(User.UserStatus.ACTIVE)
                    .authLevel(User.AuthLevel.USER)
                    .blackList(0) // 0: 블랙리스트 아님
                    .build();
            return userRepository.save(newUser);
        }
    }

    /**
     * 사용자 정보 조회
     * @param userId 사용자 ID
     * @return 사용자 정보
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    /**
     * 사용자 정보 업데이트
     * @param userId 사용자 ID
     * @param updatedUser 업데이트할 사용자 정보
     * @return 업데이트된 사용자 정보
     */
    @Transactional
    public User updateUserInfo(Long userId, User updatedUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        // 필요한 필드만 업데이트
        if (updatedUser.getName() != null) {
            user.setName(updatedUser.getName());
        }
        if (updatedUser.getPhoneNumber() != null) {
            user.setPhoneNumber(updatedUser.getPhoneNumber());
        }
        if (updatedUser.getGender() != null) {
            user.setGender(updatedUser.getGender());
        }
        if (updatedUser.getBirth() != null) {
            user.setBirth(updatedUser.getBirth());
        }
        if (updatedUser.getAddressCity() != null) {
            user.setAddressCity(updatedUser.getAddressCity());
        }
        if (updatedUser.getAddressDistrict() != null) {
            user.setAddressDistrict(updatedUser.getAddressDistrict());
        }
        if (updatedUser.getAddressDetail() != null) {
            user.setAddressDetail(updatedUser.getAddressDetail());
        }
        
        return userRepository.save(user);
    }

    /**
     * 사용자 상태 변경 (활성/비활성/삭제)
     * @param userId 사용자 ID
     * @param status 변경할 상태
     * @return 업데이트된 사용자 정보
     */
    @Transactional
    public User updateUserStatus(Long userId, User.UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        user.setStatus(status);
        return userRepository.save(user);
    }

    /**
     * 블랙리스트 추가/제거
     * @param userId 사용자 ID
     * @param blacklistStatus 블랙리스트 상태
     * @return 업데이트된 사용자 정보
     */
    @Transactional
    public User updateBlacklistStatus(Long userId, int blacklistStatus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        user.setBlackList(blacklistStatus);
        return userRepository.save(user);
    }

    /**
     * 사용자 권한 변경
     * @param userId 사용자 ID
     * @param authLevel 변경할 권한
     * @return 업데이트된 사용자 정보
     */
    @Transactional
    public User updateUserAuthLevel(Long userId, User.AuthLevel authLevel) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        user.setAuthLevel(authLevel);
        return userRepository.save(user);
    }

    /**
     * 사용자 검색
     * @param keyword 검색어
     * @return 검색 결과 목록
     */
    @Transactional(readOnly = true)
    public List<User> searchUsers(String keyword) {
        return userRepository.searchUsers(keyword);
    }

    /**
     * 지역별 사용자 조회
     * @param city 시/도
     * @param district 구/군
     * @return 사용자 목록
     */
    @Transactional(readOnly = true)
    public List<User> getUsersByLocation(String city, String district) {
        return userRepository.findByAddressCityAndAddressDistrict(city, district);
    }

    /**
     * 블랙리스트 사용자 조회
     * @return 블랙리스트 사용자 목록
     */
    @Transactional(readOnly = true)
    public List<User> getBlacklistedUsers() {
        return userRepository.findByBlackList(1); // 1은 블랙리스트 상태
    }
}
