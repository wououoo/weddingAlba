package wedding.alba.OAuth2;

import jakarta.servlet.ServletException;
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
import org.springframework.web.util.UriComponentsBuilder;
import wedding.alba.entity.User;
import wedding.alba.service.UserService;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final OAuth2Service oAuth2Service;
    private final UserService userService;

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
                
                // 리프레시 토큰 생성
                String refreshToken = oAuth2Service.createRefreshToken(user);
                
                // 리프레시 토큰을 사용자 엔티티에 저장
                user.setRefreshToken(refreshToken);
                userService.updateUserInfo(user.getUserId(), user);

                // 프론트엔드로 리다이렉트
                String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                        .queryParam("token", token)
                        .queryParam("refreshToken", refreshToken)
                        .queryParam("provider", registrationId)
                        .build().toUriString();

                getRedirectStrategy().sendRedirect(request, response, targetUrl);

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