package wedding.alba.function.applying;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import wedding.alba.dto.ApiResponse;
import wedding.alba.function.applying.dto.ApplyingRequestDTO;
import wedding.alba.function.applying.dto.ApplyingResponseDTO;
import wedding.alba.function.applying.dto.ApplyingStatusDTO;

@RestController
@Slf4j
@RequestMapping("/api/applying")
public class ApplyingController {

    @Autowired
    private ApplyingService applyingService;

    @PostMapping("")
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
            Long applyingId = applyingService.createApplying(requestDTO);
            return ResponseEntity.ok(ApiResponse.success(applyingId));
        } catch(RuntimeException e) {
            log.error("신청글 생성 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.ok(ApiResponse.error("신청글 생성에 실패했습니다. 다시 확인해주세요."));
        }
    }

    @PutMapping("/{applyingId}")
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

    @GetMapping("/my/page")
    public ResponseEntity<ApiResponse<Page<ApplyingResponseDTO>>> getMyApplyingPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer status) {
        Long userId = getCurrentUserId();
        try {
            Page<ApplyingResponseDTO> applyingResponseDTOPage = applyingService.getMyApplyingList(page,size,status,userId);
            return ResponseEntity.ok(
                    ApiResponse.success(applyingResponseDTOPage)
            );
        } catch(RuntimeException e) {
            log.error("내 신청글 리스트 조회 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.ok(ApiResponse.error("내 신청글 리스트 조회에 실패했습니다. 다시 확인해주세요."));
        }

    }

    @PutMapping("/change/status")
    public ResponseEntity<ApiResponse<Long>> changeStatus(
            @RequestParam Long applyingId,
            @RequestParam Integer status) {
        Long userId = getCurrentUserId();
        try {
            Long updateApplyingId = applyingService.changeStatus(status, applyingId, userId);
            return ResponseEntity.ok(ApiResponse.success(updateApplyingId));
        } catch(RuntimeException e) {
            log.error("신청글 상태 수정 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("신청글 상태 업데이트에 실패했습니다. 다시 확인해주세요."));
        }

    }

    @GetMapping("/check/{postingId}")
    public ResponseEntity<ApiResponse<ApplyingStatusDTO>> checkUserApplying(@PathVariable Long postingId) {
        try {
            // 현재 로그인한 유저를 기준으로 조회
            Long userId = getCurrentUserId();
            ApplyingStatusDTO statusDto = applyingService.checkUserApplying(postingId, userId);
            return ResponseEntity.ok(ApiResponse.success(statusDto));
        } catch(RuntimeException e) {
            log.error("신청글 조회 실패: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
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
