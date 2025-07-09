package wedding.alba.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * 사용자별 안읽은 메시지 카운트 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnreadCountResponse {
    
    // 사용자 ID
    private Long userId;
    
    // 채팅방별 안읽은 메시지 개수
    // Key: chatRoomId, Value: unreadCount
    private Map<Long, Integer> chatRoomUnreadCounts;
    
    // 전체 안읽은 메시지 개수
    private Integer totalUnreadCount;
    
    // 마지막 업데이트 시간
    private String lastUpdated;
}