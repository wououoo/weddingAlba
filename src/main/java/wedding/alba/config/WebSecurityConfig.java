package wedding.alba.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;
import wedding.alba.OAuth2.CustomOAuth2UserService;
import wedding.alba.OAuth2.OAuth2FailureHandler;
import wedding.alba.OAuth2.OAuth2SuccessHandler;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final CorsFilter corsFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 비활성화 (REST API이므로)
                .csrf(csrf -> csrf.disable())

                // CORS 설정
                .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
                
                // JWT 인증 필터 추가
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // 세션 관리 (JWT를 사용하므로 세션은 STATELESS로 설정)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 요청 경로별 인증 설정
                .authorizeHttpRequests(auth -> auth
                        // 공개 리소스
                        .requestMatchers("/api/auth/**", "/oauth2/**", "/login/**").permitAll()
                        // 채팅 API (임시로 인증 제외 - 개발용)
                        .requestMatchers("/api/chat/**").permitAll()
                        // WebSocket 연결 허용
                        .requestMatchers("/ws/**").permitAll()
                        // Kafka 테스트 경로 인증 제외
                        .requestMatchers("/api/kafka/**").permitAll()
                        // 업로드된 파일들 (정적 리소스) 접근 허용
                        .requestMatchers("/uploads/**").permitAll()
                        // Swagger UI 등의 개발 도구 접근 허용
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // 나머지 모든 요청은 인증 필요
                        .anyRequest().authenticated())
                
                // OAuth2 로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(endpoint -> endpoint
                                .baseUri("/oauth2/authorization"))
                        .redirectionEndpoint(endpoint -> endpoint
                                .baseUri("/login/oauth2/code/*"))
                        .userInfoEndpoint(endpoint -> endpoint
                                .userService(customOAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                        .failureHandler(oAuth2FailureHandler));

        return http.build();
    }
}