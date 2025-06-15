package wedding.alba.function.profile;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequestDTO {
    private String nickname;

    private String selfIntroduction;

    private String activityArea;

    private String profileImageUrl;
    
    // 갤러리 이미지 관련 필드
    private List<Long> deleteGalleryImageIds; // 삭제할 갤러리 이미지 ID 목록
    private List<String> newGalleryImages; // 새로 추가할 갤러리 이미지 URL 목록 (Base64 또는 임시 URL)
}
