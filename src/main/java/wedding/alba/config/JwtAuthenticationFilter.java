package wedding.alba.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import wedding.alba.entity.User;
import wedding.alba.repository.UserRepository;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT 인증 필터
 * 요청 헤더에서 JWT 토큰을 추출하고 검증하여 인증 정보를 설정
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtConfig jwtConfig;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            // HTTP 요청에서 JWT 토큰 추출
            String jwt = extractJwtFromRequest(request);
            
            // 토큰이 유효하면 처리
            if (StringUtils.hasText(jwt) && jwtConfig.validateToken(jwt)) {
                // 토큰에서 사용자 ID 추출
                String userIdStr = jwtConfig.extractUserId(jwt);
                Long userId = Long.parseLong(userIdStr);
                
                // 사용자 ID를 사용하여 Spring Security Authentication 객체 생성
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
                
                // SecurityContext에 Authentication 객체 설정
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("JWT 토큰으로 인증 정보 설정 완료. 사용자 ID: {}", userId);
            }
        } catch (Exception e) {
            log.error("JWT 토큰 처리 중 오류 발생", e);
            // 인증 실패 시 SecurityContext를 비움
            SecurityContextHolder.clearContext();
        }
        
        // 다음 필터로 진행
        filterChain.doFilter(request, response);
    }

    /**
     * HTTP 요청에서 JWT 토큰 추출
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
