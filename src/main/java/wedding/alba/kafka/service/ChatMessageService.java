package wedding.alba.kafka.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wedding.alba.entity.ChatMessage;
import wedding.alba.entity.ChatRoom;
import wedding.alba.entity.ChatRoomParticipant;
import wedding.alba.repository.ChatMessageRepository;
import wedding.alba.repository.ChatRoomRepository;
import wedding.alba.repository.ChatRoomParticipantRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Set;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomParticipantRepository participantRepository;

    /**
     * 채팅 메시지 저장
     */
    public ChatMessage saveChatMessage(wedding.alba.kafka.dto.ChatMessage kafkaMessage) {
        try {
            log.debug("채팅 메시지 저장: messageId={}, content={}", 
                    kafkaMessage.getMessageId(), kafkaMessage.getContent());
            
            // 타이핑 메시지는 DB에 저장하지 않음
            if (kafkaMessage.getType() == wedding.alba.kafka.dto.ChatMessage.MessageType.TYPING ||
                kafkaMessage.getType() == wedding.alba.kafka.dto.ChatMessage.MessageType.STOP_TYPING) {
                log.debug("타이핑 메시지는 DB에 저장하지 않음: {}", kafkaMessage.getType());
                return null;
            }

            // Kafka DTO를 Entity로 변환
            ChatMessage entity = ChatMessage.builder()
                    .messageId(kafkaMessage.getMessageId())
                    .chatRoomId(kafkaMessage.getChatRoomId())
                    .senderId(kafkaMessage.getSenderId())
                    .senderName(kafkaMessage.getSenderName())
                    .senderProfileImage(kafkaMessage.getSenderProfileImage())
                    .content(kafkaMessage.getContent())
                    .type(convertMessageType(kafkaMessage.getType()))
                    .timestamp(kafkaMessage.getTimestamp())
                    .mentionUserId(kafkaMessage.getMentionUserId())
                    .isSystemMessage(kafkaMessage.getType() == wedding.alba.kafka.dto.ChatMessage.MessageType.JOIN ||
                                   kafkaMessage.getType() == wedding.alba.kafka.dto.ChatMessage.MessageType.LEAVE)
                    .attachmentUrl(kafkaMessage.getAttachmentUrl())
                    .attachmentType(kafkaMessage.getAttachmentType())
                    .build();

            ChatMessage savedMessage = chatMessageRepository.save(entity);
            
            // 채팅방 마지막 메시지 시간 업데이트
            updateChatRoomLastMessage(kafkaMessage.getChatRoomId(), kafkaMessage.getTimestamp());
            
            return savedMessage;
            
        } catch (Exception e) {
            log.error("채팅 메시지 저장 실패: {}", e.getMessage(), e);
            throw new RuntimeException("채팅 메시지 저장에 실패했습니다.", e);
        }
    }

    /**
     * 채팅방 생성 또는 조회 (1:1 채팅)
     */
    public ChatRoom getOrCreatePersonalChatRoom(Long hostUserId, Long guestUserId, Long postingId) {
        try {
            log.debug("1:1 채팅방 조회/생성: host={}, guest={}, posting={}", 
                    hostUserId, guestUserId, postingId);
            
            // 기존 채팅방 조회
            Optional<ChatRoom> existingRoom = chatRoomRepository
                    .findByHostUserIdAndGuestUserIdAndPostingId(hostUserId, guestUserId, postingId);
            
            if (existingRoom.isPresent()) {
                ChatRoom room = existingRoom.get();
                log.debug("기존 채팅방 발견: chatRoomId={}", room.getChatRoomId());
                return room;
            }
            
            // 새 채팅방 생성
            ChatRoom newRoom = ChatRoom.builder()
                    .roomName("결혼식 하객 채팅")
                    .type(ChatRoom.ChatRoomType.PERSONAL)
                    .creatorUserId(hostUserId)
                    .hostUserId(hostUserId)
                    .guestUserId(guestUserId)
                    .postingId(postingId)
                    .maxParticipants(2)
                    .isPublic(false)
                    .build();
            
            ChatRoom savedRoom = chatRoomRepository.save(newRoom);
            
            // 참여자 추가
            addParticipantToChatRoom(savedRoom.getChatRoomId(), hostUserId, ChatRoomParticipant.ParticipantRole.ADMIN);
            addParticipantToChatRoom(savedRoom.getChatRoomId(), guestUserId, ChatRoomParticipant.ParticipantRole.MEMBER);
            
            log.info("새 1:1 채팅방 생성: chatRoomId={}", savedRoom.getChatRoomId());
            return savedRoom;
            
        } catch (Exception e) {
            log.error("채팅방 생성/조회 실패: {}", e.getMessage(), e);
            throw new RuntimeException("채팅방 생성에 실패했습니다.", e);
        }
    }
    
    /**
     * 그룹 채팅방 생성
     */
    public ChatRoom createGroupChatRoom(Long creatorUserId, String roomName, 
                                       List<Long> participantIds, boolean isPublic) {
        try {
            log.debug("그룹 채팅방 생성: creator={}, roomName={}, isPublic={}", 
                    creatorUserId, roomName, isPublic);
            
            ChatRoom newRoom = ChatRoom.builder()
                    .roomName(roomName)
                    .type(ChatRoom.ChatRoomType.GROUP)
                    .creatorUserId(creatorUserId)
                    .maxParticipants(isPublic ? 100 : 20)
                    .isPublic(isPublic)
                    .description("그룹 채팅방")
                    .build();
            
            ChatRoom savedRoom = chatRoomRepository.save(newRoom);
            
            // 생성자를 관리자로 추가
            addParticipantToChatRoom(savedRoom.getChatRoomId(), creatorUserId, ChatRoomParticipant.ParticipantRole.ADMIN);
            
            // 다른 참여자들 추가
            if (participantIds != null) {
                for (Long userId : participantIds) {
                    if (!userId.equals(creatorUserId)) {
                        addParticipantToChatRoom(savedRoom.getChatRoomId(), userId, ChatRoomParticipant.ParticipantRole.MEMBER);
                    }
                }
            }
            
            log.info("새 그룹 채팅방 생성: chatRoomId={}, participantCount={}", 
                    savedRoom.getChatRoomId(), participantIds != null ? participantIds.size() : 1);
            
            return savedRoom;
            
        } catch (Exception e) {
            log.error("그룹 채팅방 생성 실패: {}", e.getMessage(), e);
            throw new RuntimeException("그룹 채팅방 생성에 실패했습니다.", e);
        }
    }
    
    /**
     * 채팅방에 사용자 추가
     */
    public void addUserToChatRoom(Long chatRoomId, Long userId, Long inviterUserId) {
        try {
            // 채팅방 존재 확인
            ChatRoom room = chatRoomRepository.findById(chatRoomId)
                    .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));
            
            // 이미 참여 중인지 확인
            if (participantRepository.existsByChatRoomIdAndUserIdAndIsActiveTrue(chatRoomId, userId)) {
                log.warn("이미 참여 중인 사용자: userId={}, chatRoomId={}", userId, chatRoomId);
                return;
            }
            
            // 권한 확인 (그룹 채팅방의 경우)
            if (room.getType() == ChatRoom.ChatRoomType.GROUP && !room.getIsPublic()) {
                boolean isAuthorized = participantRepository.isUserAdminOrModerator(chatRoomId, inviterUserId);
                if (!isAuthorized) {
                    throw new RuntimeException("그룹 채팅방에 사용자를 초대할 권한이 없습니다.");
                }
            }
            
            // 최대 인원 확인
            if (room.getMaxParticipants() != null) {
                int currentCount = participantRepository.countByChatRoomIdAndIsActiveTrue(chatRoomId);
                if (currentCount >= room.getMaxParticipants()) {
                    throw new RuntimeException("채팅방 최대 인원을 초과했습니다.");
                }
            }
            
            // 참여자 추가
            addParticipantToChatRoom(chatRoomId, userId, ChatRoomParticipant.ParticipantRole.MEMBER);
            
            log.info("사용자 채팅방 초대 완료: userId={}, chatRoomId={}", userId, chatRoomId);
            
        } catch (Exception e) {
            log.error("사용자 초대 실패: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 채팅방 메시지 목록 조회 (페이징)
     */
    @Transactional(readOnly = true)
    public Page<ChatMessage> getChatMessages(Long chatRoomId, int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            return chatMessageRepository.findByChatRoomIdOrderByTimestampDesc(chatRoomId, pageable);
            
        } catch (Exception e) {
            log.error("채팅 메시지 조회 실패: {}", e.getMessage(), e);
            throw new RuntimeException("채팅 메시지를 조회할 수 없습니다.", e);
        }
    }

    /**
     * 특정 시간 이후 메시지 조회
     */
    @Transactional(readOnly = true)
    public List<ChatMessage> getChatMessagesSince(Long chatRoomId, LocalDateTime since) {
        try {
            return chatMessageRepository.findByChatRoomIdAndTimestampAfterAndIsDeletedFalseOrderByTimestampAsc(
                    chatRoomId, since);
        } catch (Exception e) {
            log.error("특정 시간 이후 메시지 조회 실패: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * 사용자의 채팅방 목록 조회
     */
    @Transactional(readOnly = true)
    public List<ChatRoom> getUserChatRooms(Long userId) {
        try {
            return chatRoomRepository.findChatRoomsByUserId(userId);
        } catch (Exception e) {
            log.error("사용자 채팅방 목록 조회 실패: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * 채팅방의 마지막 메시지 조회
     */
    @Transactional(readOnly = true)
    public ChatMessage getLastMessage(Long chatRoomId) {
        try {
            return chatMessageRepository.findLastMessageByChatRoomId(chatRoomId);
        } catch (Exception e) {
            log.error("마지막 메시지 조회 실패: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * 읽지 않은 메시지 수 조회
     */
    @Transactional(readOnly = true)
    public int getUnreadMessageCount(Long chatRoomId, Long userId) {
        try {
            return chatMessageRepository.countUnreadMessages(chatRoomId, userId);
        } catch (Exception e) {
            log.error("읽지 않은 메시지 수 조회 실패: {}", e.getMessage(), e);
            return 0;
        }
    }

    /**
     * 메시지 읽음 처리
     */
    public void markMessagesAsRead(Long chatRoomId, Long userId, String lastMessageId) {
        try {
            Optional<ChatRoomParticipant> participant = participantRepository
                    .findByChatRoomIdAndUserId(chatRoomId, userId);
            
            if (participant.isPresent()) {
                ChatRoomParticipant p = participant.get();
                p.updateLastRead(lastMessageId);
                participantRepository.save(p);
                
                log.debug("메시지 읽음 처리: userId={}, chatRoomId={}, messageId={}", 
                        userId, chatRoomId, lastMessageId);
            }
        } catch (Exception e) {
            log.error("메시지 읽음 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 메시지 검색
     */
    @Transactional(readOnly = true)
    public List<ChatMessage> searchMessages(Long chatRoomId, String keyword) {
        try {
            return chatMessageRepository.searchMessages(chatRoomId, keyword);
        } catch (Exception e) {
            log.error("메시지 검색 실패: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * 채팅방 참여자 추가 (내부 메서드)
     */
    private void addParticipantToChatRoom(Long chatRoomId, Long userId, ChatRoomParticipant.ParticipantRole role) {
        // 기존 참여자 확인 (비활성 상태일 수도 있음)
        Optional<ChatRoomParticipant> existing = participantRepository.findByChatRoomIdAndUserId(chatRoomId, userId);
        
        if (existing.isPresent()) {
            ChatRoomParticipant participant = existing.get();
            if (!participant.getIsActive()) {
                // 비활성 상태였다면 다시 활성화
                participant.setIsActive(true);
                participant.setLeftAt(null);
                participant.setJoinedAt(LocalDateTime.now());
                participantRepository.save(participant);
            }
        } else {
            // 새 참여자 생성
            ChatRoomParticipant newParticipant = ChatRoomParticipant.builder()
                    .chatRoomId(chatRoomId)
                    .userId(userId)
                    .role(role)
                    .build();
            participantRepository.save(newParticipant);
        }
    }

    /**
     * 채팅방 마지막 메시지 시간 업데이트 (내부 메서드)
     */
    private void updateChatRoomLastMessage(Long chatRoomId, LocalDateTime timestamp) {
        try {
            Optional<ChatRoom> roomOpt = chatRoomRepository.findById(chatRoomId);
            if (roomOpt.isPresent()) {
                ChatRoom room = roomOpt.get();
                room.setLastMessageAt(timestamp);
                chatRoomRepository.save(room);
            }
        } catch (Exception e) {
            log.error("채팅방 마지막 메시지 시간 업데이트 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * Kafka 메시지 타입을 Entity 메시지 타입으로 변환
     */
    private ChatMessage.MessageType convertMessageType(wedding.alba.kafka.dto.ChatMessage.MessageType kafkaType) {
        return switch (kafkaType) {
            case CHAT -> ChatMessage.MessageType.CHAT;
            case JOIN -> ChatMessage.MessageType.JOIN;
            case LEAVE -> ChatMessage.MessageType.LEAVE;
            case TYPING -> ChatMessage.MessageType.TYPING;
            case STOP_TYPING -> ChatMessage.MessageType.STOP_TYPING;
            case SYSTEM -> ChatMessage.MessageType.SYSTEM;
            case MENTION -> ChatMessage.MessageType.MENTION;
            case FILE -> ChatMessage.MessageType.FILE;
            case IMAGE -> ChatMessage.MessageType.IMAGE;
        };
    }

    /**
     * 오래된 타이핑 메시지 정리 (스케줄링 작업용)
     */
    @Transactional
    public void cleanupOldTypingMessages() {
        try {
            LocalDateTime threshold = LocalDateTime.now().minusMinutes(5);
            List<ChatMessage> oldMessages = chatMessageRepository.findOldTypingMessages(threshold);
            
            if (!oldMessages.isEmpty()) {
                chatMessageRepository.deleteAll(oldMessages);
                log.info("오래된 타이핑 메시지 정리 완료: {} 건", oldMessages.size());
            }
        } catch (Exception e) {
            log.error("타이핑 메시지 정리 실패: {}", e.getMessage(), e);
        }
    }
}
