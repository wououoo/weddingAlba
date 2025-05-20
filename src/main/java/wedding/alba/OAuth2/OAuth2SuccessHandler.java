package wedding.alba.OAuth2;

import wedding.alba.function.user.TokenService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.util.UriComponentsBuilder;
import wedding.alba.config.JwtConfig;
import wedding.alba.entity.User;
import wedding.alba.function.user.UserService;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final OAuth2Service oAuth2Service;
    private final UserService userService;
    private final TokenService tokenService;
    private final JwtConfig jwtConfig;

    @Value("${app.oauth2.redirect-uri:http://localhost:3000/oauth2/redirect}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User oAuth2User = oauthToken.getPrincipal();
            String registrationId = oauthToken.getAuthorizedClientRegistrationId();

            try {
                // OAuth2 사용자 정보 추출
                OAuth2UserInfo userInfo = oAuth2Service.getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());

                // 사용자 처리 및 DB 저장
                User user = userService.processOAuthLogin(
                    registrationId,
                    userInfo.getId(),
                    userInfo.getEmail(),
                    userInfo.getName()
                );

                // JWT 토큰 생성
                String token = oAuth2Service.createJwtToken(user);
                
                // 리프레시 토큰 처리 (최적화: 기존 토큰 재사용)
                String refreshToken;
                String existingToken = tokenService.getRefreshToken(user.getUserId());
                
                if (existingToken != null && jwtConfig.validateToken(existingToken)) {
                    // 기존 토큰이 유효하면 재사용 (새 토큰 발급 요청 감소)
                    log.debug("기존 리프레시 토큰 재사용");
                    refreshToken = existingToken;
                } else {
                    // 기존 토큰이 없거나 유효하지 않은 경우에만 새 토큰 발급
                    log.debug("새 리프레시 토큰 발급");
                    refreshToken = oAuth2Service.createRefreshToken(user);
                    tokenService.saveRefreshToken(user.getUserId(), refreshToken);
                }
                
                // 리프레시 토큰을 HTTP-Only 쿠키로 저장
                Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
                refreshTokenCookie.setHttpOnly(true); // JavaScript에서 접근 불가
                refreshTokenCookie.setPath("/");
                refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7일
                
                // 프로덕션 환경에서는 Secure 옵션 활성화 (현재 개발 환경이라면 주석 처리)
                // refreshTokenCookie.setSecure(true);
                
                response.addCookie(refreshTokenCookie);
                
                // 프론트엔드로 리다이렉트 (리프레시 토큰 파라미터 제거)
                String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                        .queryParam("token", token)
                        .queryParam("provider", registrationId)
                        .build().toUriString();

                getRedirectStrategy().sendRedirect(request, response, targetUrl);

            } catch (HttpClientErrorException.TooManyRequests e) {
                // 429 에러 (요청 제한) 처리
                log.error("카카오 API 요청 제한에 걸렸습니다: {}", e.getMessage());
                String failureUrl = UriComponentsBuilder.fromUriString(redirectUri)
                        .queryParam("error", "rate_limit_exceeded")
                        .build().toUriString();
                getRedirectStrategy().sendRedirect(request, response, failureUrl);
            } catch (Exception e) {
                log.error("OAuth2 인증 처리 중 오류 발생", e);
                String failureUrl = UriComponentsBuilder.fromUriString(redirectUri)
                        .queryParam("error", "authentication_error")
                        .build().toUriString();
                getRedirectStrategy().sendRedirect(request, response, failureUrl);
            }
        } else {
            super.onAuthenticationSuccess(request, response, authentication);
        }
    }
}