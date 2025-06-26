package wedding.alba.function.applying;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import wedding.alba.dto.ApiResponse;

@RestController
@Slf4j
@RequestMapping("/api/applying")
public class ApplyingController {

    @Autowired
    private ApplyingService applyingService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Long>> createApplying(@RequestBody @Valid ApplyingRequestDTO requestDTO, BindingResult bindingResult) {
        try{
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

    @PutMapping("/update/{applyingId}")
    public ResponseEntity<ApiResponse<Long>> updateApplying(@PathVariable Long applyingId, @RequestBody ApplyingRequestDTO requestDTO) {
        try {
            Long userId = getCurrentUserId();
            Long updateApplyingId = applyingService.updateApplying(userId, applyingId, requestDTO);
            return ResponseEntity.ok(ApiResponse.success(updateApplyingId));
        } catch(RuntimeException e) {
            log.error("신청글 수정 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("신청글 수정에 실패했습니다. 다시 확인해주세요."));
        }
    }

    @GetMapping("/check/{postingId}/{userId}")
    public ResponseEntity<ApiResponse<ApplyingStatusDTO>> checkUserApplying(@PathVariable Long postingId, @PathVariable Long userId) {
        try {
            ApplyingStatusDTO statusDto = applyingService.checkUserApplying(userId, postingId);
            return ResponseEntity.ok(ApiResponse.success(statusDto));
        } catch(RuntimeException e) {
            log.error("신청글 조회 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("신청글 조회에 실패했습니다. 다시 확인해주세요."));
        }
    }

    @GetMapping("/detail/{applyingId}")
    public ResponseEntity<ApiResponse<ApplyingResponseDTO>> getApplyingDetail(@PathVariable Long applyingId) {
        try {
            Long userId = getCurrentUserId();
            ApplyingResponseDTO applyingResponseDTO = applyingService.getApplyingDetail(applyingId);
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
