package wedding.alba.function.posting;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public ResponseEntity<ApiResponse<PostingResponseDTO>> createPosting(@RequestBody @Valid PostingRequestDTO postingDto) {
        try {
            Long userId = getCurrentUserId();
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

    @PutMapping("/update/{postingId}")
    public ResponseEntity<ApiResponse<PostingResponseDTO>> updatePosting(@PathVariable Long postingId, @RequestBody @Valid PostingRequestDTO postingDto) {
        try {
            Long userId = getCurrentUserId();
            PostingResponseDTO responseDTO = postingService.updatePosting(userId, postingId, postingDto);
            return ResponseEntity.ok(ApiResponse.success(responseDTO));
        } catch(RuntimeException e) {
            log.error("모집글 생성 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.ok(ApiResponse.error("모집글 생성에 실패했습니다. 다시 확인해주세요."));
        }
    }


    @GetMapping("/list/paged")
    public ResponseEntity<ApiResponse<Page<PostingResponseDTO>>> getPostingListPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String address,
            @RequestParam(defaultValue = "") String guestMainRole) {
            Long userId = getCurrentUserId();

        try {
            Page<PostingResponseDTO> postingPage = postingService.getAllPostingList(page, size,address, guestMainRole);
            return ResponseEntity.ok(ApiResponse.success(postingPage));
        } catch (Exception e) {
            log.error("공개 페이징 모집글 조회 중 예외 발생: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error("모집글 조회에 실패했습니다."));
        }
    }

    // 내가작성한 모집글 리스트 (모집글, 모집취소, 모집이력)
//    @GetMapping("/list/paged/userId")
//    public ResponseEntity<ApiResponse<Page<PostingResponseDTO>>> getPostingListByUserId(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//        Long userId = getCurrentUserId();
//
//        try {
//            Page<PostingResponseDTO> postingPage = postingService.getAllPostingList(page, size);
//            return ResponseEntity.ok(ApiResponse.success(postingPage));
//        } catch (Exception e) {
//            log.error("공개 페이징 모집글 조회 중 예외 발생: {}", e.getMessage());
//            return ResponseEntity.ok(ApiResponse.error("모집글 조회에 실패했습니다."));
//        }
//    }


    @GetMapping("/detail/{postingId}")
    public ResponseEntity<ApiResponse<PostingResponseDTO>> getPostingDetail(@PathVariable Long postingId) {
        Long userId = getCurrentUserId();
        PostingResponseDTO dto = postingService.getPostingDetail(postingId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }


    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("인증되지 않은 사용자입니다.");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Long) {
            return (Long) principal;
        }

        throw new IllegalStateException("유효하지 않은 인증 정보입니다.");
    }
}
