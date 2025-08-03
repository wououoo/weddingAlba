package wedding.alba.function.profile;

import lombok.Builder;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 프로필 + 갤러리 통합 수정 요청 DTO
 */
@Getter
@Builder
public class ProfileUpdateWithGalleryRequest {
    private final String nickname;
    private final String selfIntroduction;
    private final String activityArea;
    private final MultipartFile profileImage;
    private final List<MultipartFile> galleryImages;
    private final List<Long> deleteGalleryImageIds;
}
