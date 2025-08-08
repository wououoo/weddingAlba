package wedding.alba.function.bookMark;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import wedding.alba.dto.ApiResponse;

import java.util.HashMap;
import java.util.Map;

/**
 * 북마크 관련 REST API 컨트롤러
 *
 * 사용자의 북마크 목록 조회, 추가, 삭제, 수정 기능을 제공합니다.
 * JWT 토큰을 통한 인증이 필요하며, SecurityContext에서 사용자 정보를 추출합니다.
 */
@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    /**
     * 사용자의 북마크 목록 조회 (페이징)
     *
     * @param page 페이지 번호 (1부터 시작, 기본값: 1)
     * @param limit 페이지당 항목 수 (기본값: 10)
     * @return 북마크 목록과 페이징 정보
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getBookmarkList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {

        // SecurityContext에서 현재 인증된 사용자 ID 추출
        Long userId = getCurrentUserId();

        // 페이지는 0부터 시작하므로 -1, 최신 북마크순으로 정렬
        Pageable pageable = PageRequest.of(page - 1, limit,
                Sort.by(Sort.Direction.DESC, "marcDate"));

        Page<BookmarkResponseDto> bookmarkPage = bookmarkService.getBookmarksByUserId(userId, pageable);

        // 응답 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("data", bookmarkPage.getContent());
        response.put("currentPage", page);
        response.put("totalCount", bookmarkPage.getTotalElements());
        response.put("totalPages", bookmarkPage.getTotalPages());
        response.put("hasMore", page < bookmarkPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    /**
     * 새로운 북마크 추가
     *
     * @param requestDto 북마크 추가 요청 데이터 (게시글 ID, 메모)
     * @return 생성된 북마크 정보
     */
    @PostMapping
    public ResponseEntity<ApiResponse<BookmarkResponseDto>> addBookmark(@RequestBody BookmarkRequestDto requestDto) {

        Long userId = getCurrentUserId();

        BookmarkResponseDto savedBookmark = bookmarkService.addBookmark(userId, requestDto);

        return ResponseEntity.ok(ApiResponse.success(savedBookmark));
    }

    /**
     * 북마크 삭제
     *
     * @param bookmarkId 삭제할 북마크 ID
     * @return 성공 응답
     */
    @DeleteMapping("/{bookmarkId}")
    public ResponseEntity<ApiResponse<Void>> deleteBookmark(@PathVariable Long bookmarkId) {

        Long userId = getCurrentUserId();

        bookmarkService.deleteBookmark(bookmarkId, userId);

        return ResponseEntity.ok(ApiResponse.success());
    }

    /**
     * 북마크 메모 수정
     *
     * @param bookmarkId 수정할 북마크 ID
     * @param request 수정할 메모 내용
     * @return 수정된 북마크 정보
     */
    @PutMapping("/{bookmarkId}/memo")
    public ResponseEntity<BookmarkResponseDto> updateBookmarkMemo(
            @PathVariable Long bookmarkId,
            @RequestBody Map<String, String> request) {

        Long userId = getCurrentUserId();
        String memo = request.get("memo");

        BookmarkResponseDto updatedBookmark = bookmarkService.updateMemo(bookmarkId, userId, memo);

        return ResponseEntity.ok(updatedBookmark);
    }

    /**
     * 북마크 메모 삭제 (메모를 null로 설정)
     *
     * @param bookmarkId 메모를 삭제할 북마크 ID
     * @return 수정된 북마크 정보
     */
    @DeleteMapping("/{bookmarkId}/memo")
    public ResponseEntity<BookmarkResponseDto> deleteBookmarkMemo(@PathVariable Long bookmarkId) {

        Long userId = getCurrentUserId();

        // 메모를 null로 설정하여 삭제
        BookmarkResponseDto updatedBookmark = bookmarkService.updateMemo(bookmarkId, userId, null);

        return ResponseEntity.ok(updatedBookmark);
    }

    /**
     * 특정 게시글의 북마크 여부 확인
     *
     * @param postingId 확인할 게시글 ID
     * @return 북마크 여부와 북마크 정보 (있는 경우)
     */
    @GetMapping("/check/{postingId}")
    public ResponseEntity<Map<String, Object>> checkBookmarkStatus(@PathVariable Long postingId) {

        Long userId = getCurrentUserId();

        BookmarkResponseDto bookmark = bookmarkService.findBookmarkByUserAndPosting(userId, postingId);

        Map<String, Object> response = new HashMap<>();
        response.put("isBookmarked", bookmark != null);
        response.put("bookmark", bookmark);

        return ResponseEntity.ok(response);
    }

    /**
     * 삭제된 게시글의 북마크 목록 조회
     *
     * @param page 페이지 번호 (1부터 시작, 기본값: 1)
     * @param limit 페이지당 항목 수 (기본값: 10)
     * @return 삭제된 게시글의 북마크 목록
     */
    @GetMapping("/deleted-postings")
    public ResponseEntity<Map<String, Object>> getBookmarksWithDeletedPostings(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {

        Long userId = getCurrentUserId();

        // 페이지는 0부터 시작하므로 -1, 최신 북마크순으로 정렬
        Pageable pageable = PageRequest.of(page - 1, limit,
                Sort.by(Sort.Direction.DESC, "marcDate"));

        Page<BookmarkResponseDto> bookmarkPage = bookmarkService.getBookmarksWithDeletedPostings(userId, pageable);

        // 응답 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("data", bookmarkPage.getContent());
        response.put("currentPage", page);
        response.put("totalCount", bookmarkPage.getTotalElements());
        response.put("totalPages", bookmarkPage.getTotalPages());
        response.put("hasMore", page < bookmarkPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    /**
     * SecurityContext에서 현재 인증된 사용자 ID 추출
     *
     * @return 현재 로그인한 사용자의 ID
     * @throws IllegalStateException 인증되지 않은 사용자이거나 유효하지 않은 인증 정보인 경우
     */
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