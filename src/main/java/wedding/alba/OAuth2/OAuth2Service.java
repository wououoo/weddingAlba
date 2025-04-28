package wedding.alba.OAuth2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OAuth2Service {

    // 사용자 저장소는 나중에 구현할 예정
    // private final UserRepository userRepository;
    // private final JwtConfig jwtConfig;

    /**
     * OAuth2 제공자별 사용자 정보 객체 생성
     */
    public OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        if (registrationId.equalsIgnoreCase("kakao")) {
            return new KakaoOAuth2UserInfo(attributes);
        } else if (registrationId.equalsIgnoreCase("google")) {
            // return new GoogleOAuth2UserInfo(attributes);
            throw new IllegalArgumentException("Google 로그인은 아직 구현되지 않았습니다.");
        } else if (registrationId.equalsIgnoreCase("apple")) {
            // return new AppleOAuth2UserInfo(attributes);
            throw new IllegalArgumentException("Apple 로그인은 아직 구현되지 않았습니다.");
        } else {
            throw new IllegalArgumentException("지원하지 않는 로그인 제공자입니다: " + registrationId);
        }
    }

    /**
     * OAuth2 로그인 사용자 처리
     * - 사용자가 존재하지 않으면 새로 생성
     * - 존재하면 사용자 정보 업데이트
     */
    @Transactional
    public void processOAuthUser(OAuth2UserInfo oAuth2UserInfo) {
        String providerId = oAuth2UserInfo.getId();
        String provider = oAuth2UserInfo.getProvider();

        log.info("OAuth2 로그인: provider={}, providerId={}, email={}, name={}",
                provider, providerId, oAuth2UserInfo.getEmail(), oAuth2UserInfo.getName());

        // 실제 사용자 저장 로직은 UserRepository가 구현된 후 추가 예정
        // User user = userRepository.findByProviderAndProviderId(provider, providerId)
        //        .orElseGet(() -> createNewUser(oAuth2UserInfo));
        // updateUser(user, oAuth2UserInfo);
        // return user;
    }

    /**
     * JWT 토큰 생성
     */
    /*
    public String createJwtToken(User user) {
        return jwtConfig.generateToken(user.getId().toString());
    }
    */
}