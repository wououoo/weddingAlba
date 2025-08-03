package wedding.alba.function.profile;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wedding.alba.dto.ApiResponse;
import wedding.alba.config.JwtConfig;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * 프로필 관련 API 컨트롤러
 */
@RestController
@RequestMapping("/api/profile")
@Slf4j
public class ProfileController {

    @Autowired
    private ProfileService profileService;
    
    @Autowired
    private JwtConfig jwtConfig;
    
    /**
     * 프로필 갤러리 메인 이미지 설정
     * 
     * @param request HTTP 요청
     * @param imageId 메인으로 설정할 이미지 ID
     * @return 설정 결과
     */
    @PutMapping("/me/gallery/{imageId}/set-main")
    public ResponseEntity<ApiResponse<String>> setMainGalleryImage(
            HttpServletRequest request,
            @PathVariable Long imageId) {
        try {
            Long userId = extractUserIdFromToken(request);
            log.info("사용자 {}의 갤러리 이미지 {} 메인 설정 요청", userId, imageId);
            ApiResponse<String> response = profileService.setMainGalleryImage(userId, imageId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("갤러리 메인 이미지 설정 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("갤러리 메인 이미지 설정 중 예상치 못한 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("갤러리 메인 이미지 설정 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 내 프로필 조회 (사용자 + 프로필 통합 정보)
     * 
     * @param request HTTP 요청
     * @return 사용자 + 프로필 정보
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponseDto>> getMyProfile(HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromToken(request);
            log.info("사용자 {}의 프로필 조회 요청", userId);
            ApiResponse<UserProfileResponseDto> response = profileService.getUserProfile(userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("프로필 정보 조회 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("프로필 정보 조회 중 예상치 못한 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("프로필 정보 조회 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 프로필 정보만 조회
     * 
     * @param userId 사용자 ID
     * @return 프로필 정보
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<ProfileResponseDto>> getProfile(@PathVariable Long userId) {
        try {
            log.info("사용자 {}의 프로필 정보 조회 요청", userId);
            ApiResponse<ProfileResponseDto> response = profileService.getProfile(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("프로필 정보 조회 중 오류 발생 - userId: {}", userId, e);
            return ResponseEntity.ok(ApiResponse.error("프로필 정보 조회 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 프로필 수정/생성 (갤러리 포함 - MultipartFile)
     * 
     * @param request HTTP 요청
     * @param nickname 닉네임
     * @param selfIntroduction 자기소개
     * @param activityArea 활동지역
     * @param profileImage 프로필 이미지 파일
     * @param galleryImages 갤러리 이미지 파일들
     * @param deleteGalleryImageIds 삭제할 갤러리 이미지 ID들
     * @return 수정된 프로필 정보
     */
    @PostMapping("/me/with-gallery")
    public ResponseEntity<ApiResponse<ProfileResponseDto>> updateProfileWithGallery(
            HttpServletRequest request,
            @RequestParam(value = "nickname", required = false) String nickname,
            @RequestParam(value = "selfIntroduction", required = false) String selfIntroduction,
            @RequestParam(value = "activityArea", required = false) String activityArea,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestParam(value = "galleryImages", required = false) List<MultipartFile> galleryImages,
            @RequestParam(value = "deleteGalleryImageIds", required = false) List<Long> deleteGalleryImageIds) {
        try {
            Long userId = extractUserIdFromToken(request);
            log.info("사용자 {}의 프로필 및 갤러리 수정 요청", userId);
            
            ProfileUpdateWithGalleryRequest requestDto = ProfileUpdateWithGalleryRequest.builder()
                    .nickname(nickname)
                    .selfIntroduction(selfIntroduction)
                    .activityArea(activityArea)
                    .profileImage(profileImage)
                    .galleryImages(galleryImages != null ? galleryImages : List.of())
                    .deleteGalleryImageIds(deleteGalleryImageIds != null ? deleteGalleryImageIds : List.of())
                    .build();
            
            ApiResponse<ProfileResponseDto> response = profileService.updateProfileWithGallery(userId, requestDto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("프로필 및 갤러리 수정 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("프로필 및 갤러리 수정 중 예상치 못한 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("프로필 및 갤러리 수정 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 프로필 수정/생성
     * 
     * @param request HTTP 요청
     * @param requestDto 프로필 수정 요청 데이터
     * @return 수정된 프로필 정보
     */
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponseDto>> updateMyProfile(
            HttpServletRequest request,
            @Valid @RequestBody ProfileUpdateRequestDTO requestDto) {
        try {
            Long userId = extractUserIdFromToken(request);
            log.info("사용자 {}의 프로필 수정 요청: {}", userId, requestDto);
            ApiResponse<ProfileResponseDto> response = profileService.updateProfile(userId, requestDto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("프로필 수정 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("프로필 수정 중 예상치 못한 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("프로필 수정 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 프로필 이미지만 업데이트
     * 
     * @param request HTTP 요청
     * @param imageUrl 새 이미지 URL
     * @return 수정된 프로필 정보
     */
    @PatchMapping("/me/image")
    public ResponseEntity<ApiResponse<ProfileResponseDto>> updateProfileImage(
            HttpServletRequest request,
            @RequestParam String imageUrl) {
        try {
            Long userId = extractUserIdFromToken(request);
            log.info("사용자 {}의 프로필 이미지 업데이트 요청: {}", userId, imageUrl);
            ApiResponse<ProfileResponseDto> response = profileService.updateProfileImage(userId, imageUrl);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("프로필 이미지 업데이트 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("프로필 이미지 업데이트 중 예상치 못한 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("프로필 이미지 업데이트 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 프로필 삭제
     * 
     * @param request HTTP 요청
     * @return 삭제 결과
     */
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<String>> deleteMyProfile(HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromToken(request);
            log.info("사용자 {}의 프로필 삭제 요청", userId);
            ApiResponse<String> response = profileService.deleteProfile(userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("프로필 삭제 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("프로필 삭제 중 예상치 못한 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("프로필 삭제 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 프로필 존재 여부 확인 (내 프로필)
     * 
     * @param request HTTP 요청
     * @return 프로필 존재 여부
     */
    @GetMapping("/me/exists")
    public ResponseEntity<ApiResponse<Boolean>> hasMyProfile(HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromToken(request);
            log.info("사용자 {}의 프로필 존재 여부 확인 요청", userId);
            boolean exists = profileService.hasProfile(userId);
            return ResponseEntity.ok(ApiResponse.success(exists));
        } catch (RuntimeException e) {
            log.error("프로필 존재 여부 확인 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("프로필 존재 여부 확인 중 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("프로필 존재 여부 확인 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 프로필 존재 여부 확인 (특정 사용자)
     * 
     * @param userId 사용자 ID
     * @return 프로필 존재 여부
     */
    @GetMapping("/{userId}/exists")
    public ResponseEntity<ApiResponse<Boolean>> hasProfile(@PathVariable Long userId) {
        try {
            log.info("사용자 {}의 프로필 존재 여부 확인 요청", userId);
            boolean exists = profileService.hasProfile(userId);
            return ResponseEntity.ok(ApiResponse.success(exists));
        } catch (Exception e) {
            log.error("프로필 존재 여부 확인 중 오류 발생 - userId: {}", userId, e);
            return ResponseEntity.ok(ApiResponse.error("프로필 존재 여부 확인 중 오류가 발생했습니다."));
        }
    }
    
    // ===== 프로필 갤러리 관련 API =====
    
    /**
     * 프로필 갤러리 이미지 업로드
     * 
     * @param request HTTP 요청
     * @param file 업로드할 이미지 파일
     * @return 업로드된 이미지 정보
     */
    @PostMapping("/me/gallery")
    public ResponseEntity<ApiResponse<ProfileGalleryDto>> uploadGalleryImage(
            HttpServletRequest request,
            @RequestParam("file") MultipartFile file) {
        try {
            Long userId = extractUserIdFromToken(request);
            log.info("사용자 {}의 갤러리 이미지 업로드 요청", userId);
            ApiResponse<ProfileGalleryDto> response = profileService.uploadGalleryImage(userId, file);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("갤러리 이미지 업로드 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("갤러리 이미지 업로드 중 예상치 못한 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("갤러리 이미지 업로드 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 프로필 갤러리 이미지 목록 조회
     * 
     * @param request HTTP 요청
     * @return 갤러리 이미지 목록
     */
    @GetMapping("/me/gallery")
    public ResponseEntity<ApiResponse<List<ProfileGalleryDto>>> getMyGalleryImages(HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromToken(request);
            log.info("사용자 {}의 갤러리 이미지 목록 조회 요청", userId);
            ApiResponse<List<ProfileGalleryDto>> response = profileService.getGalleryImages(userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("갤러리 이미지 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("갤러리 이미지 목록 조회 중 예상치 못한 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("갤러리 이미지 목록 조회 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 프로필 갤러리 이미지 삭제
     * 
     * @param request HTTP 요청
     * @param imageId 삭제할 이미지 ID
     * @return 삭제 결과
     */
    @DeleteMapping("/me/gallery/{imageId}")
    public ResponseEntity<ApiResponse<String>> deleteGalleryImage(
            HttpServletRequest request,
            @PathVariable Long imageId) {
        try {
            Long userId = extractUserIdFromToken(request);
            log.info("사용자 {}의 갤러리 이미지 {} 삭제 요청", userId, imageId);
            ApiResponse<String> response = profileService.deleteGalleryImage(userId, imageId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("갤러리 이미지 삭제 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("갤러리 이미지 삭제 중 예상치 못한 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("갤러리 이미지 삭제 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 프로필 갤러리 이미지 순서 변경
     * 
     * @param request HTTP 요청
     * @param imageIds 새로운 순서의 이미지 ID 배열
     * @return 순서 변경 결과
     */
    @PutMapping("/me/gallery/order")
    public ResponseEntity<ApiResponse<String>> updateGalleryOrder(
            HttpServletRequest request,
            @RequestBody List<Long> imageIds) {
        try {
            Long userId = extractUserIdFromToken(request);
            log.info("사용자 {}의 갤러리 이미지 순서 변경 요청: {}", userId, imageIds);
            ApiResponse<String> response = profileService.updateGalleryOrder(userId, imageIds);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("갤러리 이미지 순서 변경 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("갤러리 이미지 순서 변경 중 예상치 못한 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("갤러리 이미지 순서 변경 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * 메인 프로필 이미지 업로드 (파일)
     * 
     * @param request HTTP 요청
     * @param file 업로드할 이미지 파일
     * @return 업로드된 이미지 정보
     */
    @PostMapping("/me/image/upload")
    public ResponseEntity<ApiResponse<ProfileResponseDto>> uploadProfileImage(
            HttpServletRequest request,
            @RequestParam("file") MultipartFile file) {
        try {
            Long userId = extractUserIdFromToken(request);
            log.info("사용자 {}의 프로필 이미지 업로드 요청", userId);
            ApiResponse<ProfileResponseDto> response = profileService.uploadProfileImage(userId, file);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("프로필 이미지 업로드 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("프로필 이미지 업로드 중 예상치 못한 오류 발생", e);
            return ResponseEntity.ok(ApiResponse.error("프로필 이미지 업로드 중 오류가 발생했습니다."));
        }
    }
    
    /**
     * JWT 토큰에서 userId 추출하는 헬퍼 메서드
     */
    private Long extractUserIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("인증 토큰이 없습니다.");
        }
        
        String token = authHeader.substring(7);
        log.debug("JWT 토큰: {}", token);
        
        try {
            // JWT 토큰에서 사용자 ID 추출
            String userIdStr = jwtConfig.extractUserId(token);
            Long userId = Long.parseLong(userIdStr);
            log.debug("추출된 사용자 ID: {}", userId);
            return userId;
        } catch (Exception e) {
            log.error("JWT 토큰 파싱 오류: {}", e.getMessage());
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
    }
}
