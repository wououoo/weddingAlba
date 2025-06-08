package wedding.alba.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * 웹 설정 클래스 - 정적 리소스 (업로드된 파일) 서빙
 */
@Configuration
public class FileWebConfig implements WebMvcConfigurer {

    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    @Value("${file.upload.url:/uploads}")
    private String uploadUrl;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드 디렉토리가 존재하지 않으면 생성
        createUploadDirectories();
        
        // 업로드된 파일들을 정적 리소스로 서빙
        Path uploadDir = Paths.get(uploadPath).toAbsolutePath().normalize();
        String uploadDirUri = uploadDir.toUri().toString();
        
        registry.addResourceHandler(uploadUrl + "/**")
                .addResourceLocations(uploadDirUri)
                .setCachePeriod(3600) // 1시간 캐시
                .resourceChain(true)
                .addResolver(new org.springframework.web.servlet.resource.PathResourceResolver() {
                    @Override
                    protected org.springframework.core.io.Resource getResource(String resourcePath, org.springframework.core.io.Resource location) throws java.io.IOException {
                        org.springframework.core.io.Resource resource = super.getResource(resourcePath, location);
                        System.out.println("📁 리소스 요청: " + resourcePath + " -> " + (resource != null && resource.exists() ? "존재" : "없음"));
                        return resource;
                    }
                });
    }

    /**
     * 업로드 디렉토리 생성
     */
    private void createUploadDirectories() {
        try {
            // 메인 업로드 디렉토리
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                boolean created = uploadDir.mkdirs();
                System.out.println("📁 업로드 디렉토리 생성: " + uploadDir.getAbsolutePath() + " -> " + created);
            }
            
            // 프로필 이미지 디렉토리
            File profileDir = new File(uploadDir, "profile");
            if (!profileDir.exists()) {
                boolean created = profileDir.mkdirs();
                System.out.println("📁 프로필 디렉토리 생성: " + profileDir.getAbsolutePath() + " -> " + created);
            }
            
            // 갤러리 이미지 디렉토리
            File galleryDir = new File(uploadDir, "gallery");
            if (!galleryDir.exists()) {
                boolean created = galleryDir.mkdirs();
                System.out.println("📁 갤러리 디렉토리 생성: " + galleryDir.getAbsolutePath() + " -> " + created);
            }
            
        } catch (Exception e) {
            System.err.println("❌ 업로드 디렉토리 생성 실패: " + e.getMessage());
        }
    }
}
