package wedding.alba.OAuth2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import wedding.alba.entity.User;
import wedding.alba.service.user.UserService;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final OAuth2Service oAuth2Service;
    private final UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2User oAuth2User = super.loadUser(userRequest);
        
        // OAuth2 사용자 정보를 우리 애플리케이션에 맞게 처리
        OAuth2UserInfo userInfo = oAuth2Service.getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());
        
        // User 엔티티에 저장
        User user = userService.processOAuthLogin(
            registrationId,
            userInfo.getId(),
            userInfo.getEmail(),
            userInfo.getName()
        );
        
        log.info("OAuth2 로그인 성공: {}", user);
        
        return oAuth2User;
    }
}