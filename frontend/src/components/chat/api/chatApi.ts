import axios from 'axios';

// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// 채팅 API 인터페이스
export interface ChatMessage {
  messageId: string;
  chatRoomId: number;
  senderId: number;
  senderName: string;
  senderProfileImage?: string;
  content: string;
  messageType: 'CHAT' | 'JOIN' | 'LEAVE' | 'TYPING' | 'STOP_TYPING' | 'SYSTEM' | 'MENTION' | 'FILE' | 'IMAGE';
  timestamp: string;
  mentionUserId?: number;
  attachmentUrl?: string;
  attachmentType?: string;
}

export interface ChatRoom {
  chatRoomId: number;
  roomName: string;
  type: 'PERSONAL' | 'GROUP' | 'PUBLIC';
  creatorUserId: number;
  hostUserId?: number;
  guestUserId?: number;
  postingId?: number;
  maxParticipants?: number;
  isPublic?: boolean;
  description?: string;
  createdAt: string;
  lastMessageAt?: string;
  lastActiveAt?: string;
  participantCount?: number;
  unreadMessageCount?: number;
  lastMessage?: string;
  lastMessageSender?: string;
}

export interface ChatRoomInitResponse {
  chatRoom: ChatRoom;
  recentMessages: ChatMessage[];
  unreadCount: number;
  onlineUserCount?: number;
  participants?: ParticipantInfo[];
  loadTime: number;
  serverTime: number;
}

export interface ParticipantInfo {
  userId: number;
  userName: string;
  profileImage?: string;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  isOnline: boolean;
  lastSeenAt?: string;
}

export interface ChatMessageRequest {
  chatRoomId: number;
  senderId: number;
  senderName: string;
  senderProfileImage?: string;
  content: string;
  messageType?: string;
  mentionUserId?: number;
  attachmentUrl?: string;
  attachmentType?: string;
}

export interface ChatRoomCreateRequest {
  creatorUserId: number;
  roomName: string;
  roomType?: string;
  participantIds?: number[];
  isPublic?: boolean;
  description?: string;
  maxParticipants?: number;
  hostUserId?: number;
  guestUserId?: number;
  postingId?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

class ChatApi {
  /**
   * 1:1 채팅방 생성/조회
   */
  async getOrCreatePersonalChatRoom(hostUserId: number, guestUserId: number, postingId: number): Promise<ChatRoom> {
    const response = await axios.post<ApiResponse<ChatRoom>>(
      `${API_BASE_URL}/chat/rooms/personal`,
      null,
      {
        params: { hostUserId, guestUserId, postingId }
      }
    );
    return response.data.data;
  }

  /**
   * 그룹 채팅방 생성
   */
  async createGroupChatRoom(request: ChatRoomCreateRequest): Promise<ChatRoom> {
    const response = await axios.post<ApiResponse<ChatRoom>>(
      `${API_BASE_URL}/chat/rooms/group`,
      request
    );
    return response.data.data;
  }

  /**
   * 사용자 채팅방 목록 조회
   */
  async getUserChatRooms(userId: number): Promise<ChatRoom[]> {
    const response = await axios.get<ApiResponse<ChatRoom[]>>(
      `${API_BASE_URL}/chat/rooms/user/${userId}`
    );
    return response.data.data;
  }

  /**
   * 채팅 메시지 목록 조회 (페이징)
   */
  async getChatMessages(chatRoomId: number, page: number = 0, size: number = 20): Promise<PageResponse<ChatMessage>> {
    const response = await axios.get<ApiResponse<PageResponse<ChatMessage>>>(
      `${API_BASE_URL}/chat/rooms/${chatRoomId}/messages`,
      {
        params: { page, size }
      }
    );
    return response.data.data;
  }

  /**
   * 특정 시간 이후 메시지 조회
   */
  async getChatMessagesSince(chatRoomId: number, since: string): Promise<ChatMessage[]> {
    const response = await axios.get<ApiResponse<ChatMessage[]>>(
      `${API_BASE_URL}/chat/rooms/${chatRoomId}/messages/since`,
      {
        params: { since }
      }
    );
    return response.data.data;
  }

  /**
   * 채팅 메시지 전송
   */
  async sendChatMessage(request: ChatMessageRequest): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(
      `${API_BASE_URL}/chat/messages/send`,
      request
    );
    return response.data.data;
  }

  /**
   * 멘션 메시지 전송
   */
  async sendMentionMessage(request: ChatMessageRequest): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(
      `${API_BASE_URL}/chat/messages/mention`,
      request
    );
    return response.data.data;
  }

  /**
   * 파일 메시지 전송
   */
  async sendFileMessage(request: ChatMessageRequest): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(
      `${API_BASE_URL}/chat/messages/file`,
      request
    );
    return response.data.data;
  }

  /**
   * 채팅방에 사용자 초대
   */
  async inviteUserToChatRoom(chatRoomId: number, userId: number, inviterUserId: number): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(
      `${API_BASE_URL}/chat/rooms/${chatRoomId}/invite`,
      null,
      {
        params: { userId, inviterUserId }
      }
    );
    return response.data.data;
  }

  /**
   * 읽지 않은 메시지 수 조회
   */
  async getUnreadMessageCount(chatRoomId: number, userId: number): Promise<number> {
    const response = await axios.get<ApiResponse<number>>(
      `${API_BASE_URL}/chat/rooms/${chatRoomId}/unread-count`,
      {
        params: { userId }
      }
    );
    return response.data.data;
  }

  /**
   * 메시지 읽음 처리
   */
  async markMessagesAsRead(chatRoomId: number, userId: number, lastMessageId: string): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(
      `${API_BASE_URL}/chat/rooms/${chatRoomId}/mark-read`,
      null,
      {
        params: { userId, lastMessageId }
      }
    );
    return response.data.data;
  }

  /**
   * 메시지 검색
   */
  async searchMessages(chatRoomId: number, keyword: string): Promise<ChatMessage[]> {
    const response = await axios.get<ApiResponse<ChatMessage[]>>(
      `${API_BASE_URL}/chat/rooms/${chatRoomId}/search`,
      {
        params: { keyword }
      }
    );
    return response.data.data;
  }

  /**
   * 마지막 메시지 조회
   */
  async getLastMessage(chatRoomId: number): Promise<ChatMessage | null> {
    const response = await axios.get<ApiResponse<ChatMessage>>(
      `${API_BASE_URL}/chat/rooms/${chatRoomId}/last-message`
    );
    return response.data.data;
  }

  /**
   * 채팅방 빠른 초기화 API (성능 최적화)
   * 하나의 요청으로 채팅방 정보 + 최근 메시지 + 읽지 않은 수 모두 반환
   */
  async initChatRoomFast(chatRoomId: number, userId: number): Promise<ChatRoomInitResponse> {
    console.log(`🚀 채팅방 빠른 초기화 요청: chatRoomId=${chatRoomId}, userId=${userId}`);
    
    const startTime = performance.now();
    
    try {
      const response = await axios.get<ApiResponse<ChatRoomInitResponse>>(
        `${API_BASE_URL}/chat/rooms/${chatRoomId}/init`,
        {
          params: { userId }
        }
      );
      
      const endTime = performance.now();
      console.log(`✅ 채팅방 초기화 완료: ${(endTime - startTime).toFixed(2)}ms`);
      
      return response.data.data;
    } catch (error) {
      const endTime = performance.now();
      console.error(`❌ 채팅방 초기화 실패: ${(endTime - startTime).toFixed(2)}ms`, error);
      throw new Error('채팅방 초기화에 실패했습니다.');
    }
  }

  /**
   * Kafka 서비스 상태 확인
   */
  async checkKafkaHealth(): Promise<string> {
    const response = await axios.get<ApiResponse<string>>(
      `${API_BASE_URL}/chat/health`
    );
    return response.data.data;
  }
}

export const chatApi = new ChatApi();
