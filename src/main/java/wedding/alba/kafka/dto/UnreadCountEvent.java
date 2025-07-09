package wedding.alba.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 안읽은 메시지 카운트 이벤트 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnreadCountEvent {
    
    // 이벤트 타입
    private EventType eventType;
    
    // 채팅방 ID
    private Long chatRoomId;
    
    // 메시지 관련
    private String messageId;
    private Long senderId;
    private String senderName;
    
    // 수신자 정보
    private Long recipientId;  // 개별 수신자
    
    // 카운트 정보
    private Integer unreadCount;
    private Integer totalUnreadCount;
    
    // 시간 정보
    private LocalDateTime timestamp;
    
    // 추가 메타데이터
    private String content;  // 메시지 내용 (알림용)
    
    public enum EventType {
        MESSAGE_SENT,       // 새 메시지 발송됨
        MESSAGE_READ,       // 메시지 읽음
        ROOM_ENTERED,       // 채팅방 입장 (모든 메시지 읽음 처리)
        COUNT_RESET,        // 카운트 초기화
        COUNT_UPDATE        // 카운트 업데이트 (실시간 전송용)
    }
}