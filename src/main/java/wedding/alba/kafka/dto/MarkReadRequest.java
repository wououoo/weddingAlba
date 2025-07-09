package wedding.alba.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 메시지 읽음 처리 요청 DTO (토큰 기반)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarkReadRequest {
    private String lastMessageId; // 마지막으로 읽은 메시지 ID
}
