package wedding.alba.function.profile;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import wedding.alba.dto.ApiResponse;
import wedding.alba.entity.Profile;
import wedding.alba.entity.ProfileGallery;
import wedding.alba.entity.User;
import wedding.alba.repository.ProfileGalleryRepository;
import wedding.alba.repository.UserRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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
    
    @Autowired
    private ProfileGalleryRepository profileGalleryRepository;
    
    @Value("${file.upload.path:/uploads}")
    private String uploadPath;
    
    @Value("${file.upload.url:/uploads}")
    private String uploadUrl;
    
    private static final int MAX_GALLERY_IMAGES = 5;
    
    /**
     * 프로필 갤러리 메인 이미지 설정
     * 
     * @param userId 사용자 ID
     * @param imageId 메인으로 설정할 이미지 ID
     * @return 설정 결과
     */
    @Transactional
    public ApiResponse<String> setMainGalleryImage(Long userId, Long imageId) {
        // 이미지 존재 여부 및 권한 확인
        ProfileGallery targetImage = profileGalleryRepository.findById(imageId)
                .orElseThrow(() -> new NoSuchElementException("이미지를 찾을 수 없습니다. ID: " + imageId));
        
        if (!targetImage.getUserId().equals(userId)) {
            throw new RuntimeException("해당 이미지를 수정할 권한이 없습니다.");
        }
        
        try {
            // 1. 해당 사용자의 모든 갤러리 이미지를 메인이 아닌 것으로 설정
            profileGalleryRepository.updateAllIsMainToFalseByUserId(userId);
            log.info("사용자 {}의 모든 갤러리 이미진를 비메인으로 설정", userId);
            
            // 2. 선택된 이미지를 메인으로 설정
            targetImage.setIsMain(true);
            profileGalleryRepository.save(targetImage);
            log.info("사용자 {}의 갤러리 이미지 {}를 메인으로 설정", userId, imageId);
            
            // 3. 프로필 메인 이미지 URL 업데이트
            Profile profile = profileRepository.findByUserId(userId).orElse(null);
            if (profile != null) {
                profile.setProfileImageUrl(targetImage.getImageUrl());
                profileRepository.save(profile);
                log.info("사용자 {}의 프로필 메인 이미지 URL 업데이트: {}", userId, targetImage.getImageUrl());
            }
            
            return ApiResponse.success("메인 이미지가 설정되었습니다.");
            
        } catch (Exception e) {
            log.error("메인 이미지 설정 중 오류 발생", e);
            throw new RuntimeException("메인 이미지 설정 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
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
    
    /**
     * 프로필 정보 수정/생성 (갤러리 포함)
     *
     * @param userId 사용자 ID
     * @param request 프로필 및 갤러리 수정 요청 DTO
     * @return 수정된 프로필 정보 응답 DTO
     * @throws NoSuchElementException 사용자가 존재하지 않을 경우
     */
    @Transactional
    public ApiResponse<ProfileResponseDto> updateProfileWithGallery(Long userId, ProfileUpdateWithGalleryRequest request) {
        try {
            // 사용자 존재 여부 확인
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + userId));

            // 1. 메인 프로필 이미지 처리
            String profileImageUrl = null;
            if (request.getProfileImage() != null && !request.getProfileImage().isEmpty()) {
                try {
                    // 기존 프로필 이미지 삭제
                    Profile existingProfile = profileRepository.findByUserId(userId).orElse(null);
                    if (existingProfile != null && existingProfile.getProfileImageUrl() != null) {
                        deleteFile(existingProfile.getProfileImageUrl());
                    }
                    
                    // 새 프로필 이미지 저장
                    String fileName = saveFile(request.getProfileImage(), "profile");
                    profileImageUrl = uploadUrl + "/profile/" + fileName;
                    
                    // 프로필 이미지를 갤러리에도 추가 (메인 이미지로 설정)
                    // 기존 메인 이미지를 메인이 아닌 것으로 변경
                    profileGalleryRepository.updateAllIsMainToFalseByUserId(userId);
                    
                    // 새 프로필 이미지를 갤러리에 메인으로 추가
                    Integer maxOrder = profileGalleryRepository.findMaxImageOrderByUserId(userId);
                    Integer newOrder = (maxOrder == null || maxOrder == 0) ? 1 : maxOrder + 1;
                    
                    ProfileGallery newGalleryImage = new ProfileGallery(userId, profileImageUrl, newOrder, true);
                    profileGalleryRepository.save(newGalleryImage);
                    
                    log.info("프로필 이미지가 갤러리에도 메인으로 추가되었습니다: {}", profileImageUrl);
                } catch (Exception e) {
                    log.error("프로필 이미지 업로드 실패: {}", e.getMessage());
                    throw new RuntimeException("프로필 이미지 업로드에 실패했습니다.");
                }
            }

            // 2. 프로필 기본 정보 업데이트
            Profile profile = profileRepository.findByUserId(userId).orElse(new Profile());
            boolean isNewProfile = profile.getUserId() == null;
            
            if (isNewProfile) {
                profile.setUserId(userId);
            }
            
            if (request.getNickname() != null) {
                profile.setNickname(request.getNickname());
            }
            if (request.getSelfIntroduction() != null) {
                profile.setSelfIntroduction(request.getSelfIntroduction());
            }
            if (request.getActivityArea() != null) {
                profile.setActivityArea(request.getActivityArea());
            }
            if (profileImageUrl != null) {
                profile.setProfileImageUrl(profileImageUrl);
            }

            Profile savedProfile = profileRepository.save(profile);

            // 3. 갤러리 이미지 삭제 처리
            if (request.getDeleteGalleryImageIds() != null && !request.getDeleteGalleryImageIds().isEmpty()) {
                for (Long imageId : request.getDeleteGalleryImageIds()) {
                    try {
                        ProfileGallery image = profileGalleryRepository.findById(imageId)
                                .orElseThrow(() -> new NoSuchElementException("이미지를 찾을 수 없습니다. ID: " + imageId));
                        
                        if (!image.getUserId().equals(userId)) {
                            throw new RuntimeException("해당 이미지를 삭제할 권한이 없습니다.");
                        }
                        
                        deleteFile(image.getImageUrl());
                        profileGalleryRepository.delete(image);
                        log.info("갤러리 이미지 삭제 완료: {}", imageId);
                    } catch (Exception e) {
                        log.warn("갤러리 이미지 삭제 실패: {}", imageId, e);
                    }
                }
            }

            // 4. 새로운 갤러리 이미지 추가
            if (request.getGalleryImages() != null && !request.getGalleryImages().isEmpty()) {
                // 현재 갤러리 이미지 개수 확인
                long currentCount = profileGalleryRepository.countByUserId(userId);
                boolean isFirstImage = (currentCount == 0); // 첫 번째 이미지인지 확인
                
                for (MultipartFile galleryFile : request.getGalleryImages()) {
                    if (currentCount >= MAX_GALLERY_IMAGES) {
                        log.warn("사용자 {}의 갤러리 이미지 최대 개수 초과", userId);
                        break;
                    }
                    
                    if (galleryFile.isEmpty()) {
                        continue;
                    }
                    
                    try {
                        // 파일 검증
                        if (!galleryFile.getContentType().startsWith("image/")) {
                            log.warn("지원되지 않는 파일 형식: {}", galleryFile.getContentType());
                            continue;
                        }
                        
                        if (galleryFile.getSize() > 5 * 1024 * 1024) {
                            log.warn("파일 크기 초과: {}", galleryFile.getSize());
                            continue;
                        }
                        
                        // 갤러리 이미지 저장
                        String fileName = saveFile(galleryFile, "gallery");
                        String imageUrl = uploadUrl + "/gallery/" + fileName;
                        
                        Integer nextOrder = profileGalleryRepository.findMaxImageOrderByUserId(userId) + 1;
                        
                        // 첫 번째 이미지(순서 1)는 메인으로 설정
                        boolean isMainImage = isFirstImage && (nextOrder == 1);
                        
                        ProfileGallery galleryImage = new ProfileGallery(userId, imageUrl, nextOrder, isMainImage);
                        profileGalleryRepository.save(galleryImage);
                        
                        currentCount++;
                        isFirstImage = false; // 첫 번째 이미지 처리 후 false로 설정
                        
                        log.info("갤러리 이미지 추가 완료: {} (Order: {}, Main: {})", imageUrl, nextOrder, isMainImage);
                    } catch (Exception e) {
                        log.error("갤러리 이미지 업로드 실패", e);
                    }
                }
            }

            // 5. 응답 DTO 생성
            ProfileResponseDto responseDto = new ProfileResponseDto(
                    savedProfile.getUserId(),
                    savedProfile.getNickname(),
                    savedProfile.getSelfIntroduction(),
                    savedProfile.getActivityArea(),
                    savedProfile.getGuestPower(),
                    savedProfile.getParticipationCount(),
                    savedProfile.getProfileImageUrl()
            );

            log.info("사용자 {}의 프로필 및 갤러리가 {}(업데이트)되었습니다.", userId, isNewProfile ? "생성" : "수정");
            return ApiResponse.success(responseDto);
            
        } catch (Exception e) {
            log.error("프로필 및 갤러리 수정 중 오류 발생", e);
            throw new RuntimeException("프로필 수정 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    // ===== 프로필 갤러리 관련 메서드 =====
    
    /**
     * 프로필 갤러리 이미지 업로드
     * 
     * @param userId 사용자 ID
     * @param file 업로드할 이미지 파일
     * @return 업로드된 이미지 정보
     */
    @Transactional
    public ApiResponse<ProfileGalleryDto> uploadGalleryImage(Long userId, MultipartFile file) {
        // 사용자 존재 여부 확인
        userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + userId));
        
        // 최대 개수 체크
        long currentCount = profileGalleryRepository.countByUserId(userId);
        if (currentCount >= MAX_GALLERY_IMAGES) {
            throw new RuntimeException("최대 " + MAX_GALLERY_IMAGES + "장까지만 업로드 가능합니다.");
        }
        
        // 파일 검증
        if (file.isEmpty()) {
            throw new RuntimeException("파일이 비어있습니다.");
        }
        
        if (!file.getContentType().startsWith("image/")) {
            throw new RuntimeException("이미지 파일만 업로드 가능합니다.");
        }
        
        if (file.getSize() > 5 * 1024 * 1024) { // 5MB
            throw new RuntimeException("파일 크기는 5MB 이하여야 합니다.");
        }
        
        try {
            // 파일 저장
            String fileName = saveFile(file, "gallery");
            String imageUrl = uploadUrl + "/gallery/" + fileName;
            
            // 다음 순서 계산
            Integer nextOrder = profileGalleryRepository.findMaxImageOrderByUserId(userId) + 1;
            
            // 첫 번째 이미지(순서 1)는 메인으로 설정
            boolean isMainImage = (nextOrder == 1);
            
            // DB에 저장
            ProfileGallery galleryImage = new ProfileGallery(userId, imageUrl, nextOrder, isMainImage);
            ProfileGallery savedImage = profileGalleryRepository.save(galleryImage);
            
            log.info("사용자 {}의 갤러리 이미지가 업로드되었습니다: {} (Order: {}, Main: {})", userId, imageUrl, nextOrder, isMainImage);
            return ApiResponse.success(new ProfileGalleryDto(savedImage));
            
        } catch (IOException e) {
            log.error("파일 저장 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("파일 저장 중 오류가 발생했습니다.");
        }
    }
    
    /**
     * 프로필 갤러리 이미지 목록 조회
     * 
     * @param userId 사용자 ID
     * @return 갤러리 이미지 목록
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<ProfileGalleryDto>> getGalleryImages(Long userId) {
        log.info("사용자 {}의 갤러리 이미지 조회 시작", userId);
        
        List<ProfileGallery> galleryImages = profileGalleryRepository.findByUserIdOrderByImageOrderAsc(userId);
        log.info("사용자 {}의 갤러리 이미지 {}건 조회", userId, galleryImages.size());
        
        List<ProfileGalleryDto> galleryDtos = galleryImages.stream()
                .map(image -> {
                    ProfileGalleryDto dto = new ProfileGalleryDto(image);
                    log.debug("갤러리 이미지 DTO: ID={}, URL={}, Order={}", dto.getId(), dto.getImageUrl(), dto.getImageOrder());
                    return dto;
                })
                .collect(Collectors.toList());
        
        log.info("사용자 {}의 갤러리 이미지 변환 완료: {}건", userId, galleryDtos.size());
        return ApiResponse.success(galleryDtos);
    }
    
    /**
     * 프로필 갤러리 이미지 삭제
     * 
     * @param userId 사용자 ID
     * @param imageId 삭제할 이미지 ID
     * @return 삭제 결과
     */
    @Transactional
    public ApiResponse<String> deleteGalleryImage(Long userId, Long imageId) {
        // 이미지 존재 여부 및 권한 확인
        ProfileGallery image = profileGalleryRepository.findById(imageId)
                .orElseThrow(() -> new NoSuchElementException("이미지를 찾을 수 없습니다. ID: " + imageId));
        
        if (!image.getUserId().equals(userId)) {
            throw new RuntimeException("해당 이미지를 삭제할 권한이 없습니다.");
        }
        
        // 파일 삭제
        try {
            deleteFile(image.getImageUrl());
        } catch (Exception e) {
            log.warn("파일 삭제 실패: {}", e.getMessage());
        }
        
        // DB에서 삭제
        profileGalleryRepository.delete(image);
        
        log.info("사용자 {}의 갤러리 이미지 {}가 삭제되었습니다.", userId, imageId);
        return ApiResponse.success("이미지가 삭제되었습니다.");
    }
    
    /**
     * 프로필 갤러리 이미지 순서 변경
     * 
     * @param userId 사용자 ID
     * @param imageIds 새로운 순서의 이미지 ID 배열
     * @return 순서 변경 결과
     */
    @Transactional
    public ApiResponse<String> updateGalleryOrder(Long userId, List<Long> imageIds) {
        for (int i = 0; i < imageIds.size(); i++) {
            Long imageId = imageIds.get(i);
            profileGalleryRepository.updateImageOrderByUserIdAndId(userId, imageId, i);
        }
        
        log.info("사용자 {}의 갤러리 이미지 순서가 변경되었습니다.", userId);
        return ApiResponse.success("이미지 순서가 변경되었습니다.");
    }
    
    /**
     * 메인 프로필 이미지 업로드 (파일)
     * 
     * @param userId 사용자 ID
     * @param file 업로드할 이미지 파일
     * @return 업로드된 이미지 정보
     */
    @Transactional
    public ApiResponse<ProfileResponseDto> uploadProfileImage(Long userId, MultipartFile file) {
        // 사용자 존재 여부 확인
        userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + userId));
        
        // 파일 검증
        if (file.isEmpty()) {
            throw new RuntimeException("파일이 비어있습니다.");
        }
        
        if (!file.getContentType().startsWith("image/")) {
            throw new RuntimeException("이미지 파일만 업로드 가능합니다.");
        }
        
        if (file.getSize() > 5 * 1024 * 1024) { // 5MB
            throw new RuntimeException("파일 크기는 5MB 이하여야 합니다.");
        }
        
        try {
            // 파일 저장
            String fileName = saveFile(file, "profile");
            String imageUrl = uploadUrl + "/profile/" + fileName;
            
            // 기존 이미지 파일 삭제 (선택적)
            Profile existingProfile = profileRepository.findByUserId(userId).orElse(null);
            if (existingProfile != null && existingProfile.getProfileImageUrl() != null) {
                try {
                    deleteFile(existingProfile.getProfileImageUrl());
                } catch (Exception e) {
                    log.warn("기존 프로필 이미지 삭제 실패: {}", e.getMessage());
                }
            }
            
            // 프로필 이미지 URL 업데이트
            ApiResponse<ProfileResponseDto> response = updateProfileImage(userId, imageUrl);
            
            log.info("사용자 {}의 프로필 이미지가 업로드되었습니다: {}", userId, imageUrl);
            return response;
            
        } catch (IOException e) {
            log.error("파일 저장 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("파일 저장 중 오류가 발생했습니다.");
        }
    }
    
    /**
     * 파일 저장 헬퍼 메서드
     * 
     * @param file 저장할 파일
     * @param subDir 하위 디렉토리 (profile, gallery)
     * @return 저장된 파일명
     * @throws IOException 파일 저장 실패
     */
    private String saveFile(MultipartFile file, String subDir) throws IOException {
        // 업로드 디렉토리 생성
        Path uploadDir = Paths.get(uploadPath).toAbsolutePath().normalize();
        Path subDirPath = uploadDir.resolve(subDir);
        
        if (!Files.exists(subDirPath)) {
            Files.createDirectories(subDirPath);
            log.info("디렉토리 생성: {}", subDirPath);
        }
        
        // 파일명 생성 (UUID + 원본 확장자)
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String fileName = UUID.randomUUID().toString() + extension;
        
        // 파일 저장
        Path filePath = subDirPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        
        log.info("파일 저장 완료: {}", filePath);
        return fileName;
    }
    
    /**
     * 파일 삭제 헬퍼 메서드
     * 
     * @param fileUrl 삭제할 파일 URL
     */
    private void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith(uploadUrl)) {
            return;
        }
        
        try {
            // URL에서 파일 경로 추출
            String relativePath = fileUrl.substring(uploadUrl.length());
            if (relativePath.startsWith("/")) {
                relativePath = relativePath.substring(1);
            }
            
            Path uploadDir = Paths.get(uploadPath).toAbsolutePath().normalize();
            Path filePath = uploadDir.resolve(relativePath);
            
            boolean deleted = Files.deleteIfExists(filePath);
            if (deleted) {
                log.info("파일 삭제 완료: {}", filePath);
            } else {
                log.warn("삭제할 파일이 존재하지 않음: {}", filePath);
            }
        } catch (IOException e) {
            log.warn("파일 삭제 실패: {}", fileUrl, e);
        }
    }
}
