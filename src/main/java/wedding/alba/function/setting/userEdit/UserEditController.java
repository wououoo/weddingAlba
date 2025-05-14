package wedding.alba.function.setting.userEdit;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import wedding.alba.dto.ApiResponse;

import java.util.NoSuchElementException;

/**
 * 사용자 정보 수정 컨트롤러
 * 사용자 정보 조회 및 수정 API를 제공
 */
@RestController
@RequestMapping("/user/profile")
@Slf4j
public class UserEditController {

    @Autowired
    private UserEditService userEditService;
    
    /**
     * 현재 로그인한 사용자의 정보 조회
     * 
     * @param userId 인증된 사용자 ID
     * @return 사용자 정보 응답
     */
    @GetMapping
    public ResponseEntity<ApiResponse<UserEditResponseDto>> getUserInfo(@AuthenticationPrincipal Long userId) {
        try {
            ApiResponse<UserEditResponseDto> response = userEditService.getUserInfo(userId);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            log.error("사용자 정보 조회 실패", e);
            return ResponseEntity.ok(ApiResponse.error("사용자를 찾을 수 없습니다."));
        }
    }
    
    /**
     * 현재 로그인한 사용자의 정보 수정
     * 
     * @param userId 인증된 사용자 ID
     * @param request 사용자 정보 수정 요청
     * @return 수정된 사용자 정보 응답
     */
    @PutMapping
    public ResponseEntity<ApiResponse<UserEditResponseDto>> updateUserInfo(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody UserEditRequestDto request) {
        try {
            ApiResponse<UserEditResponseDto> response = userEditService.updateUserInfo(userId, request);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            log.error("사용자 정보 수정 실패", e);
            return ResponseEntity.ok(ApiResponse.error("사용자를 찾을 수 없습니다."));
        }
    }
}
