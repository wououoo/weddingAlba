package wedding.alba.service.user;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import wedding.alba.config.JwtConfig;

import java.util.HashMap;
import java.util.Map;

/**
 * 인증 관련 API 컨트롤러
 * 로그인/로그아웃 및 토큰 관리
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final TokenService tokenService;
    private final JwtConfig jwtConfig;
    
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String REFRESH_TOKEN_COOKIE = "refreshToken";
    
    /**
     * 로그아웃 처리
     * 리프레시 토큰을 Redis에서 삭제하고 쿠키에서도 제거
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(
            HttpServletRequest request, 
            HttpServletResponse response) {
        
        String authHeader = request.getHeader(AUTHORIZATION_HEADER);
        String refreshToken = extractRefreshTokenFromCookie(request);
        
        Map<String, Object> responseBody = new HashMap<>();
        
        // 토큰이 없는 경우
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            responseBody.put("success", false);
            responseBody.put("message", "인증 정보가 없습니다.");
            return ResponseEntity.badRequest().body(responseBody);
        }
        
        try {
            // JWT 토큰에서 사용자 ID 추출
            String token = authHeader.substring(7);
            String userIdStr = jwtConfig.extractUserId(token);
            Long userId = Long.parseLong(userIdStr);
            
            // 리프레시 토큰 검증 (선택적)
            if (refreshToken != null && tokenService.validateRefreshToken(userId, refreshToken)) {
                // 리프레시 토큰이 유효한 경우 삭제
                tokenService.deleteRefreshToken(userId);
            } else {
                // 리프레시 토큰이 없거나 유효하지 않더라도 인증 토큰 기반으로 처리
                tokenService.deleteRefreshToken(userId);
            }
            
            // 쿠키에서 리프레시 토큰 제거
            Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE, null);
            cookie.setMaxAge(0);
            cookie.setPath("/");
            response.addCookie(cookie);
            
            responseBody.put("success", true);
            responseBody.put("message", "로그아웃되었습니다.");
            return ResponseEntity.ok(responseBody);
            
        } catch (Exception e) {
            log.error("로그아웃 처리 중 오류 발생", e);
            responseBody.put("success", false);
            responseBody.put("message", "로그아웃 처리 중 오류가 발생했습니다.");
            return ResponseEntity.badRequest().body(responseBody);
        }
    }
    
    /**
     * 토큰 갱신
     * HTTP-Only 쿠키의 리프레시 토큰을 사용하여 새로운 액세스 토큰 발급
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) {
        
        String refreshToken = extractRefreshTokenFromCookie(request);
        
        Map<String, Object> responseBody = new HashMap<>();
        
        // 리프레시 토큰이 없는 경우
        if (refreshToken == null) {
            responseBody.put("success", false);
            responseBody.put("message", "리프레시 토큰이 없습니다.");
            return ResponseEntity.badRequest().body(responseBody);
        }
        
        try {
            // 리프레시 토큰에서 사용자 ID 추출
            String userIdStr = jwtConfig.extractUserId(refreshToken);
            Long userId = Long.parseLong(userIdStr);
            
            // 리프레시 토큰 검증
            if (tokenService.validateRefreshToken(userId, refreshToken)) {
                // 새로운 액세스 토큰 생성
                String newToken = jwtConfig.generateToken(userIdStr);
                
                // 필요시 새 리프레시 토큰도 생성
                String newRefreshToken = jwtConfig.generateRefreshToken(userIdStr);
                tokenService.updateRefreshToken(userId, newRefreshToken);
                
                // 새 리프레시 토큰을 쿠키에 저장
                Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE, newRefreshToken);
                cookie.setHttpOnly(true);
                cookie.setPath("/");
                cookie.setMaxAge(7 * 24 * 60 * 60); // 7일
                // 프로덕션 환경에서는 Secure 옵션 활성화
                // cookie.setSecure(true);
                response.addCookie(cookie);
                
                responseBody.put("success", true);
                responseBody.put("token", newToken);
                return ResponseEntity.ok(responseBody);
            } else {
                responseBody.put("success", false);
                responseBody.put("message", "리프레시 토큰이 유효하지 않습니다.");
                return ResponseEntity.badRequest().body(responseBody);
            }
        } catch (Exception e) {
            log.error("토큰 갱신 중 오류 발생", e);
            responseBody.put("success", false);
            responseBody.put("message", "토큰 갱신 중 오류가 발생했습니다.");
            return ResponseEntity.badRequest().body(responseBody);
        }
    }
    
    /**
     * 쿠키에서 리프레시 토큰 추출
     */
    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (REFRESH_TOKEN_COOKIE.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}