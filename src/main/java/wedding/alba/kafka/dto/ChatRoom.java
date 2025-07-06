package wedding.alba.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {
    
    private Long chatRoomId;           // 채팅방 ID
    private String roomName;           // 채팅방 이름
    private ChatRoomType type;         // 채팅방 타입
    private Long creatorUserId;        // 채팅방 생성자 ID
    
    // 1:1 채팅용 필드
    private Long hostUserId;           // 호스트(모집자) ID
    private Long guestUserId;          // 게스트(신청자) ID
    private Long postingId;            // 관련 모집글 ID
    
    // 모든 채팅방 공통 필드
    @Builder.Default
    private Set<Long> participants = new HashSet<>();    // 참여자 ID 목록
    @Builder.Default
    private Set<Long> admins = new HashSet<>();          // 관리자 ID 목록 (단체채팅용)
    
    private Integer maxParticipants;   // 최대 참여자 수 (단체채팅용)
    private boolean isPublic;          // 공개 채팅방 여부
    private String description;        // 채팅방 설명
    
    private LocalDateTime createdAt;   // 생성 시간
    private LocalDateTime lastMessageAt; // 마지막 메시지 시간
    private LocalDateTime lastActiveAt;   // 마지막 활동 시간
    
    public enum ChatRoomType {
        PERSONAL,      // 1:1 채팅 (호스트-게스트)
        GROUP,         // 소규모 그룹 채팅 (3~20명)
        PUBLIC         // 대규모 공개 채팅 (20명+)
    }
    
    // 편의 메서드들
    
    /**
     * 참여자 추가
     */
    public void addParticipant(Long userId) {
        if (participants == null) {
            participants = new HashSet<>();
        }
        participants.add(userId);
    }
    
    /**
     * 참여자 제거
     */
    public void removeParticipant(Long userId) {
        if (participants != null) {
            participants.remove(userId);
        }
    }
    
    /**
     * 관리자 추가
     */
    public void addAdmin(Long userId) {
        if (admins == null) {
            admins = new HashSet<>();
        }
        admins.add(userId);
        addParticipant(userId); // 관리자도 참여자에 포함
    }
    
    /**
     * 사용자가 참여자인지 확인
     */
    public boolean isParticipant(Long userId) {
        return participants != null && participants.contains(userId);
    }
    
    /**
     * 사용자가 관리자인지 확인
     */
    public boolean isAdmin(Long userId) {
        return admins != null && admins.contains(userId);
    }
    
    /**
     * 현재 참여자 수
     */
    public int getParticipantCount() {
        return participants != null ? participants.size() : 0;
    }
}
