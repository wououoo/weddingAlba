package wedding.alba.kafka.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wedding.alba.dto.ApiResponse;
import wedding.alba.entity.ChatMessage;
import wedding.alba.entity.ChatRoom;
import wedding.alba.kafka.dto.ChatMessageRequest;
import wedding.alba.kafka.dto.ChatRoomCreateRequest;
import wedding.alba.kafka.dto.ChatRoomResponse;
import wedding.alba.kafka.dto.ChatRoomInitResponse;
import wedding.alba.kafka.service.ChatMessageService;
import wedding.alba.kafka.service.ChatProducer;
import wedding.alba.kafka.service.ChatOptimizationService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatRestController {

    private final ChatMessageService chatMessageService;
    private final ChatProducer chatProducer;
    private final ChatOptimizationService chatOptimizationService;

    /**
     * 채팅방 빠른 초기화 API (성능 최적화)
     * 하나의 요청으로 채팅방 정보 + 최근 메시지 + 읽지 않은 수 모두 반환
     */
    @GetMapping("/rooms/{chatRoomId}/init")
    public ResponseEntity<ApiResponse<ChatRoomInitResponse>> initChatRoomFast(
            @PathVariable Long chatRoomId,
            @RequestParam Long userId) {
        
        log.info("🚀 채팅방 빠른 초기화 요청: chatRoomId={}, userId={}", chatRoomId, userId);
        
        try {
            // 최적화된 서비스로 빠른 데이터 로드
            var initData = chatOptimizationService.getChatRoomInitDataFast(chatRoomId, userId);
            
            if (initData.getChatRoom() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<ChatRoomInitResponse>error("채팅방을 찾을 수 없습니다."));
            }
            
            // DTO 변환
            ChatRoomResponse chatRoomDto = convertToResponse(initData.getChatRoom());
            
            List<wedding.alba.kafka.dto.ChatMessage> messageDtos = initData.getRecentMessages().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
            
            ChatRoomInitResponse response = ChatRoomInitResponse.builder()
                .chatRoom(chatRoomDto)
                .recentMessages(messageDtos)
                .unreadCount(initData.getUnreadCount())
                .loadTime(System.currentTimeMillis())
                .serverTime(System.currentTimeMillis())
                .build();
            
            log.info("✅ 채팅방 빠른 초기화 완료: {} 개 메시지, {} 개 읽지 않음", 
                messageDtos.size(), initData.getUnreadCount());
            
            return ResponseEntity.ok(ApiResponse.success("채팅방 초기화 성공", response));
            
        } catch (Exception e) {
            log.error("❌ 채팅방 초기화 실패: chatRoomId={}", chatRoomId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.<ChatRoomInitResponse>error("채팅방 초기화에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 1:1 채팅방 생성/조회
     */
    @PostMapping("/rooms/personal")
    public ResponseEntity<ApiResponse<ChatRoomResponse>> getOrCreatePersonalChatRoom(
            @RequestParam Long hostUserId,
            @RequestParam Long guestUserId,
            @RequestParam Long postingId) {
        try {
            ChatRoom chatRoom = chatMessageService.getOrCreatePersonalChatRoom(hostUserId, guestUserId, postingId);
            ChatRoomResponse response = convertToResponse(chatRoom);
            
            return ResponseEntity.ok(ApiResponse.success("1:1 채팅방 조회/생성 성공", response));
        } catch (Exception e) {
            log.error("1:1 채팅방 생성 실패: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("채팅방 생성에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 그룹 채팅방 생성
     */
    @PostMapping("/rooms/group")
    public ResponseEntity<ApiResponse<ChatRoomResponse>> createGroupChatRoom(
            @RequestBody ChatRoomCreateRequest request) {
        try {
            ChatRoom chatRoom = chatMessageService.createGroupChatRoom(
                    request.getCreatorUserId(),
                    request.getRoomName(),
                    request.getParticipantIds(),
                    request.isPublic()
            );
            
            ChatRoomResponse response = convertToResponse(chatRoom);
            return ResponseEntity.ok(ApiResponse.success("그룹 채팅방 생성 성공", response));
        } catch (Exception e) {
            log.error("그룹 채팅방 생성 실패: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("그룹 채팅방 생성에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 사용자 채팅방 목록 조회
     */
    @GetMapping("/rooms/user/{userId}")
    public ResponseEntity<ApiResponse<List<ChatRoomResponse>>> getUserChatRooms(@PathVariable Long userId) {
        try {
            List<ChatRoom> chatRooms = chatMessageService.getUserChatRooms(userId);
            List<ChatRoomResponse> responses = chatRooms.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success("채팅방 목록 조회 성공", responses));
        } catch (Exception e) {
            log.error("채팅방 목록 조회 실패: userId={}, error={}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("채팅방 목록 조회에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 채팅 메시지 목록 조회 (페이징)
     */
    @GetMapping("/rooms/{chatRoomId}/messages")
    public ResponseEntity<ApiResponse<Page<ChatMessage>>> getChatMessages(
            @PathVariable Long chatRoomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<ChatMessage> messages = chatMessageService.getChatMessages(chatRoomId, page, size);
            return ResponseEntity.ok(ApiResponse.success("채팅 메시지 조회 성공", messages));
        } catch (Exception e) {
            log.error("채팅 메시지 조회 실패: chatRoomId={}, error={}", chatRoomId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("채팅 메시지 조회에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 특정 시간 이후 메시지 조회
     */
    @GetMapping("/rooms/{chatRoomId}/messages/since")
    public ResponseEntity<ApiResponse<List<ChatMessage>>> getChatMessagesSince(
            @PathVariable Long chatRoomId,
            @RequestParam String since) {
        try {
            LocalDateTime sinceTime = LocalDateTime.parse(since);
            List<ChatMessage> messages = chatMessageService.getChatMessagesSince(chatRoomId, sinceTime);
            return ResponseEntity.ok(ApiResponse.success("특정 시간 이후 메시지 조회 성공", messages));
        } catch (Exception e) {
            log.error("특정 시간 이후 메시지 조회 실패: chatRoomId={}, since={}, error={}", 
                    chatRoomId, since, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("메시지 조회에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 채팅 메시지 전송
     */
    @PostMapping("/messages/send")
    public ResponseEntity<ApiResponse<String>> sendChatMessage(@RequestBody ChatMessageRequest request) {
        try {
            // Kafka로 메시지 전송
            chatProducer.sendTextMessage(
                    request.getChatRoomId(),
                    request.getSenderId(),
                    request.getSenderName(),
                    request.getContent()
            ).whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("메시지 전송 실패: {}", ex.getMessage(), ex);
                } else {
                    log.debug("메시지 전송 성공: messageId={}", request.getMessageId());
                }
            });
            
            return ResponseEntity.ok(ApiResponse.success("메시지 전송 성공", "메시지 전송 요청이 처리되었습니다."));
        } catch (Exception e) {
            log.error("채팅 메시지 전송 실패: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("메시지 전송에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 멘션 메시지 전송
     */
    @PostMapping("/messages/mention")
    public ResponseEntity<ApiResponse<String>> sendMentionMessage(@RequestBody ChatMessageRequest request) {
        try {
            chatProducer.sendMentionMessage(
                    request.getChatRoomId(),
                    request.getSenderId(),
                    request.getSenderName(),
                    request.getContent(),
                    request.getMentionUserId()
            );
            
            return ResponseEntity.ok(ApiResponse.success("멘션 메시지 전송 성공", "멘션 메시지 전송 요청이 처리되었습니다."));
        } catch (Exception e) {
            log.error("멘션 메시지 전송 실패: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("멘션 메시지 전송에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 파일 메시지 전송
     */
    @PostMapping("/messages/file")
    public ResponseEntity<ApiResponse<String>> sendFileMessage(@RequestBody ChatMessageRequest request) {
        try {
            chatProducer.sendFileMessage(
                    request.getChatRoomId(),
                    request.getSenderId(),
                    request.getSenderName(),
                    request.getContent(),
                    request.getAttachmentUrl(),
                    request.getAttachmentType()
            );
            
            return ResponseEntity.ok(ApiResponse.success("파일 메시지 전송 성공", "파일 메시지 전송 요청이 처리되었습니다."));
        } catch (Exception e) {
            log.error("파일 메시지 전송 실패: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("파일 메시지 전송에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 채팅방에 사용자 초대
     */
    @PostMapping("/rooms/{chatRoomId}/invite")
    public ResponseEntity<ApiResponse<String>> inviteUserToChatRoom(
            @PathVariable Long chatRoomId,
            @RequestParam Long userId,
            @RequestParam Long inviterUserId) {
        try {
            chatMessageService.addUserToChatRoom(chatRoomId, userId, inviterUserId);
            return ResponseEntity.ok(ApiResponse.success("사용자 초대 성공", "사용자 초대가 완료되었습니다."));
        } catch (Exception e) {
            log.error("사용자 초대 실패: chatRoomId={}, userId={}, error={}", 
                    chatRoomId, userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("사용자 초대에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 읽지 않은 메시지 수 조회
     */
    @GetMapping("/rooms/{chatRoomId}/unread-count")
    public ResponseEntity<ApiResponse<Integer>> getUnreadMessageCount(
            @PathVariable Long chatRoomId,
            @RequestParam Long userId) {
        try {
            int unreadCount = chatMessageService.getUnreadMessageCount(chatRoomId, userId);
            return ResponseEntity.ok(ApiResponse.success("읽지 않은 메시지 수 조회 성공", unreadCount));
        } catch (Exception e) {
            log.error("읽지 않은 메시지 수 조회 실패: chatRoomId={}, userId={}, error={}", 
                    chatRoomId, userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("읽지 않은 메시지 수 조회에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 메시지 읽음 처리
     */
    @PostMapping("/rooms/{chatRoomId}/mark-read")
    public ResponseEntity<ApiResponse<String>> markMessagesAsRead(
            @PathVariable Long chatRoomId,
            @RequestParam Long userId,
            @RequestParam String lastMessageId) {
        try {
            chatMessageService.markMessagesAsRead(chatRoomId, userId, lastMessageId);
            return ResponseEntity.ok(ApiResponse.success("읽음 처리 성공", "메시지 읽음 처리가 완료되었습니다."));
        } catch (Exception e) {
            log.error("메시지 읽음 처리 실패: chatRoomId={}, userId={}, error={}", 
                    chatRoomId, userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("메시지 읽음 처리에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 메시지 검색
     */
    @GetMapping("/rooms/{chatRoomId}/search")
    public ResponseEntity<ApiResponse<List<ChatMessage>>> searchMessages(
            @PathVariable Long chatRoomId,
            @RequestParam String keyword) {
        try {
            List<ChatMessage> messages = chatMessageService.searchMessages(chatRoomId, keyword);
            return ResponseEntity.ok(ApiResponse.success("메시지 검색 성공", messages));
        } catch (Exception e) {
            log.error("메시지 검색 실패: chatRoomId={}, keyword={}, error={}", 
                    chatRoomId, keyword, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("메시지 검색에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 마지막 메시지 조회
     */
    @GetMapping("/rooms/{chatRoomId}/last-message")
    public ResponseEntity<ApiResponse<ChatMessage>> getLastMessage(@PathVariable Long chatRoomId) {
        try {
            ChatMessage lastMessage = chatMessageService.getLastMessage(chatRoomId);
            return ResponseEntity.ok(ApiResponse.success("마지막 메시지 조회 성공", lastMessage));
        } catch (Exception e) {
            log.error("마지막 메시지 조회 실패: chatRoomId={}, error={}", chatRoomId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("마지막 메시지 조회에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * Kafka 서비스 상태 확인
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> checkKafkaHealth() {
        try {
            boolean isHealthy = chatProducer.isKafkaHealthy();
            if (isHealthy) {
                return ResponseEntity.ok(ApiResponse.success("상태 확인 성공", "Kafka 서비스 정상"));
            } else {
                return ResponseEntity.status(503)
                        .body(ApiResponse.error("Kafka 서비스 비정상"));
            }
        } catch (Exception e) {
            log.error("Kafka 상태 확인 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(503)
                    .body(ApiResponse.error("Kafka 상태 확인 실패: " + e.getMessage()));
        }
    }

    /**
     * ChatRoom 엔티티를 Response DTO로 변환
     */
    private ChatRoomResponse convertToResponse(ChatRoom chatRoom) {
        return ChatRoomResponse.builder()
                .chatRoomId(chatRoom.getChatRoomId())
                .roomName(chatRoom.getRoomName())
                .type(chatRoom.getType().toString())
                .creatorUserId(chatRoom.getCreatorUserId())
                .hostUserId(chatRoom.getHostUserId())
                .guestUserId(chatRoom.getGuestUserId())
                .postingId(chatRoom.getPostingId())
                .maxParticipants(chatRoom.getMaxParticipants())
                .isPublic(chatRoom.getIsPublic())
                .description(chatRoom.getDescription())
                .createdAt(chatRoom.getCreatedAt())
                .lastMessageAt(chatRoom.getLastMessageAt())
                .build();
    }

    /**
     * ChatMessage 엔티티를 DTO로 변환
     */
    private wedding.alba.kafka.dto.ChatMessage convertToDto(ChatMessage entity) {
        return wedding.alba.kafka.dto.ChatMessage.builder()
                .messageId(entity.getMessageId())
                .chatRoomId(entity.getChatRoomId())
                .senderId(entity.getSenderId())
                .senderName(entity.getSenderName())
                .senderProfileImage(entity.getSenderProfileImage())
                .content(entity.getContent())
                .type(wedding.alba.kafka.dto.ChatMessage.MessageType.valueOf(entity.getType().name()))
                .timestamp(entity.getTimestamp())
                .mentionUserId(entity.getMentionUserId())
                .isSystemMessage(entity.getIsSystemMessage())
                .attachmentUrl(entity.getAttachmentUrl())
                .attachmentType(entity.getAttachmentType())
                .build();
    }
}
