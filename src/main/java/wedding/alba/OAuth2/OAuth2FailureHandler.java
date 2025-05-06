package wedding.alba.OAuth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Value("${app.oauth2.redirect-uri:http://localhost:3000/oauth2/redirect}")
    private String redirectUri;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        log.error("OAuth2 인증 실패", exception);

        // 에러 메시지 추출
        String errorMessage = "authentication_failed";
        String errorDescription = "";
        
        // 카카오 API 요청 제한 오류 특별 처리
        if (exception.getMessage() != null && exception.getMessage().contains("token request rate limit exceeded")) {
            errorMessage = "rate_limit_exceeded";
            errorDescription = "카카오 API 요청 제한에 걸렸습니다. 잠시 후 다시 시도해주세요.";
            log.warn("카카오 API 요청 제한에 걸림: {}", exception.getMessage());
            
            // 로그인 화면으로 바로 리다이렉트 (재시도 방지)
            String loginPageUrl = "/login?error=" + errorMessage;
            getRedirectStrategy().sendRedirect(request, response, loginPageUrl);
            return;
        }
        
        // 일반 오류는 기존대로 처리
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("error", errorMessage)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}