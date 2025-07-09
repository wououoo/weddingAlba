import axios from 'axios';
import { httpClient } from '../../../utils/httpClient'; // httpClient import 추가

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
  // 1:1 채팅방 사용자 정보 (새로 추가)
  hostName?: string;
  hostNickname?: string;
  hostProfileImage?: string;
  guestName?: string;
  guestNickname?: string;
  guestProfileImage?: string;
  maxParticipants?: number;
  isPublic?: boolean;
  description?: string;
  createdAt: string;
  lastMessageAt?: string;
  lastActiveAt?: string; // 이미 있음 - 이 필드로 정렬
  participantCount?: number;
  unreadMessageCount?: number;
  lastMessage?: string;
  lastMessageSender?: string;
}

export interface ChatRoomInitResponse {
  chatRoom: ChatRoom;
  recentMessages: ChatMessage[];
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
   * 1:1 채팅방 생성/조회 (토큰 기반)
   */
  async getOrCreatePersonalChatRoom(guestUserId: number, postingId: number): Promise<ChatRoom> {
    const response = await httpClient.post<ChatRoom>(
      '/chat/rooms/personal',
      { guestUserId, postingId }
    );
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '1:1 채팅방 생성에 실패했습니다.');
  }

  /**
   * 그룹 채팅방 생성 (토큰 기반)
   */
  async createGroupChatRoom(request: Omit<ChatRoomCreateRequest, 'creatorUserId'>): Promise<ChatRoom> {
    const response = await httpClient.post<ChatRoom>(
      '/chat/rooms/group',
      request
    );
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '그룹 채팅방 생성에 실패했습니다.');
  }

  /**
   * 내 채팅방 목록 조회 (JWT 토큰 기반)
   */
  async getMyChatRooms(): Promise<ChatRoom[]> {
    try {
      const response = await httpClient.get<ChatRoom[]>('/chat/rooms/my');
      
      if (!response.success) {
        throw new Error(response.message || '채팅방 목록 조회에 실패했습니다.');
      }
      
      // 날짜 필드 안전 처리 - lastActiveAt 포함
      const chatRooms = (response.data || []).map(room => {
        console.log('API 응답 채팅방 데이터:', {
          chatRoomId: room.chatRoomId,
          roomName: room.roomName,
          type: room.type,
          hostName: room.hostName,
          hostNickname: room.hostNickname,
          guestName: room.guestName,
          guestNickname: room.guestNickname
        });
        
        return {
          ...room,
          createdAt: room.createdAt || new Date().toISOString(),
          lastMessageAt: room.lastMessageAt || room.createdAt || new Date().toISOString(),
          lastActiveAt: room.lastActiveAt || room.lastMessageAt || room.createdAt || new Date().toISOString()
        };
      });
      
      return chatRooms;
    } catch (error) {
      console.error('getMyChatRooms API 오류:', error);
      throw new Error('채팅방 목록을 불러올 수 없습니다.');
    }
  }

  /**
   * 채팅 메시지 목록 조회 (페이징) (토큰 기반)
   */
  async getChatMessages(chatRoomId: number, page: number = 0, size: number = 20): Promise<PageResponse<ChatMessage>> {
    const response = await httpClient.get<PageResponse<ChatMessage>>(
      `/chat/rooms/${chatRoomId}/messages?page=${page}&size=${size}`
    );
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '채팅 메시지 조회에 실패했습니다.');
  }

  /**
   * 특정 시간 이후 메시지 조회 (토큰 기반)
   */
  async getChatMessagesSince(chatRoomId: number, since: string): Promise<ChatMessage[]> {
    const response = await httpClient.get<ChatMessage[]>(
      `/chat/rooms/${chatRoomId}/messages/since?since=${encodeURIComponent(since)}`
    );
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '메시지 조회에 실패했습니다.');
  }

  /**
   * 채팅 메시지 전송 (토큰 기반)
   */
  async sendChatMessage(request: Omit<ChatMessageRequest, 'senderId' | 'senderName' | 'senderProfileImage'>): Promise<string> {
    const response = await httpClient.post<string>(
      '/chat/messages/send',
      request
    );
    if (response.success) {
      return response.data || '메시지 전송 성공';
    }
    throw new Error(response.message || '메시지 전송에 실패했습니다.');
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
   * 채팅방에 사용자 초대 (토큰 기반)
   */
  async inviteUserToChatRoom(chatRoomId: number, userId: number): Promise<string> {
    const response = await httpClient.post<string>(
      `/chat/rooms/${chatRoomId}/invite`,
      { userId }
    );
    if (response.success) {
      return response.data || '초대 성공';
    }
    throw new Error(response.message || '사용자 초대에 실패했습니다.');
  }

  /**
   * 메시지 읽음 처리 (토큰 기반)
   */
  async markMessagesAsRead(chatRoomId: number, lastMessageId: string): Promise<string> {
    const response = await httpClient.post<string>(
      `/chat/rooms/${chatRoomId}/mark-read`,
      { lastMessageId }
    );
    if (response.success) {
      return response.data || '읽음 처리 성공';
    }
    throw new Error(response.message || '읽음 처리에 실패했습니다.');
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
   * 채팅방 빠른 초기화 API (성능 최적화) (토큰 기반)
   * 하나의 요청으로 채팅방 정보 + 최근 메시지 모두 반환
   */
  async initChatRoomFast(chatRoomId: number): Promise<ChatRoomInitResponse> {
    console.log(`🚀 채팅방 빠른 초기화 요청 (토큰): chatRoomId=${chatRoomId}`);
    
    const startTime = performance.now();
    
    try {
      const response = await httpClient.get<ChatRoomInitResponse>(
        `/chat/rooms/${chatRoomId}/init`
      );
      
      const endTime = performance.now();
      console.log(`✅ 채팅방 초기화 완료: ${(endTime - startTime).toFixed(2)}ms`);
      
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '채팅방 초기화에 실패했습니다.');
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
  
  /**
   * 채팅방 활동 시간 업데이트
   */
  async updateChatRoomActivity(chatRoomId: number): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(
      `${API_BASE_URL}/chat/rooms/${chatRoomId}/update-activity`
    );
    return response.data.data;
  }

  /**
   * 내 전체 안읽은 메시지 카운트 조회 (토큰 기반)
   */
  async getMyUnreadCounts(): Promise<any> {
    const response = await httpClient.get<any>('/chat/unread-count/my');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || '안읽은 메시지 카운트 조회에 실패했습니다.');
  }

  /**
   * 특정 채팅방의 안읽은 메시지 개수 조회 (토큰 기반)
   */
  async getChatRoomUnreadCount(chatRoomId: number): Promise<number> {
    const response = await httpClient.get<number>(
      `/chat/unread-count/room/${chatRoomId}`
    );
    if (response.success) {
      return response.data || 0;
    }
    throw new Error(response.message || '안읽은 메시지 개수 조회에 실패했습니다.');
  }

  /**
   * 채팅방 메시지 읽음 처리 (안읽은 카운트 0으로 초기화) (토큰 기반)
   */
  async markChatRoomAsRead(chatRoomId: number): Promise<string> {
    const response = await httpClient.post<string>(
      `/chat/unread-count/room/${chatRoomId}/mark-read`
    );
    if (response.success) {
      return response.data || '읽음 처리 성공';
    }
    throw new Error(response.message || '읽음 처리에 실패했습니다.');
  }
}



export const chatApi = new ChatApi();
