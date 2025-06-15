package wedding.alba.function.profile;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/location")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"})
public class LocationController {

    @Value("${naver.map.client-id}")
    private String naverClientId;

    @Value("${naver.map.client-secret}")
    private String naverClientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    // 네이버 지도 설정 정보 제공 API
    @GetMapping("/config")
    public ResponseEntity<?> getMapConfig() {
        try {
            Map<String, Object> config = new HashMap<>();
            config.put("clientId", naverClientId);
            config.put("mapApiUrl", "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=" + naverClientId);
            config.put("defaultCenter", Map.of("lat", 37.5666805, "lng", 126.9784147)); // 서울 시청
            
            return ResponseEntity.ok(config);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "지도 설정 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    // 주소 검색 API (지오코딩)
    @PostMapping("/search")
    public ResponseEntity<?> searchLocation(@RequestBody LocationSearchRequest request) {
        try {
            String url = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=" + request.getQuery();
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-NCP-APIGW-API-KEY-ID", naverClientId);
            headers.set("X-NCP-APIGW-API-KEY", naverClientSecret);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, String.class
            );
            
            return ResponseEntity.ok(response.getBody());
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "주소 검색 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    // 역지오코딩 API (좌표 → 주소)
    @PostMapping("/reverse")
    public ResponseEntity<?> reverseGeocode(@RequestBody ReverseGeocodeRequest request) {
        try {
            String url = "https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc";
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-NCP-APIGW-API-KEY-ID", naverClientId);
            headers.set("X-NCP-APIGW-API-KEY", naverClientSecret);
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            String requestUrl = url + "?coords=" + request.getLng() + "," + request.getLat() + 
                               "&output=json&orders=roadaddr,jibun";
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                requestUrl, HttpMethod.GET, entity, String.class
            );
            
            return ResponseEntity.ok(response.getBody());
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "역지오코딩 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    // 요청 DTO 클래스들
    public static class LocationSearchRequest {
        private String query;
        
        public String getQuery() {
            return query;
        }
        
        public void setQuery(String query) {
            this.query = query;
        }
    }

    public static class ReverseGeocodeRequest {
        private double lat;
        private double lng;
        
        public double getLat() {
            return lat;
        }
        
        public void setLat(double lat) {
            this.lat = lat;
        }
        
        public double getLng() {
            return lng;
        }
        
        public void setLng(double lng) {
            this.lng = lng;
        }
    }
}
