package wedding.alba.function.posting;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import wedding.alba.config.JwtConfig;
import wedding.alba.dto.ApiResponse;
import wedding.alba.entity.Applying;
import wedding.alba.function.applying.ApplyingService;
import wedding.alba.function.applying.dto.ApplyingStatusDTO;
import wedding.alba.function.bookMark.BookmarkResponseDto;
import wedding.alba.function.bookMark.BookmarkService;
import wedding.alba.function.posting.dto.MyPostingReponseDTO;
import wedding.alba.function.posting.dto.PostingRequestDTO;
import wedding.alba.function.posting.dto.PostingResponseDTO;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/posting")
@Slf4j
public class PostingController {
    @Autowired
    private PostingService postingService;

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private ApplyingService applyingService;

    @Autowired
    private JwtConfig jwtConfig;

    @PostMapping("/")
    public ResponseEntity<ApiResponse<PostingResponseDTO>> createPosting(@RequestBody @Valid PostingRequestDTO postingDto, BindingResult bindingResult) {
        try {
            // 유효성 검사 실패 시 구체적인 오류 메시지 반환
            if (bindingResult.hasErrors()) {
                StringBuilder errorMessage = new StringBuilder();
                bindingResult.getFieldErrors().forEach(error -> {
                    errorMessage.append(error.getDefaultMessage()).append(" ");
                });
                log.warn("모집글 생성 유효성 검사 실패: {}", errorMessage.toString());
                return ResponseEntity.badRequest().body(ApiResponse.error(errorMessage.toString().trim()));
            }

            Long userId = getCurrentUserId();
            postingDto.setUserId(userId);
            PostingResponseDTO responseDTO = postingService.createPosting(postingDto);
            return ResponseEntity.ok(ApiResponse.success(responseDTO));
        } catch(RuntimeException e) {
            log.error("모집글 생성 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch(Exception e) {
            log.error("모집글 생성 중 예외 발생", e);
            return ResponseEntity.ok(ApiResponse.error("모집글 생성에 실패했습니다. 다시 확인해주세요."));
        }
    }

    @PutMapping("/{postingId}")
    public ResponseEntity<ApiResponse<PostingResponseDTO>> updatePosting(@PathVariable Long postingId, @RequestBody @Valid PostingRequestDTO postingDto) {
        try {
            Long userId = getCurrentUserId();
            PostingResponseDTO responseDTO = postingService.updatePosting(userId, postingId, postingDto);
            return ResponseEntity.ok(ApiResponse.success(responseDTO));
        } catch(RuntimeException e) {
            log.error("모집글 수정 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.ok(ApiResponse.error("모집글 수정에 실패했습니다. 다시 확인해주세요."));
        }
    }

    @DeleteMapping("/{postingId}")
    public ResponseEntity<ApiResponse<Void>> deletePosting(@PathVariable Long postingId){
        try {
            Long userId = getCurrentUserId();
            postingService.deletePosting(userId, postingId);
            return ResponseEntity.ok(ApiResponse.success());
        } catch(RuntimeException e) {
            log.error("모집글 삭제 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error("모집글 삭제에 실패했습니다. 다시 확인해주세요."));
        }
    }


    @GetMapping("/page")
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
    @GetMapping("/my/page")
    public ResponseEntity<ApiResponse<Page<MyPostingReponseDTO>>> getPostingListByUserId(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = getCurrentUserId();

        try {
            Page<MyPostingReponseDTO> postingPage = postingService.getMyPostingPage(page, size, userId);
            return ResponseEntity.ok(ApiResponse.success(postingPage));
        } catch (Exception e) {
            log.error("내 모집글 조회 중 예외 발생: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error("모집글 조회에 실패했습니다."));
        }
    }


    @GetMapping("/detail/{postingId}")
    public ResponseEntity<ApiResponse<PostingResponseDTO>> getPostingDetail(@PathVariable Long postingId) {
        Long userId = getCurrentUserId();
        PostingResponseDTO dto = postingService.getPostingDetail(postingId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/check/status/{postingId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkStatusPosting(@PathVariable Long postingId) {
        Long userId = getCurrentUserId();
        Map<String, Object> response = new HashMap<>();
        BookmarkResponseDto bookmark = bookmarkService.findBookmarkByUserAndPosting(userId, postingId);
        ApplyingStatusDTO statusDto = applyingService.checkUserApplying(postingId, userId);
        response.put("isBookmarked", bookmark != null);
        response.put("bookmarkId", bookmark.getBookmarkId());
        response.put("applyingId", statusDto.getApplyingId());
        response.put("isApplied", statusDto.isHasApplied());
        return ResponseEntity.ok(ApiResponse.success(response));
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
