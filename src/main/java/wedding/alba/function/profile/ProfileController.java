package wedding.alba.function.profile;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import wedding.alba.dto.ApiResponse;

import java.util.NoSuchElementException;

/**
 * 프로필 정보 조회 컨트롤러
 */
@RestController
@RequestMapping("/api/profile")
@Slf4j
public class ProfileController {

    @Autowired
    private ProfileService profileService;
    
    /**
     * 내 프로필 정보 조회 (User + Profile 통합)
     * 
     * @param userId 인증된 사용자 ID
     * @return 사용자 + 프로필 정보 응답
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponseDto>> getMyProfile(@AuthenticationPrincipal Long userId) {
        try {
            log.info("프로필 정보 조회 요청 - userId: {}", userId);
            
            ApiResponse<UserProfileResponseDto> response = profileService.getUserProfile(userId);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            log.error("프로필 정보 조회 실패 - userId: {}", userId, e);
            return ResponseEntity.ok(ApiResponse.error("사용자를 찾을 수 없습니다."));
        } catch (Exception e) {
            log.error("프로필 정보 조회 중 예상치 못한 오류 발생 - userId: {}", userId, e);
            return ResponseEntity.ok(ApiResponse.error("프로필 정보 조회 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 프로필 존재 여부 확인
     * 
     * @param userId 인증된 사용자 ID
     * @return 프로필 존재 여부
     */
    @GetMapping("/exists")
    public ResponseEntity<ApiResponse<Boolean>> checkProfileExists(@AuthenticationPrincipal Long userId) {
        try {
            log.info("프로필 존재 여부 확인 요청 - userId: {}", userId);
            
            boolean exists = profileService.hasProfile(userId);
            return ResponseEntity.ok(ApiResponse.success(exists));
        } catch (Exception e) {
            log.error("프로필 존재 여부 확인 중 오류 발생 - userId: {}", userId, e);
            return ResponseEntity.ok(ApiResponse.error("프로필 존재 여부 확인 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 프로필 정보만 조회 (Profile 엔티티만)
     * 
     * @param userId 인증된 사용자 ID
     * @return 프로필 정보만 응답 (없으면 null)
     */
    @GetMapping("/profile-only")
    public ResponseEntity<ApiResponse<ProfileResponseDto>> getProfileOnly(@AuthenticationPrincipal Long userId) {
        try {
            log.info("프로필 정보만 조회 요청 - userId: {}", userId);
            
            ApiResponse<ProfileResponseDto> response = profileService.getProfile(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("프로필 정보 조회 중 오류 발생 - userId: {}", userId, e);
            return ResponseEntity.ok(ApiResponse.error("프로필 정보 조회 중 오류가 발생했습니다."));
        }
    }
}
