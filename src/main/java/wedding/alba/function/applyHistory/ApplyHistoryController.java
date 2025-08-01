package wedding.alba.function.applyHistory;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import wedding.alba.dto.ApiResponse;
import wedding.alba.function.applyHistory.dto.ApplyHistoryDTO;

@RestController
@RequestMapping("/api/apply/history")
@Slf4j
public class ApplyHistoryController {
    @Autowired
    private ApplyHistoryService applyHistoryService;

    @GetMapping("/detail/{applyHistoryId}")
    public ResponseEntity<ApiResponse<ApplyHistoryDTO>> getApplyHistoryDetail (@PathVariable Long applyHistoryId) {
        try {
            ApplyHistoryDTO applyHistoryDTO = applyHistoryService.getApplyHistoryDetail(applyHistoryId);
            return ResponseEntity.ok(ApiResponse.success(applyHistoryDTO));
        } catch (RuntimeException e) {
            log.error("신청글 이력 조회 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("신청글 이력 조회 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error("신청이력 조회에 실패했습니다. 다시 확인해주세요."));

        }
    }
}
