import { useState, useEffect, useCallback, useRef } from 'react';
import { chatApi, ChatRoom, ChatMessage, PageResponse } from '../api/chatApi';
import { 
  chatWebSocketService, 
  WebSocketMessage, 
  UserStatusMessage,
  MessageHandler,
  UserStatusHandler,
  TypingHandler 
} from '../api/chatWebSocketService';

// 디버깅 헬퍼 함수들
const DEBUG = {
  enabled: true,
  chatRoomId: null as number | null,
  userId: null as number | null,
  
  init(chatRoomId: number, userId: number) {
    this.chatRoomId = chatRoomId;
    this.userId = userId;
    this.log('🚀 DEBUG 모드 활성화', { chatRoomId, userId });
  },
  
  log(message: string, data?: any) {
    if (!this.enabled) return;
    const timestamp = new Date().toISOString().substr(11, 12);
    console.log(`[${timestamp}] [CHAT-${this.chatRoomId}] ${message}`, data || '');
  },
  
  warn(message: string, data?: any) {
    if (!this.enabled) return;
    const timestamp = new Date().toISOString().substr(11, 12);
    console.warn(`[${timestamp}] [CHAT-${this.chatRoomId}] ⚠️ ${message}`, data || '');
  },
  
  error(message: string, error?: any) {
    if (!this.enabled) return;
    const timestamp = new Date().toISOString().substr(11, 12);
    console.error(`[${timestamp}] [CHAT-${this.chatRoomId}] ❌ ${message}`, error || '');
  }
};

// 🔧 전역 초기화 상태 관리 (싱글톤 패턴)
class GlobalInitManager {
  private static instance: GlobalInitManager | null = null;
  private initStates: Map<string, boolean> = new Map();
  private connections: Map<string, Promise<void>> = new Map();
  private initializingStates: Map<string, boolean> = new Map();
  
  static getInstance(): GlobalInitManager {
    if (!GlobalInitManager.instance) {
      GlobalInitManager.instance = new GlobalInitManager();
    }
    return GlobalInitManager.instance;
  }
  
  isInitialized(key: string): boolean {
    return this.initStates.get(key) === true;
  }
  
  isInitializing(key: string): boolean {
    return this.initializingStates.get(key) === true;
  }
  
  setInitializing(key: string, value: boolean): void {
    this.initializingStates.set(key, value);
  }
  
  setInitialized(key: string): void {
    this.initStates.set(key, true);
    this.initializingStates.set(key, false);
  }
  
  clearInitialized(key: string): void {
    this.initStates.delete(key);
    this.connections.delete(key);
    this.initializingStates.delete(key);
  }
  
  getConnection(key: string): Promise<void> | null {
    return this.connections.get(key) || null;
  }
  
  setConnection(key: string, promise: Promise<void>): void {
    this.connections.set(key, promise);
  }
}

const globalInitManager = GlobalInitManager.getInstance();

export interface UseChatRoomResult {
  chatRoom: ChatRoom | null;
  messages: ChatMessage[];
  isLoadingMessages: boolean;
  hasMoreMessages: boolean;
  loadMoreMessages: () => Promise<void>;
  sendMessage: (content: string) => void;
  sendMentionMessage: (content: string, mentionUserId: number) => void;
  sendFileMessage: (content: string, file: File) => Promise<void>;
  typingUsers: Set<number>;
  startTyping: () => void;
  stopTyping: () => void;
  onlineUsers: Set<number>;
  markAsRead: (messageId: string) => void;
  unreadCount: number;
  isConnected: boolean;
  error: string | null;
  clearError: () => void;
}

export const useChatRoom = (
  chatRoomId: number,
  userId: number,
  userName: string
): UseChatRoomResult => {
  DEBUG.init(chatRoomId, userId);
  
  // 🔧 전역 초기화 키
  const initKey = `${chatRoomId}-${userId}`;
  
  // 상태 관리
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 타이핑 타이머 관리
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  
  // 최신 값 참조용 ref
  const userIdRef = useRef(userId);
  const chatRoomIdRef = useRef(chatRoomId);
  const userNameRef = useRef(userName);

  // 🔧 무한 렌더링 방지: 안정적인 핸들러 (useCallback으로 고정)
  const messageHandler = useCallback((message: ChatMessage) => {
    // JOIN, LEAVE, SYSTEM 메시지는 완전히 무시 (채팅 UI에 나타나지 않음)
    if (message.messageType === 'JOIN' || message.messageType === 'LEAVE' || message.messageType === 'SYSTEM') {
      DEBUG.log(`${message.messageType} 메시지 무시 - UI에 표시하지 않음`);
      return;
    }
    
    setMessages(prev => {
      const exists = prev.some(m => m.messageId === message.messageId);
      if (exists) {
        DEBUG.warn('중복 메시지 감지', { messageId: message.messageId });
        return prev;
      }
      return [...prev, message];
    });
    
    if (message.senderId !== userIdRef.current && message.messageType === 'CHAT') {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  const userStatusHandler = useCallback((status: UserStatusMessage) => {
    if (status.action === 'JOIN') {
      setOnlineUsers(prev => new Set([...prev, status.userId]));
    } else if (status.action === 'LEAVE') {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(status.userId);
        return newSet;
      });
    }
  }, []);

  const typingHandler = useCallback((message: WebSocketMessage) => {
    if (message.type === 'TYPING') {
      setTypingUsers(prev => new Set([...prev, message.senderId]));
      setTimeout(() => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(message.senderId);
          return newSet;
        });
      }, 3000);
    } else if (message.type === 'STOP_TYPING') {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(message.senderId);
        return newSet;
      });
    }
  }, []);

  // 🔧 개선된 초기화 로직: 싱글톤 + 중복 방지
  useEffect(() => {
    // ref 값 업데이트 (항상 최신 유지)
    userIdRef.current = userId;
    chatRoomIdRef.current = chatRoomId;
    userNameRef.current = userName;

    // 이미 초기화되었으면 스킵
    if (globalInitManager.isInitialized(initKey)) {
      DEBUG.warn('⛔ 이미 초기화된 채팅방, 스킵', { initKey });
      return;
    }

    // 이미 초기화 중이라면 스킵
    if (globalInitManager.isInitializing(initKey)) {
      DEBUG.warn('⛔ 이미 초기화 중인 채팅방, 스킵', { initKey });
      return;
    }

    // 기존 연결이 있는지 확인
    const existingConnection = globalInitManager.getConnection(initKey);
    if (existingConnection) {
      DEBUG.warn('기존 연결 재사용', { initKey });
      existingConnection.then(() => {
        setIsConnected(true);
        DEBUG.log('기존 연결 완료');
      }).catch(err => {
        DEBUG.error('기존 연결 오류', err);
        setError('채팅 연결에 실패했습니다.');
      });
      return;
    }

    // 초기화 시작 마킹
    globalInitManager.setInitializing(initKey, true);
    DEBUG.error('❌ 채팅방 초기화 시작 - 오직 한 번만 나와야 함!', { initKey });

    const initializeOnce = async () => {
      try {
        setError(null);
        setIsLoadingMessages(true);

        // 1. WebSocket 연결
        const isAlreadyConnected = chatWebSocketService.isConnected();
        DEBUG.log(`WebSocket 상태: ${isAlreadyConnected ? '연결됨' : '연결 필요'}`);

        if (!isAlreadyConnected) {
          await chatWebSocketService.connect(userId, userName);
          let attempts = 0;
          while (!chatWebSocketService.isConnected() && attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
          }
          if (!chatWebSocketService.isConnected()) {
            throw new Error('WebSocket 연결 시간 초과');
          }
        }

        setIsConnected(true);
        DEBUG.log('WebSocket 연결 완료');

        // 2. 핸들러 등록
        chatWebSocketService.onMessage(messageHandler);
        chatWebSocketService.onUserStatus(userStatusHandler);
        chatWebSocketService.onTyping(typingHandler);
        DEBUG.log('핸들러 등록 완료');

        // 3. 채팅방 입장
        const currentRoomId = chatWebSocketService.getCurrentChatRoomId();
        if (currentRoomId !== chatRoomId) {
          chatWebSocketService.joinRoom(chatRoomId);
          DEBUG.log('채팅방 입장 완료');
        } else {
          DEBUG.warn('이미 같은 채팅방에 있음');
        }

        // 4. 데이터 로드
        try {
          const initData = await chatApi.initChatRoomFast(chatRoomId, userId);
          setChatRoom(initData.chatRoom);
          // JOIN/LEAVE 메시지 필터링 후 정렬
          const filteredMessages = initData.recentMessages
            .filter(msg => msg.messageType !== 'JOIN' && msg.messageType !== 'LEAVE' && msg.messageType !== 'SYSTEM')
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          setMessages(filteredMessages);
          setUnreadCount(initData.unreadCount);
          DEBUG.log('API 초기화 완료 (실제 채팅 메시지만)', { messageCount: filteredMessages.length });
        } catch (err) {
          DEBUG.error('API 초기화 실패', err);
          setError('채팅방 데이터를 불러올 수 없습니다.');
        }

        setIsLoadingMessages(false);
        globalInitManager.setInitialized(initKey);
        DEBUG.log('🚀 초기화 완료!', { initKey });

      } catch (err) {
        DEBUG.error('초기화 실패', err);
        setError('채팅 연결에 실패했습니다.');
        setIsConnected(false);
        setIsLoadingMessages(false);
        // 실패시 전역 상태 리셋하여 재시도 가능하게
        globalInitManager.clearInitialized(initKey);
      }
    };

    // 연결 Promise 등록 및 실행
    const connectionPromise = initializeOnce();
    globalInitManager.setConnection(initKey, connectionPromise);

    // cleanup
    return () => {
      DEBUG.warn('🧹 컴포넌트 언마운트', { initKey });

      // 핸들러 제거
      chatWebSocketService.removeMessageHandler(messageHandler);
      chatWebSocketService.removeUserStatusHandler(userStatusHandler);
      chatWebSocketService.removeTypingHandler(typingHandler);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // 전역 상태 리셋 (언마운트 시에만)
      globalInitManager.clearInitialized(initKey);
    };
  }, [chatRoomId, userId, userName, initKey, messageHandler, userStatusHandler, typingHandler]);

  // Helper functions - 메모화하여 안정성 확보
  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMessages || !hasMoreMessages) return;
    try {
      setIsLoadingMessages(true);
      const nextPage = currentPage + 1;
      const response = await chatApi.getChatMessages(chatRoomId, nextPage, 20);
      // JOIN/LEAVE 메시지 필터링 후 정렬
      const filteredMessages = response.content
        .filter(msg => msg.messageType !== 'JOIN' && msg.messageType !== 'LEAVE' && msg.messageType !== 'SYSTEM')
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessages(prev => [...filteredMessages, ...prev]);
      setHasMoreMessages(!response.last);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('추가 메시지 로드 실패:', err);
      setError('추가 메시지를 불러올 수 없습니다.');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [chatRoomId, currentPage, isLoadingMessages, hasMoreMessages]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !isConnected) return;
    try {
      chatWebSocketService.sendMessage(content.trim());
    } catch (err) {
      console.error('메시지 전송 실패:', err);
      setError('메시지 전송에 실패했습니다.');
    }
  }, [isConnected]);

  const sendMentionMessage = useCallback((content: string, mentionUserId: number) => {
    if (!content.trim() || !isConnected) return;
    try {
      chatWebSocketService.sendMentionMessage(content.trim(), mentionUserId);
    } catch (err) {
      console.error('멘션 메시지 전송 실패:', err);
      setError('멘션 메시지 전송에 실패했습니다.');
    }
  }, [isConnected]);

  const sendFileMessage = useCallback(async (content: string, file: File) => {
    if (!isConnected) return;
    try {
      const uploadedUrl = URL.createObjectURL(file);
      chatWebSocketService.sendFileMessage(
        content || `${file.name}을(를) 전송했습니다.`,
        uploadedUrl,
        file.type
      );
    } catch (err) {
      console.error('파일 메시지 전송 실패:', err);
      setError('파일 전송에 실패했습니다.');
    }
  }, [isConnected]);

  const startTyping = useCallback(() => {
    if (!isConnected || isTypingRef.current) return;
    isTypingRef.current = true;
    chatWebSocketService.sendTypingStatus(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [isConnected]);

  const stopTyping = useCallback(() => {
    if (!isConnected || !isTypingRef.current) return;
    isTypingRef.current = false;
    chatWebSocketService.sendTypingStatus(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [isConnected]);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await chatApi.markMessagesAsRead(chatRoomId, userId, messageId);
      chatWebSocketService.markMessageAsRead(messageId);
      setUnreadCount(0);
    } catch (err) {
      console.error('읽음 처리 실패:', err);
    }
  }, [chatRoomId, userId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    chatRoom,
    messages,
    isLoadingMessages,
    hasMoreMessages,
    loadMoreMessages,
    sendMessage,
    sendMentionMessage,
    sendFileMessage,
    typingUsers,
    startTyping,
    stopTyping,
    onlineUsers,
    markAsRead,
    unreadCount,
    isConnected,
    error,
    clearError
  };
};

// 채팅방 목록 훅
export interface UseChatRoomsResult {
  chatRooms: ChatRoom[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createPersonalChatRoom: (hostUserId: number, guestUserId: number, postingId: number) => Promise<ChatRoom>;
}

export const useChatRooms = (userId: number): UseChatRoomsResult => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChatRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const rooms = await chatApi.getUserChatRooms(userId);
      const sortedRooms = rooms.sort((a, b) => {
        const aTime = a.lastMessageAt || a.createdAt;
        const bTime = b.lastMessageAt || b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
      setChatRooms(sortedRooms);
    } catch (err) {
      console.error('채팅방 목록 로드 실패:', err);
      setError('채팅방 목록을 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createPersonalChatRoom = useCallback(async (
    hostUserId: number, 
    guestUserId: number, 
    postingId: number
  ): Promise<ChatRoom> => {
    try {
      const chatRoom = await chatApi.getOrCreatePersonalChatRoom(hostUserId, guestUserId, postingId);
      
      setChatRooms(prev => {
        const exists = prev.find(room => room.chatRoomId === chatRoom.chatRoomId);
        if (exists) {
          return prev.map(room => 
            room.chatRoomId === chatRoom.chatRoomId ? chatRoom : room
          );
        } else {
          return [chatRoom, ...prev];
        }
      });
      
      return chatRoom;
    } catch (err) {
      console.error('1:1 채팅방 생성 실패:', err);
      setError('채팅방 생성에 실패했습니다.');
      throw err;
    }
  }, []);

  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  return {
    chatRooms,
    isLoading,
    error,
    refresh: loadChatRooms,
    createPersonalChatRoom
  };
};
