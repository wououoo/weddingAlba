package wedding.alba.function.postHistory;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import wedding.alba.dto.ApiResponse;
import wedding.alba.function.postHistory.dto.PostHistoryDTO;

@RestController
@RequestMapping("/api/post/history")
@Slf4j
public class PostHistoryController {
    @Autowired
    private PostHistoryService postHistoryService;

    @GetMapping("/detail/{postHistoryId}")
    public ResponseEntity<ApiResponse<PostHistoryDTO>> getPostHistoryDetail (@PathVariable Long postHistoryId) {
        try {
            PostHistoryDTO postHistoryDTO = postHistoryService.getPostHistoryDetail(postHistoryId);
            return ResponseEntity.ok(ApiResponse.success(postHistoryDTO));
        } catch (RuntimeException e) {
            log.error("모집이력 조회 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("모집이력 조회 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

}
