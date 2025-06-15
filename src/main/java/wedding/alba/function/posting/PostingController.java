package wedding.alba.function.posting;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wedding.alba.config.JwtConfig;
import wedding.alba.dto.ApiResponse;

@RestController
@RequestMapping("/api/posting")
@Slf4j
public class PostingController {
    @Autowired
    private PostingService postingService;

    @Autowired
    private JwtConfig jwtConfig;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PostingResponseDTO>> createPosting(HttpServletRequest request, @RequestBody @Valid PostingRequestDTO postingDto) {
        try {
            Long userId = extractUserIdFromToken(request);
            postingDto.setUserId(userId);
            PostingResponseDTO responseDTO = postingService.createPosting(postingDto);
            return ResponseEntity.ok(ApiResponse.success(responseDTO));
        } catch(RuntimeException e) {
            log.error("모집글 생성 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.ok(ApiResponse.error("모집글 생성에 실패했습니다. 다시 확인해주세요."));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<PostingResponseDTO>>> getPostingList(HttpServletRequest request) {
        Long userId = extractUserIdFromToken(request);
        List<PostingResponseDTO> postingList = postingService.getPostingAllList();
        return ResponseEntity.ok(ApiResponse.success(postingList));
    }

    @GetMapping("/detail/{postingId}")
    public ResponseEntity<ApiResponse<PostingResponseDTO>> getPostingDetail(@PathVariable Long postingId,  HttpServletRequest request) {
        Long userId = extractUserIdFromToken(request);
        PostingResponseDTO dto = postingService.getPostingDetail(postingId);
        System.out.println(dto);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    
    // 토큰으로부터 사용자 ID값 추출
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
            Long userId = (Long) Long.parseLong(userIdStr);
            log.debug("추출된 사용자 ID: {}", userId);
            return userId;
        } catch (Exception e) {
            log.error("JWT 토큰 파싱 오류: {}", e.getMessage());
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
    }
}
