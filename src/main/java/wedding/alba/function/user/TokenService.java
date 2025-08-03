package wedding.alba.function.user;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 토큰을 Redis에 저장하고 관리하는 서비스
 * 해시 형태로 토큰 정보를 저장하여 블랙리스트 처리 등 추가 기능 지원
 */
@Service
public class TokenService {

    private final RedisTemplate<String, Object> redisTemplate;
    
    // Redis에 저장할 때 사용할 키 접두사
    private static final String TOKEN_PREFIX = "token:";
    
    // 리프레시 토큰 만료 시간 (7일)
    private static final long REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 초 단위

    public TokenService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * 사용자의 리프레시 토큰을 Redis에 해시 형태로 저장
     * @param userId 사용자 ID
     * @param refreshToken 리프레시 토큰
     */
    public void saveRefreshToken(Long userId, String refreshToken) {
        String key = TOKEN_PREFIX + userId;
        
        Map<String, Object> tokenData = new HashMap<>();
        tokenData.put("refreshToken", refreshToken);
        tokenData.put("issuedAt", System.currentTimeMillis());
        tokenData.put("blacklisted", false);
        
        redisTemplate.opsForHash().putAll(key, tokenData);
        redisTemplate.expire(key, REFRESH_TOKEN_TTL, TimeUnit.SECONDS);
    }

    /**
     * 사용자의 리프레시 토큰을 Redis에서 조회
     * @param userId 사용자 ID
     * @return 리프레시 토큰 (없으면 null)
     */
    public String getRefreshToken(Long userId) {
        String key = TOKEN_PREFIX + userId;
        Object token = redisTemplate.opsForHash().get(key, "refreshToken");
        return token != null ? token.toString() : null;
    }

    /**
     * 사용자의 토큰 정보 전체를 조회
     * @param userId 사용자 ID
     * @return 토큰 관련 데이터를 담은 맵
     */
    public Map<Object, Object> getTokenInfo(Long userId) {
        String key = TOKEN_PREFIX + userId;
        return redisTemplate.opsForHash().entries(key);
    }

    /**
     * 사용자의 리프레시 토큰을 Redis에서 삭제 (로그아웃 시 사용)
     * @param userId 사용자 ID
     */
    public void deleteRefreshToken(Long userId) {
        String key = TOKEN_PREFIX + userId;
        redisTemplate.delete(key);
    }

    /**
     * 리프레시 토큰을 블랙리스트에 추가 (강제 로그아웃, 토큰 탈취 대응 등)
     * @param userId 사용자 ID
     */
    public void blacklistToken(Long userId) {
        String key = TOKEN_PREFIX + userId;
        redisTemplate.opsForHash().put(key, "blacklisted", true);
        // 블랙리스트된 토큰의 만료 시간 설정 (원래 토큰이 만료될 때까지 유지)
    }

    /**
     * 리프레시 토큰이 유효한지 확인 (토큰 검증 시 사용)
     * @param userId 사용자 ID
     * @param refreshToken 검증할 리프레시 토큰
     * @return 토큰이 유효하면 true, 아니면 false
     */
    public boolean validateRefreshToken(Long userId, String refreshToken) {
        String key = TOKEN_PREFIX + userId;
        
        // 토큰 존재 여부 확인
        Boolean hasKey = redisTemplate.hasKey(key);
        if (hasKey == null || !hasKey) {
            return false;
        }
        
        // 저장된 토큰 값 가져오기
        Object savedToken = redisTemplate.opsForHash().get(key, "refreshToken");
        if (savedToken == null) {
            return false;
        }
        
        // 블랙리스트 여부 확인
        Object blacklisted = redisTemplate.opsForHash().get(key, "blacklisted");
        if (blacklisted != null && Boolean.TRUE.equals(blacklisted)) {
            return false;
        }
        
        // 토큰 값 일치 여부 확인
        return refreshToken.equals(savedToken.toString());
    }
    
    /**
     * 새 리프레시 토큰으로 갱신
     * @param userId 사용자 ID
     * @param newRefreshToken 새 리프레시 토큰
     */
    public void updateRefreshToken(Long userId, String newRefreshToken) {
        String key = TOKEN_PREFIX + userId;
        
        // 기존 데이터 유지하면서 토큰만 갱신
        redisTemplate.opsForHash().put(key, "refreshToken", newRefreshToken);
        redisTemplate.opsForHash().put(key, "issuedAt", System.currentTimeMillis());
        redisTemplate.opsForHash().put(key, "blacklisted", false);
        
        // 만료 시간 다시 설정
        redisTemplate.expire(key, REFRESH_TOKEN_TTL, TimeUnit.SECONDS);
    }
}