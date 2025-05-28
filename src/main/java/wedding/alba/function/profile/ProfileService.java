package wedding.alba.function.profile;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wedding.alba.dto.ApiResponse;
import wedding.alba.entity.Profile;
import wedding.alba.entity.User;
import wedding.alba.repository.UserRepository;

import java.util.NoSuchElementException;

/**
 * 프로필 정보 조회 서비스
 */
@Service
@Slf4j
public class ProfileService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProfileRepository profileRepository;
    
    /**
     * 사용자 ID로 프로필 정보 조회 (User + Profile 통합)
     * 
     * @param userId 사용자 ID
     * @return 사용자 + 프로필 정보 응답 DTO
     * @throws NoSuchElementException 사용자가 존재하지 않을 경우
     */
    @Transactional(readOnly = true)
    public ApiResponse<UserProfileResponseDto> getUserProfile(Long userId) {
        // 사용자 정보 조회 (필수)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + userId));

        // 프로필 정보 조회 (선택적)
        Profile profile = profileRepository.findByUserId(userId).orElse(null);

        if (profile == null) {
            log.info("사용자 {}의 프로필이 존재하지 않습니다. 빈 프로필 정보를 반환합니다.", userId);
        }

        // 생성자로 DTO 생성
        UserProfileResponseDto responseDto = new UserProfileResponseDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getGender() != null ? user.getGender().name() : null,
                user.getPhoneNumber(),
                user.getBirth(),
                user.getAddressCity(),
                user.getAddressDistrict(),
                user.getAddressDetail(),
                profile != null ? profile.getNickname() : null,
                profile != null ? profile.getSelfIntroduction() : null,
                profile != null ? profile.getActivityArea() : null,
                profile != null && profile.getGuestPower() != null ? profile.getGuestPower() : 0,
                profile != null && profile.getParticipationCount() != null ? profile.getParticipationCount() : 0,
                profile != null ? profile.getProfileImageUrl() : null
        );

        return ApiResponse.success(responseDto);
    }

    /**
     * 프로필 존재 여부 확인
     *
     * @param userId 사용자 ID
     * @return 프로필 존재 여부
     */
    @Transactional(readOnly = true)
    public boolean hasProfile(Long userId) {
        return profileRepository.existsByUserId(userId);
    }

    /**
     * 프로필 정보만 조회
     *
     * @param userId 사용자 ID
     * @return 프로필 정보 응답 DTO (없으면 null)
     */
    @Transactional(readOnly = true)
    public ApiResponse<ProfileResponseDto> getProfile(Long userId) {
        Profile profile = profileRepository.findByUserId(userId).orElse(null);

        if (profile == null) {
            log.info("사용자 {}의 프로필이 존재하지 않습니다.", userId);
            return ApiResponse.success(null);
        }

        // 생성자로 DTO 생성
        ProfileResponseDto responseDto = new ProfileResponseDto(
                profile.getUserId(),
                profile.getNickname(),
                profile.getSelfIntroduction(),
                profile.getActivityArea(),
                profile.getGuestPower(),
                profile.getParticipationCount(),
                profile.getProfileImageUrl()
        );

        return ApiResponse.success(responseDto);
    }
}
