import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  enabled: process.env.NODE_ENV === 'development',
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

// 🔧 전역 연결 상태 관리 (싱글톤)
class ChatConnectionManager {
  private static instance: ChatConnectionManager | null = null;
  private connections = new Map<string, { 
    isConnected: boolean; 
    isConnecting: boolean; 
    connectionPromise?: Promise<void>;
  }>();
  
  static getInstance(): ChatConnectionManager {
    if (!ChatConnectionManager.instance) {
      ChatConnectionManager.instance = new ChatConnectionManager();
    }
    return ChatConnectionManager.instance;
  }
  
  getConnectionKey(chatRoomId: number, userId: number): string {
    return `${chatRoomId}-${userId}`;
  }
  
  isConnected(key: string): boolean {
    return this.connections.get(key)?.isConnected || false;
  }
  
  isConnecting(key: string): boolean {
    return this.connections.get(key)?.isConnecting || false;
  }
  
  setConnecting(key: string, promise?: Promise<void>): void {
    this.connections.set(key, { 
      isConnected: false, 
      isConnecting: true, 
      connectionPromise: promise 
    });
  }
  
  setConnected(key: string): void {
    this.connections.set(key, { 
      isConnected: true, 
      isConnecting: false 
    });
  }
  
  setDisconnected(key: string): void {
    this.connections.delete(key);
  }
  
  getConnectionPromise(key: string): Promise<void> | undefined {
    return this.connections.get(key)?.connectionPromise;
  }
}

const connectionManager = ChatConnectionManager.getInstance();

// 🔧 메시지 필터링 유틸리티
const isValidChatMessage = (message: ChatMessage): boolean => {
  return message.messageType !== 'JOIN' && 
         message.messageType !== 'LEAVE' && 
         message.messageType !== 'SYSTEM' &&
         message.messageType !== 'TYPING' &&
         message.messageType !== 'STOP_TYPING' &&
         message.messageType !== 'BATCH';  // BATCH 메시지 제외
};

// 🔧 메시지 유효성 검사 및 수정 (토큰 기반)
const validateAndFixMessage = (message: ChatMessage): ChatMessage => {
  // messageId 유효성 검사
  if (!message.messageId) {
    message.messageId = `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // timestamp 유효성 검사
  if (!message.timestamp) {
    message.timestamp = new Date().toISOString();
  } else {
    try {
      const date = new Date(message.timestamp);
      if (isNaN(date.getTime())) {
        message.timestamp = new Date().toISOString();
      }
    } catch (e) {
      message.timestamp = new Date().toISOString();
    }
  }
  
  // senderName 복구 시도 - 토큰 기반에서는 서버에서 처리
  if (!message.senderName || message.senderName.trim() === '') {
    if (process.env.NODE_ENV === 'development') {
      console.error('[CHAT] senderName이 누락된 메시지 감지', {
        senderId: message.senderId,
        messageId: message.messageId,
        messageType: message.messageType
      });
    }
    message.senderName = '알 수 없음';
  }
  
  if (!message.content && !message.attachmentUrl) {
    message.content = '';
  }
  
  return message;
};

// 🚀 강제 리렌더링 유틸리티
const forceRerender = () => {
  // DOM 강제 리페인트 트리거
  document.body.style.transform = 'translateZ(0)';
  requestAnimationFrame(() => {
    document.body.style.transform = '';
  });
};


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
  isConnected: boolean;
  error: string | null;
  clearError: () => void;
}

export const useChatRoom = (
  chatRoomId: number,
  userId: number,
  userName: string
): UseChatRoomResult => {
  // DEBUG 초기화를 조건부로 처리하여 과도한 로그 방지
  const debugInitialized = useRef(false);
  if (!debugInitialized.current) {
    DEBUG.init(chatRoomId, 0); // userId 없이 초기화
    debugInitialized.current = true;
  }
  
  // 🔧 연결 키 생성 (토큰 기반이므로 chatRoomId만 사용)
  const connectionKey = useMemo(() => 
    `token_${chatRoomId}`, 
    [chatRoomId]
  );
  
  // 상태 관리
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 타이핑 타이머 관리
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  
  // 최신 값 참조용 ref
  const chatRoomIdRef = useRef(chatRoomId);
  const isMountedRef = useRef(true);
  
  // 메시지 중복 제거를 위한 Set
  const processedMessageIds = useRef(new Set<string>());

  // 🔧 안정화된 메시지 핸들러 (useCallback + 중복 제거 + 즉시 렌더링)
  const messageHandler = useCallback((message: ChatMessage) => {
    if (!isMountedRef.current) return;
    
    // 받은 원본 메시지 로깅 (디버깅용)
    DEBUG.log('원본 메시지 수신', {
      messageId: message.messageId,
      senderId: message.senderId,
      senderName: message.senderName,
      messageType: message.messageType,
      hasContent: !!message.content,
      timestampValid: !!message.timestamp
    });
    
    // 메시지 검증 및 수정 (토큰 기반이므로 사용자 정보 없이)
    const validatedMessage = validateAndFixMessage(message);
    
    // 유효하지 않은 메시지 타입 필터링
    if (!isValidChatMessage(validatedMessage)) {
      DEBUG.log(`메시지 타입 필터링: ${validatedMessage.messageType} 무시`);
      return;
    }
    
    // 중복 메시지 검사 (안전성 강화)
    if (validatedMessage.messageId && processedMessageIds.current.has(validatedMessage.messageId)) {
      DEBUG.warn('중복 메시지 감지 및 무시', { messageId: validatedMessage.messageId });
      return;
    }
    
    if (validatedMessage.messageId) {
      processedMessageIds.current.add(validatedMessage.messageId);
    }
    
    // 🚀 즉시 렌더링을 위한 동기 업데이트 + 강제 리렌더링
    setMessages(prev => {
      // 기존 임시 메시지 제거 (실제 메시지가 도착한 경우) - 안전성 강화
      const filteredPrev = prev.filter(m => {
        // messageId가 없는 경우 제거하지 않음
        if (!m.messageId) return true;
        
        // temp_ 메시지가 아니면 유지
        if (!m.messageId.startsWith('temp_')) return true;
        
        // 다른 사용자의 메시지면 유지
        if (m.senderId !== validatedMessage.senderId) return true;
        
        // 시간 차이가 5초 이상이면 유지
        try {
          const timeDiff = Math.abs(new Date(m.timestamp).getTime() - new Date(validatedMessage.timestamp).getTime());
          return timeDiff > 5000;
        } catch (e) {
          return true; // 시간 파싱 오류 시 유지
        }
      });
      
      const exists = filteredPrev.some(m => m.messageId === validatedMessage.messageId);
      if (exists) return prev;
      
      // 메시지를 시간순으로 정렬하여 추가
      const newMessages = [...filteredPrev, validatedMessage].sort((a, b) => {
        try {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        } catch (e) {
          return 0; // 시간 파싱 오류 시 순서 유지
        }
      });
      
      // 강제 리렌더링 트리거
      setTimeout(() => {
        setMessages(currentMessages => [...currentMessages]); // 강제 업데이트
        forceRerender(); // DOM 강제 리페인트
      }, 0);
      
      return newMessages;
    });
    
    DEBUG.log('메시지 처리 완료', { 
      messageId: validatedMessage.messageId, 
      type: validatedMessage.messageType 
    });
  }, []);

  const userStatusHandler = useCallback((status: UserStatusMessage) => {
    if (!isMountedRef.current) return;
    
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      if (status.action === 'JOIN') {
        newSet.add(status.userId);
      } else if (status.action === 'LEAVE') {
        newSet.delete(status.userId);
      }
      return newSet;
    });
    
    DEBUG.log('사용자 상태 업데이트', { 
      userId: status.userId, 
      action: status.action 
    });
  }, []);

  const typingHandler = useCallback((message: WebSocketMessage) => {
    if (!isMountedRef.current) return;
    
    setTypingUsers(prev => {
      const newSet = new Set(prev);
      
      if (message.type === 'TYPING') {
        newSet.add(message.senderId);
        // 3초 후 자동으로 타이핑 상태 제거
        setTimeout(() => {
          if (isMountedRef.current) {
            setTypingUsers(current => {
              const updated = new Set(current);
              updated.delete(message.senderId);
              return updated;
            });
          }
        }, 3000);
      } else if (message.type === 'STOP_TYPING') {
        newSet.delete(message.senderId);
      }
      
      return newSet;
    });
    
    DEBUG.log('타이핑 상태 업데이트', { 
      senderId: message.senderId, 
      type: message.type 
    });
  }, []);

  // Update refs when props change
  useEffect(() => {
    chatRoomIdRef.current = chatRoomId;
  }, [chatRoomId]);

  // 🔧 초기화 로직 - 중복 방지 및 최적화
  useEffect(() => {
    // 이미 연결되었거나 연결 중이면 스킵
    if (connectionManager.isConnected(connectionKey)) {
      DEBUG.warn('이미 연결된 채팅방, 초기화 스킵', { connectionKey });
      setIsConnected(true);
      return;
    }
    
    if (connectionManager.isConnecting(connectionKey)) {
      DEBUG.warn('연결 중인 채팅방, 기존 연결 대기', { connectionKey });
      const existingPromise = connectionManager.getConnectionPromise(connectionKey);
      if (existingPromise) {
        existingPromise.then(() => {
          if (isMountedRef.current) {
            setIsConnected(true);
          }
        }).catch(err => {
          if (isMountedRef.current) {
            setError('채팅 연결에 실패했습니다.');
            DEBUG.error('기존 연결 대기 중 오류', err);
          }
        });
      }
      return;
    }

    // 🚀 새로운 연결 시작
    const initializeConnection = async () => {
      try {
        setError(null);
        setIsLoadingMessages(true);
        DEBUG.log('🚀 채팅방 초기화 시작', { connectionKey });

        // 1. WebSocket 연결 확인 및 생성 (토큰 기반)
        if (!chatWebSocketService.isConnected()) {
          await chatWebSocketService.connect();
          
          // 연결 대기 (최대 5초)
          let attempts = 0;
          while (!chatWebSocketService.isConnected() && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
          }
          
          if (!chatWebSocketService.isConnected()) {
            throw new Error('WebSocket 연결 시간 초과');
          }
        }

        // 2. 핸들러 등록
        chatWebSocketService.onMessage(messageHandler);
        chatWebSocketService.onUserStatus(userStatusHandler);
        chatWebSocketService.onTyping(typingHandler);

        // 3. 채팅방 입장
        if (chatWebSocketService.getCurrentChatRoomId() !== chatRoomId) {
          chatWebSocketService.joinRoom(chatRoomId);
        }

        // 4. 초기 데이터 로드 (토큰 기반)
        const initData = await chatApi.initChatRoomFast(chatRoomId);
        
        // 5. 채팅방 활동 시간 업데이트 (토큰 기반 - 별도 호출)
        try {
          await chatApi.updateChatRoomActivity(chatRoomId);
        } catch (activityError) {
          // 활동 시간 업데이트 실패는 전체 초기화를 막지 않음
          console.warn('채팅방 활동 시간 업데이트 실패:', activityError);
        }
        
        if (isMountedRef.current) {
          setChatRoom(initData.chatRoom);
          
          // 메시지 필터링 및 검증 (토큰 기반)
          const validMessages = initData.recentMessages
            .filter(isValidChatMessage)
            .map(msg => validateAndFixMessage(msg))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          
          setMessages(validMessages);
          
          // 처리된 메시지 ID 저장
          validMessages.forEach(msg => {
            processedMessageIds.current.add(msg.messageId);
          });
          
          setIsConnected(true);
          connectionManager.setConnected(connectionKey);
          
          // 6. 채팅방 입장 시 자동 읽음 처리 (토큰 기반)
          try {
            await chatApi.markChatRoomAsRead(chatRoomId);
            DEBUG.log('채팅방 입장 시 자동 읽음 처리 완료');
          } catch (readError) {
            console.warn('자동 읽음 처리 실패:', readError);
          }
          
          DEBUG.log('🎉 초기화 완료', { 
            messageCount: validMessages.length
          });
        }

      } catch (err) {
        DEBUG.error('초기화 실패', err);
        if (isMountedRef.current) {
          setError('채팅 연결에 실패했습니다.');
          setIsConnected(false);
          connectionManager.setDisconnected(connectionKey);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoadingMessages(false);
        }
      }
    };

    // 연결 중 상태로 마킹하고 초기화 시작
    const connectionPromise = initializeConnection();
    connectionManager.setConnecting(connectionKey, connectionPromise);

    // cleanup
    return () => {
      DEBUG.log('🧹 컴포넌트 언마운트 또는 deps 변경', { connectionKey });
      
      // 핸들러 제거
      chatWebSocketService.removeMessageHandler(messageHandler);
      chatWebSocketService.removeUserStatusHandler(userStatusHandler);
      chatWebSocketService.removeTypingHandler(typingHandler);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // 연결 상태 리셋
      connectionManager.setDisconnected(connectionKey);
    };
  }, [chatRoomId, connectionKey, messageHandler, userStatusHandler, typingHandler]);

  // 🔧 컴포넌트 언마운트 추적
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 🔧 최적화된 Helper functions
  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMessages || !hasMoreMessages) return;
    
    try {
      setIsLoadingMessages(true);
      const nextPage = currentPage + 1;
      const response = await chatApi.getChatMessages(chatRoomId, nextPage, 20);
      
      const validMessages = response.content
        .filter(isValidChatMessage)
        .map(msg => validateAndFixMessage(msg))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      setMessages(prev => [...validMessages, ...prev]);
      setHasMoreMessages(!response.last);
      setCurrentPage(nextPage);
      
      // 처리된 메시지 ID 저장
      validMessages.forEach(msg => {
        processedMessageIds.current.add(msg.messageId);
      });
      
      DEBUG.log('추가 메시지 로드 완료', { count: validMessages.length });
      
    } catch (err) {
      DEBUG.error('추가 메시지 로드 실패', err);
      setError('추가 메시지를 불러올 수 없습니다.');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [chatRoomId, currentPage, isLoadingMessages, hasMoreMessages]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !isConnected) {
      DEBUG.warn('메시지 전송 조건 미충족', { hasContent: !!content.trim(), isConnected });
      return;
    }
    
    try {
      // 🚀 낙관적 업데이트: 메시지를 즉시 화면에 표시 (토큰 기반)
      const optimisticMessage: ChatMessage = {
        messageId: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        chatRoomId: chatRoomIdRef.current,
        senderId: userId, // 현재 사용자 ID 사용
        senderName: userName, // 현재 사용자 이름 사용
        content: content.trim(),
        messageType: 'CHAT',
        timestamp: new Date().toISOString(),
        attachmentUrl: null,
        attachmentType: null,
        mentionUserId: null,
        senderProfileImage: null
      };
      
      setMessages(prev => {
        const newMessages = [...prev, optimisticMessage];
        // 강제 리렌더링 트리거
        setTimeout(() => {
          setMessages(current => [...current]);
          forceRerender(); // DOM 강제 리페인트
        }, 0);
        return newMessages;
      });
      
      // 실제 WebSocket 전송
      chatWebSocketService.sendMessage(content.trim());
      DEBUG.log('메시지 전송 완료 (낙관적 업데이트 적용)', { contentLength: content.trim().length });
    } catch (err) {
      DEBUG.error('메시지 전송 실패', err);
      setError('메시지 전송에 실패했습니다.');
    }
  }, [isConnected]);

  const sendMentionMessage = useCallback((content: string, mentionUserId: number) => {
    if (!content.trim() || !isConnected) return;
    try {
      chatWebSocketService.sendMentionMessage(content.trim(), mentionUserId);
      DEBUG.log('멘션 메시지 전송 완료', { mentionUserId });
    } catch (err) {
      DEBUG.error('멘션 메시지 전송 실패', err);
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
      DEBUG.log('파일 메시지 전송 완료', { fileName: file.name, fileType: file.type });
    } catch (err) {
      DEBUG.error('파일 메시지 전송 실패', err);
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
    DEBUG.log('타이핑 시작');
  }, [isConnected]);

  const stopTyping = useCallback(() => {
    if (!isConnected || !isTypingRef.current) return;
    isTypingRef.current = false;
    chatWebSocketService.sendTypingStatus(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    DEBUG.log('타이핑 중지');
  }, [isConnected]);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await chatApi.markMessagesAsRead(chatRoomId, messageId);
      chatWebSocketService.markMessageAsRead(messageId);
      DEBUG.log('읽음 처리 완료', { messageId });
    } catch (err) {
      DEBUG.error('읽음 처리 실패', err);
    }
  }, [chatRoomId]);

  const clearError = useCallback(() => {
    setError(null);
    DEBUG.log('오류 상태 클리어');
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
  createPersonalChatRoom: (guestUserId: number, postingId: number) => Promise<ChatRoom>;
}

export const useChatRooms = (): UseChatRoomsResult => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChatRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // JWT 토큰에서 사용자 ID를 추출하도록 API 수정
      const rooms = await chatApi.getMyChatRooms(); // 경로 변경
      // LAST_ACTIVE_AT 기준으로 DESC 정렬 (백엔드에서 이미 정렬되어 오지만 추가 보장)
      const sortedRooms = rooms.sort((a, b) => {
        // lastActiveAt > lastMessageAt > createdAt 순으로 우선순위
        const aTime = a.lastActiveAt || a.lastMessageAt || a.createdAt;
        const bTime = b.lastActiveAt || b.lastMessageAt || b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
      setChatRooms(sortedRooms);
    } catch (err) {
      console.error('채팅방 목록 로드 실패:', err);
      setError('채팅방 목록을 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []); // userId 의존성 제거

  const createPersonalChatRoom = useCallback(async (
    guestUserId: number, 
    postingId: number
  ): Promise<ChatRoom> => {
    try {
      const chatRoom = await chatApi.getOrCreatePersonalChatRoom(guestUserId, postingId);
      
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
