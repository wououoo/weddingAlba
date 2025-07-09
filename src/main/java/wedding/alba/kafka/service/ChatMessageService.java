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
import wedding.alba.entity.User;
import wedding.alba.entity.Profile;
import wedding.alba.kafka.dto.ChatRoomWithUserInfo;
import wedding.alba.repository.ChatMessageRepository;
import wedding.alba.repository.ChatRoomRepository;
import wedding.alba.repository.ChatRoomParticipantRepository;
import wedding.alba.repository.UserRepository;
import wedding.alba.function.profile.ProfileRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    
    // 안읽은 메시지 카운트 서비스 추가
    private final UnreadCountService unreadCountService;

    /**
     * 🚀 채팅 메시지 배치 저장 - 성능 최적화
     */
    @Transactional
    public List<ChatMessage> saveChatMessagesBatch(List<wedding.alba.kafka.dto.ChatMessage> kafkaMessages) {
        if (kafkaMessages == null || kafkaMessages.isEmpty()) {
            return List.of();
        }
        
        try {
            log.debug("채팅 메시지 배치 저장: {} 개", kafkaMessages.size());
            
            // 타이핑 메시지 필터링
            List<wedding.alba.kafka.dto.ChatMessage> validMessages = kafkaMessages.stream()
                    .filter(msg -> msg.getType() != wedding.alba.kafka.dto.ChatMessage.MessageType.TYPING &&
                                  msg.getType() != wedding.alba.kafka.dto.ChatMessage.MessageType.STOP_TYPING)
                    .toList();
            
            if (validMessages.isEmpty()) {
                log.debug("배치에서 저장할 유효한 메시지 없음 (모두 타이핑 메시지)");
                return List.of();
            }
            
            // Kafka DTO를 Entity로 변환
            List<ChatMessage> entities = validMessages.stream()
                    .map(this::convertKafkaMessageToEntity)
                    .toList();
            
            // 배치 저장
            List<ChatMessage> savedMessages = chatMessageRepository.saveAll(entities);
            
            // 채팅방별 마지막 메시지 시간 업데이트
            updateChatRoomsLastMessageBatch(validMessages);
            
            // 안읽은 메시지 카운트 처리 (배치)
            handleUnreadCountForBatch(validMessages);
            
            log.debug("배치 저장 완료: {} 개 메시지", savedMessages.size());
            return savedMessages;
            
        } catch (Exception e) {
            log.error("채팅 메시지 배치 저장 실패: {}", e.getMessage(), e);
            throw new RuntimeException("채팅 메시지 배치 저장에 실패했습니다.", e);
        }
    }

    /**
     * 채팅 메시지 저장 (단일)
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
            ChatMessage entity = convertKafkaMessageToEntity(kafkaMessage);
            ChatMessage savedMessage = chatMessageRepository.save(entity);
            
            // 채팅방 마지막 메시지 시간 업데이트
            updateChatRoomLastMessage(kafkaMessage.getChatRoomId(), kafkaMessage.getTimestamp());
            
            // 안읽은 메시지 카운트 처리 (단일 메시지)
            handleUnreadCountForSingleMessage(kafkaMessage);
            
            return savedMessage;
            
        } catch (Exception e) {
            log.error("채팅 메시지 저장 실패: {}", e.getMessage(), e);
            throw new RuntimeException("채팅 메시지 저장에 실패했습니다.", e);
        }
    }

    /**
     * Kafka 메시지를 Entity로 변환 (내부 메서드)
     */
    private ChatMessage convertKafkaMessageToEntity(wedding.alba.kafka.dto.ChatMessage kafkaMessage) {
        return ChatMessage.builder()
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
    }
    
    /**
     * 여러 채팅방의 마지막 메시지 시간 배치 업데이트 (내부 메서드)
     */
    private void updateChatRoomsLastMessageBatch(List<wedding.alba.kafka.dto.ChatMessage> messages) {
        try {
            // 채팅방별로 가장 최신 메시지 시간 찾기
            Map<Long, LocalDateTime> roomLastTimes = messages.stream()
                    .collect(Collectors.groupingBy(
                            wedding.alba.kafka.dto.ChatMessage::getChatRoomId,
                            Collectors.maxBy(Comparator.comparing(wedding.alba.kafka.dto.ChatMessage::getTimestamp))
                    ))
                    .entrySet().stream()
                    .filter(entry -> entry.getValue().isPresent())
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            entry -> entry.getValue().get().getTimestamp()
                    ));
            
            // 채팅방들 조회 및 업데이트
            List<ChatRoom> rooms = chatRoomRepository.findAllById(roomLastTimes.keySet());
            
            for (ChatRoom room : rooms) {
                LocalDateTime lastTime = roomLastTimes.get(room.getChatRoomId());
                if (lastTime != null && (room.getLastMessageAt() == null || lastTime.isAfter(room.getLastMessageAt()))) {
                    room.setLastMessageAt(lastTime);
                    room.setLastActiveAt(lastTime); // 활동 시간도 동시 업데이트
                }
            }
            
            if (!rooms.isEmpty()) {
                chatRoomRepository.saveAll(rooms);
                log.debug("채팅방 마지막 메시지 시간 배치 업데이트 완료: {} 개 채팅방", rooms.size());
            }
            
        } catch (Exception e) {
            log.error("채팅방 마지막 메시지 시간 배치 업데이트 실패: {}", e.getMessage(), e);
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
            
            // 생성 시간을 활동 시간으로 설정
            newRoom.setLastActiveAt(LocalDateTime.now());
            
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
            
            // 생성 시간을 활동 시간으로 설정
            newRoom.setLastActiveAt(LocalDateTime.now());
            
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
                // 참여 중이어도 활동 시간은 업데이트
                room.setLastActiveAt(LocalDateTime.now());
                chatRoomRepository.save(room);
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
            
            // 채팅방 활동 시간 업데이트
            room.setLastActiveAt(LocalDateTime.now());
            chatRoomRepository.save(room);
            
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
     * 사용자의 채팅방 목록 조회 - LAST_ACTIVE_AT 기준 정렬
     */
    @Transactional(readOnly = true)
    public List<ChatRoom> getUserChatRooms(Long userId) {
        try {
            // 1. 사용자가 참여 중인 채팅방 ID 목록 조회
            List<Long> chatRoomIds = chatRoomRepository.findChatRoomIdsByUserId(userId);
            
            if (chatRoomIds.isEmpty()) {
                return List.of();
            }
            
            // 2. 채팅방 ID들로 채팅방 정보 조회
            List<ChatRoom> chatRooms = chatRoomRepository.findChatRoomsByIds(chatRoomIds);
            
            if (chatRooms.isEmpty()) {
                return List.of();
            }
            
            // 3. LAST_ACTIVE_AT 기준으로 정렬 (서비스 레벨에서 처리)
            chatRooms.sort((a, b) -> {
                LocalDateTime aTime = a.getLastActiveAt() != null ? a.getLastActiveAt() 
                    : (a.getLastMessageAt() != null ? a.getLastMessageAt() : a.getCreatedAt());
                LocalDateTime bTime = b.getLastActiveAt() != null ? b.getLastActiveAt()
                    : (b.getLastMessageAt() != null ? b.getLastMessageAt() : b.getCreatedAt());
                
                // DESC 정렬 (최신 순)
                return bTime.compareTo(aTime);
            });
            
            log.debug("사용자 채팅방 목록 조회 완료: userId={}, count={}", userId, chatRooms.size());
            return chatRooms;
            
        } catch (Exception e) {
            log.error("사용자 채팅방 목록 조회 실패: userId={}, error={}", userId, e.getMessage(), e);
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
            // 안전한 방법으로 읽지 않은 메시지 수 조회
            return chatMessageRepository.countUnreadMessagesSafe(chatRoomId, userId);
        } catch (Exception e) {
            log.error("읽지 않은 메시지 수 조회 실패: {}", e.getMessage(), e);
            return 0;
        }
    }

    /**
     * 메시지 읽음 처리 (안읽은 카운트 업데이트 포함)
     */
    public void markMessagesAsRead(Long chatRoomId, Long userId, String lastMessageId) {
        try {
            Optional<ChatRoomParticipant> participant = participantRepository
                    .findByChatRoomIdAndUserId(chatRoomId, userId);
            
            if (participant.isPresent()) {
                ChatRoomParticipant p = participant.get();
                p.updateLastRead(lastMessageId);
                participantRepository.save(p);
                
                // 안읽은 메시지 카운트 업데이트
                unreadCountService.markChatRoomAsRead(userId, chatRoomId);
                
                // 채팅방 활동 시간도 업데이트
                Optional<ChatRoom> roomOpt = chatRoomRepository.findById(chatRoomId);
                if (roomOpt.isPresent()) {
                    ChatRoom room = roomOpt.get();
                    room.setLastActiveAt(LocalDateTime.now());
                    chatRoomRepository.save(room);
                }
                
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
     * 채팅방 마지막 메시지 시간 및 활동 시간 업데이트 (내부 메서드)
     */
    private void updateChatRoomLastMessage(Long chatRoomId, LocalDateTime timestamp) {
        try {
            Optional<ChatRoom> roomOpt = chatRoomRepository.findById(chatRoomId);
            if (roomOpt.isPresent()) {
                ChatRoom room = roomOpt.get();
                room.setLastMessageAt(timestamp);
                room.setLastActiveAt(timestamp); // 활동 시간도 동시 업데이트
                chatRoomRepository.save(room);
                log.debug("채팅방 활동 시간 업데이트: chatRoomId={}, timestamp={}", chatRoomId, timestamp);
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
    
    /**
     * 채팅방 활동 시간 업데이트 (공개 메서드)
     */
    public void updateChatRoomActivity(Long chatRoomId) {
        try {
            Optional<ChatRoom> roomOpt = chatRoomRepository.findById(chatRoomId);
            if (roomOpt.isPresent()) {
                ChatRoom room = roomOpt.get();
                room.setLastActiveAt(LocalDateTime.now());
                chatRoomRepository.save(room);
                log.debug("채팅방 활동 시간 업데이트: chatRoomId={}", chatRoomId);
            }
        } catch (Exception e) {
            log.error("채팅방 활동 시간 업데이트 실패: {}", e.getMessage(), e);
        }
    }
    
    /**
     * 사용자의 채팅방 목록 조회 - LAST_ACTIVE_AT 기준 정렬 (사용자 정보 포함)
     */
    @Transactional(readOnly = true)
    public List<ChatRoomWithUserInfo> getUserChatRoomsWithUserInfo(Long userId) {
        try {
            // 1. 사용자가 참여 중인 채팅방 ID 목록 조회
            List<Long> chatRoomIds = chatRoomRepository.findChatRoomIdsByUserId(userId);
            
            if (chatRoomIds.isEmpty()) {
                return List.of();
            }
            
            // 2. 채팅방 정보와 사용자 정보를 함께 조회
            List<Object[]> results = chatRoomRepository.findChatRoomsWithUserInfoByIds(chatRoomIds);
            
            if (results.isEmpty()) {
                return List.of();
            }
            
            // 3. Object[] 결과를 ChatRoomWithUserInfo로 변환
            List<ChatRoomWithUserInfo> chatRoomsWithUserInfo = results.stream()
                    .map(this::convertToChatRoomWithUserInfo)
                    .collect(Collectors.toList());
            
            // 4. LAST_ACTIVE_AT 기준으로 정렬
            chatRoomsWithUserInfo.sort((a, b) -> {
                ChatRoom roomA = a.getChatRoom();
                ChatRoom roomB = b.getChatRoom();
                
                LocalDateTime aTime = roomA.getLastActiveAt() != null ? roomA.getLastActiveAt() 
                    : (roomA.getLastMessageAt() != null ? roomA.getLastMessageAt() : roomA.getCreatedAt());
                LocalDateTime bTime = roomB.getLastActiveAt() != null ? roomB.getLastActiveAt()
                    : (roomB.getLastMessageAt() != null ? roomB.getLastMessageAt() : roomB.getCreatedAt());
                
                // DESC 정렬 (최신 순)
                return bTime.compareTo(aTime);
            });
            
            log.debug("사용자 채팅방 목록 조회 완료 (사용자 정보 포함): userId={}, count={}", userId, chatRoomsWithUserInfo.size());
            return chatRoomsWithUserInfo;
            
        } catch (Exception e) {
            log.error("사용자 채팅방 목록 조회 실패 (사용자 정보 포함): userId={}, error={}", userId, e.getMessage(), e);
            return List.of();
        }
    }
    
    /**
     * Object[] 결과를 ChatRoomWithUserInfo로 변환 (네이티브 쿼리용)
     */
    private ChatRoomWithUserInfo convertToChatRoomWithUserInfo(Object[] result) {
        // 네이티브 쿼리 결과를 ChatRoom 엔티티로 변환
        ChatRoom chatRoom = ChatRoom.builder()
                .chatRoomId(((Number) result[0]).longValue())
                .roomName((String) result[1])
                .type(ChatRoom.ChatRoomType.valueOf((String) result[2]))
                .creatorUserId(result[3] != null ? ((Number) result[3]).longValue() : null)
                .hostUserId(result[4] != null ? ((Number) result[4]).longValue() : null)
                .guestUserId(result[5] != null ? ((Number) result[5]).longValue() : null)
                .postingId(result[6] != null ? ((Number) result[6]).longValue() : null)
                .maxParticipants(result[7] != null ? ((Number) result[7]).intValue() : null)
                .isPublic(result[8] != null ? (Boolean) result[8] : false)
                .description((String) result[9])
                .createdAt((java.time.LocalDateTime) result[10])
                .lastMessageAt((java.time.LocalDateTime) result[11])
                .lastActiveAt((java.time.LocalDateTime) result[12])
                .updatedAt((java.time.LocalDateTime) result[13])
                .build();
        
        // 사용자 정보 추출
        String hostName = (String) result[14];
        String hostNickname = (String) result[15];
        String hostProfileImage = (String) result[16];
        String guestName = (String) result[17];
        String guestNickname = (String) result[18];
        String guestProfileImage = (String) result[19];
        
        // 디버깅을 위한 로그 추가
        log.debug("ChatRoom 변환: roomId={}, type={}, hostName={}, hostNickname={}, guestName={}, guestNickname={}", 
                chatRoom.getChatRoomId(), chatRoom.getType(), hostName, hostNickname, guestName, guestNickname);
        
        return ChatRoomWithUserInfo.builder()
                .chatRoom(chatRoom)
                .hostName(hostName)
                .hostNickname(hostNickname)
                .hostProfileImage(hostProfileImage)
                .guestName(guestName)
                .guestNickname(guestNickname)
                .guestProfileImage(guestProfileImage)
                .build();
    }
    
    /**
     * 사용자의 채팅방 목록 조회 - 간단한 방법 (디버깅용)
     */
    @Transactional(readOnly = true)
    public List<ChatRoomWithUserInfo> getUserChatRoomsWithUserInfoSimple(Long userId) {
        try {
            // 1. 기존 방법으로 채팅방 목록 조회
            List<ChatRoom> chatRooms = getUserChatRooms(userId);
            
            if (chatRooms.isEmpty()) {
                return List.of();
            }
            
            // 2. 1:1 채팅방들에서 사용자 ID 수집
            Set<Long> userIds = new HashSet<>();
            for (ChatRoom room : chatRooms) {
                if (room.getType() == ChatRoom.ChatRoomType.PERSONAL) {
                    if (room.getHostUserId() != null) userIds.add(room.getHostUserId());
                    if (room.getGuestUserId() != null) userIds.add(room.getGuestUserId());
                }
            }
            
            // 3. 사용자 정보 및 프로필 정보 조회
            Map<Long, User> userMap = new HashMap<>();
            Map<Long, Profile> profileMap = new HashMap<>();
            
            if (!userIds.isEmpty()) {
                List<User> users = userRepository.findAllById(userIds);
                for (User user : users) {
                    userMap.put(user.getUserId(), user);
                }
                
                for (Long userIdToFind : userIds) {
                    profileRepository.findByUserId(userIdToFind)
                            .ifPresent(profile -> profileMap.put(userIdToFind, profile));
                }
            }
            
            // 4. ChatRoomWithUserInfo로 변환
            List<ChatRoomWithUserInfo> result = new ArrayList<>();
            for (ChatRoom room : chatRooms) {
                String hostName = null, hostNickname = null, hostProfileImage = null;
                String guestName = null, guestNickname = null, guestProfileImage = null;
                
                if (room.getType() == ChatRoom.ChatRoomType.PERSONAL) {
                    // 호스트 정보
                    if (room.getHostUserId() != null) {
                        User hostUser = userMap.get(room.getHostUserId());
                        Profile hostProfile = profileMap.get(room.getHostUserId());
                        if (hostUser != null) {
                            hostName = hostUser.getName();
                        }
                        if (hostProfile != null) {
                            hostNickname = hostProfile.getNickname();
                            hostProfileImage = hostProfile.getProfileImageUrl();
                        }
                    }
                    
                    // 게스트 정보
                    if (room.getGuestUserId() != null) {
                        User guestUser = userMap.get(room.getGuestUserId());
                        Profile guestProfile = profileMap.get(room.getGuestUserId());
                        if (guestUser != null) {
                            guestName = guestUser.getName();
                        }
                        if (guestProfile != null) {
                            guestNickname = guestProfile.getNickname();
                            guestProfileImage = guestProfile.getProfileImageUrl();
                        }
                    }
                }
                
                // 디버깅 로그
                log.info("간단한 방법 ChatRoom 변환: roomId={}, type={}, hostUserId={}, guestUserId={}, hostName={}, hostNickname={}, guestName={}, guestNickname={}", 
                        room.getChatRoomId(), room.getType(), room.getHostUserId(), room.getGuestUserId(), hostName, hostNickname, guestName, guestNickname);
                
                ChatRoomWithUserInfo roomWithUserInfo = ChatRoomWithUserInfo.builder()
                        .chatRoom(room)
                        .hostName(hostName)
                        .hostNickname(hostNickname)
                        .hostProfileImage(hostProfileImage)
                        .guestName(guestName)
                        .guestNickname(guestNickname)
                        .guestProfileImage(guestProfileImage)
                        .build();
                
                result.add(roomWithUserInfo);
            }
            
            log.info("사용자 채팅방 목록 조회 완료 (간단한 방법): userId={}, count={}", userId, result.size());
            return result;
            
        } catch (Exception e) {
            log.error("사용자 채팅방 목록 조회 실패 (간단한 방법): userId={}, error={}", userId, e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * 배치 메시지에 대한 안읽은 카운트 처리
     */
    private void handleUnreadCountForBatch(List<wedding.alba.kafka.dto.ChatMessage> messages) {
        try {
            // 채팅방별로 그룹화하여 처리
            Map<Long, List<wedding.alba.kafka.dto.ChatMessage>> messagesByRoom = messages.stream()
                .collect(Collectors.groupingBy(wedding.alba.kafka.dto.ChatMessage::getChatRoomId));
            
            for (Map.Entry<Long, List<wedding.alba.kafka.dto.ChatMessage>> entry : messagesByRoom.entrySet()) {
                Long chatRoomId = entry.getKey();
                List<wedding.alba.kafka.dto.ChatMessage> roomMessages = entry.getValue();
                
                // 채팅방 참여자 목록 조회
                List<Long> participantIds = participantRepository.findUserIdsByChatRoomId(chatRoomId);
                
                if (participantIds != null && !participantIds.isEmpty()) {
                    // 각 메시지에 대해 안읽은 카운트 업데이트
                    for (wedding.alba.kafka.dto.ChatMessage message : roomMessages) {
                        unreadCountService.handleNewMessage(
                            message.getChatRoomId(),
                            message.getMessageId(),
                            message.getSenderId(),
                            message.getSenderName(),
                            message.getContent() != null ? message.getContent() : "[파일]",
                            participantIds
                        );
                    }
                }
            }
            
            log.debug("배치 메시지 안읽은 카운트 처리 완료: {} 개 메시지", messages.size());
            
        } catch (Exception e) {
            log.error("배치 메시지 안읽은 카운트 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 단일 메시지에 대한 안읽은 카운트 처리
     */
    private void handleUnreadCountForSingleMessage(wedding.alba.kafka.dto.ChatMessage message) {
        try {
            // 채팅방 참여자 목록 조회
            List<Long> participantIds = participantRepository.findUserIdsByChatRoomId(message.getChatRoomId());
            
            if (participantIds != null && !participantIds.isEmpty()) {
                unreadCountService.handleNewMessage(
                    message.getChatRoomId(),
                    message.getMessageId(),
                    message.getSenderId(),
                    message.getSenderName(),
                    message.getContent() != null ? message.getContent() : "[파일]",
                    participantIds
                );
                
                log.debug("단일 메시지 안읽은 카운트 처리 완료: messageId={}", message.getMessageId());
            }
            
        } catch (Exception e) {
            log.error("단일 메시지 안읽은 카운트 처리 실패: messageId={}, error={}", 
                    message.getMessageId(), e.getMessage(), e);
        }
    }
}
