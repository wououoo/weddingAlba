package wedding.alba.function.applying;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import wedding.alba.dto.ApiResponse;

@RestController
@Slf4j
@RequestMapping("/api/applying")
public class ApplyingController {

    @Autowired
    private ApplyingService applyingService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Long>> createApplying(@RequestBody @Valid ApplyingRequestDTO requestDTO) {
        try{
            Long userId = getCurrentUserId();
            requestDTO.setUserId(userId);
            Long applyId = applyingService.createApplying(requestDTO);
            return ResponseEntity.ok(ApiResponse.success(applyId));
        } catch(RuntimeException e) {
            log.error("신청글 생성 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.ok(ApiResponse.error("신청글 생성에 실패했습니다. 다시 확인해주세요."));
        }
    }

    @GetMapping("/detail/{applyId}")
    public ResponseEntity<ApiResponse<ApplyingResponseDTO>> getApplyingDetail(@PathVariable Long applyId) {
        try {
            Long userId = getCurrentUserId();
            ApplyingResponseDTO applyingResponseDTO = applyingService.getApplyingDetail(applyId);
            log.info(applyingResponseDTO.toString());
            return ResponseEntity.ok(ApiResponse.success(applyingResponseDTO));
        } catch(RuntimeException e) {
            log.error("신청글 조회 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.ok(ApiResponse.error("신청글 조회에 실패했습니다. 다시 확인해주세요."));
        }
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
