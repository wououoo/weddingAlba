package wedding.alba.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 채팅방 빠른 초기화 응답 DTO
 * 하나의 API 호출로 필요한 모든 초기 데이터를 제공
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomInitResponse {
    
    // 채팅방 기본 정보
    private ChatRoomResponse chatRoom;
    
    // 최근 메시지들 (기본 20개)
    private List<ChatMessage> recentMessages;
    
    // 읽지 않은 메시지 수
    private int unreadCount;
    
    // 온라인 사용자 수 (현재 접속자)
    private int onlineUserCount;
    
    // 참여자 정보 (간단한 정보만)
    private List<ParticipantInfo> participants;
    
    // 로딩 시간 (성능 측정용)
    private long loadTime;
    
    // 서버 시간 (클라이언트와 동기화용)
    private long serverTime;
    
    /**
     * 간단한 참여자 정보
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantInfo {
        private Long userId;
        private String userName;
        private String profileImage;
        private String role; // ADMIN, MODERATOR, MEMBER
        private boolean isOnline;
        private String lastSeenAt;
    }
}
