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
import java.util.Optional;

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

    /**
     * 프로필 정보 수정/생성
     *
     * @param userId 사용자 ID
     * @param requestDto 프로필 수정 요청 DTO
     * @return 수정된 프로필 정보 응답 DTO
     * @throws NoSuchElementException 사용자가 존재하지 않을 경우
     */
    @Transactional
    public ApiResponse<ProfileResponseDto> updateProfile(Long userId, ProfileUpdateRequestDTO requestDto) {
        // 사용자 존재 여부 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + userId));

        // 기존 프로필 조회
        Optional<Profile> existingProfile = profileRepository.findByUserId(userId);

        Profile profile;
        boolean isNewProfile = false;

        if (existingProfile.isPresent()) {
            // 기존 프로필 수정
            profile = existingProfile.get();
            log.info("사용자 {}의 기존 프로필을 수정합니다.", userId);
        } else {
            // 새 프로필 생성
            profile = new Profile();
            profile.setUserId(userId);
            isNewProfile = true;
            log.info("사용자 {}의 새 프로필을 생성합니다.", userId);
        }

        // 프로필 정보 업데이트
        if (requestDto.getNickname() != null) {
            profile.setNickname(requestDto.getNickname());
        }
        if (requestDto.getSelfIntroduction() != null) {
            profile.setSelfIntroduction(requestDto.getSelfIntroduction());
        }
        if (requestDto.getActivityArea() != null) {
            profile.setActivityArea(requestDto.getActivityArea());
        }
        if (requestDto.getProfileImageUrl() != null) {
            profile.setProfileImageUrl(requestDto.getProfileImageUrl());
        }

        // 프로필 저장
        Profile savedProfile = profileRepository.save(profile);

        // 응답 DTO 생성
        ProfileResponseDto responseDto = new ProfileResponseDto(
                savedProfile.getUserId(),
                savedProfile.getNickname(),
                savedProfile.getSelfIntroduction(),
                savedProfile.getActivityArea(),
                savedProfile.getGuestPower(),
                savedProfile.getParticipationCount(),
                savedProfile.getProfileImageUrl()
        );

        log.info("사용자 {}의 프로필이 {}되었습니다.", userId, isNewProfile ? "생성" : "수정");
        return ApiResponse.success(responseDto);
    }

    /**
     * 프로필 이미지 URL만 업데이트
     *
     * @param userId 사용자 ID
     * @param imageUrl 새 이미지 URL
     * @return 수정된 프로필 정보 응답 DTO
     */
    @Transactional
    public ApiResponse<ProfileResponseDto> updateProfileImage(Long userId, String imageUrl) {
        // 사용자 존재 여부 확인
        userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + userId));

        // 프로필 조회 또는 생성
        Profile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Profile newProfile = new Profile();
                    newProfile.setUserId(userId);
                    return newProfile;
                });

        // 이미지 URL 업데이트
        profile.setProfileImageUrl(imageUrl);
        Profile savedProfile = profileRepository.save(profile);

        // 응답 DTO 생성
        ProfileResponseDto responseDto = new ProfileResponseDto(
                savedProfile.getUserId(),
                savedProfile.getNickname(),
                savedProfile.getSelfIntroduction(),
                savedProfile.getActivityArea(),
                savedProfile.getGuestPower(),
                savedProfile.getParticipationCount(),
                savedProfile.getProfileImageUrl()
        );

        log.info("사용자 {}의 프로필 이미지가 업데이트되었습니다.", userId);
        return ApiResponse.success(responseDto);
    }

    /**
     * 프로필 삭제
     *
     * @param userId 사용자 ID
     * @return 삭제 결과
     */
    @Transactional
    public ApiResponse<String> deleteProfile(Long userId) {
        // 사용자 존재 여부 확인
        userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + userId));

        // 프로필 존재 여부 확인
        Optional<Profile> profile = profileRepository.findByUserId(userId);

        if (profile.isPresent()) {
            profileRepository.delete(profile.get());
            log.info("사용자 {}의 프로필이 삭제되었습니다.", userId);
            return ApiResponse.success("프로필이 삭제되었습니다.");
        } else {
            log.warn("사용자 {}의 프로필이 존재하지 않습니다.", userId);
            return ApiResponse.success("삭제할 프로필이 없습니다.");
        }
    }
}
