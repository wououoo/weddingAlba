package wedding.alba.function.profile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import wedding.alba.repository.ProfileGalleryRepository;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * 파일 테스트 컨트롤러 (디버깅용)
 */
@RestController
@RequestMapping("/api/debug")
public class FileDebugController {

    @Value("${file.upload.path:./uploads}")
    private String uploadPath;
    
    @Autowired
    private ProfileGalleryRepository profileGalleryRepository;

    @GetMapping("/files")
    public ResponseEntity<?> listFiles() {
        try {
            Path uploadDir = Paths.get(uploadPath).toAbsolutePath().normalize();
            File dir = uploadDir.toFile();
            
            if (!dir.exists()) {
                return ResponseEntity.ok("업로드 디렉토리가 존재하지 않습니다: " + uploadDir);
            }
            
            StringBuilder result = new StringBuilder();
            result.append("업로드 디렉토리: ").append(uploadDir).append("\n");
            
            // gallery 폴더 확인
            File galleryDir = new File(dir, "gallery");
            if (galleryDir.exists()) {
                result.append("\n갤러리 파일들:\n");
                File[] files = galleryDir.listFiles();
                if (files != null) {
                    for (File file : files) {
                        result.append("- ").append(file.getName())
                              .append(" (크기: ").append(file.length()).append(" bytes)")
                              .append(" (읽기가능: ").append(file.canRead()).append(")")
                              .append("\n");
                    }
                }
            } else {
                result.append("갤러리 디렉토리가 존재하지 않습니다.\n");
            }
            
            return ResponseEntity.ok(result.toString());
            
        } catch (Exception e) {
            return ResponseEntity.ok("오류: " + e.getMessage());
        }
    }
    
    /**
     * 기존 갤러리 이미지 중 image_order=1인 이미지들을 is_main=true로 업데이트
     */
    @PostMapping("/update-main-images")
    @Transactional
    public ResponseEntity<?> updateMainImages() {
        try {
            int updatedCount = profileGalleryRepository.updateFirstImageAsMain();
            return ResponseEntity.ok("업데이트 완료: " + updatedCount + "건의 이미지가 메인으로 설정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.ok("오류: " + e.getMessage());
        }
    }
    
    @GetMapping("/file-access/{filename}")
    public ResponseEntity<?> testFileAccess(@PathVariable String filename) {
        try {
            Path uploadDir = Paths.get(uploadPath).toAbsolutePath().normalize();
            Path filePath = uploadDir.resolve("gallery").resolve(filename);
            
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .header("Content-Type", "image/jpeg")
                    .body(resource);
            } else {
                return ResponseEntity.ok("파일에 접근할 수 없습니다: " + filePath);
            }
            
        } catch (Exception e) {
            return ResponseEntity.ok("오류: " + e.getMessage());
        }
    }
}
