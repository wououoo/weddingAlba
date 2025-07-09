import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from './chatApi';

// 메시지 안전 파싱 유틸리티
const safeParseMessage = (rawMessage: string): ChatMessage[] => {
  try {
    const parsed = JSON.parse(rawMessage);
    
    // BATCH 타입 메시지 처리 - 여러 메시지가 한 번에 전송됨
    if (parsed.messageType === 'BATCH' || (parsed.count && parsed.messages)) {
      console.log('[WS] 배치 메시지 수신:', { count: parsed.count, messagesLength: parsed.messages?.length });
      
      if (!parsed.messages || !Array.isArray(parsed.messages)) {
        console.warn('[WS] 배치 메시지에 messages 배열이 없음');
        return [];
      }
      
      return parsed.messages.map((msg: any) => ({
        messageId: msg.messageId || msg.id || `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        chatRoomId: msg.chatRoomId || msg.roomId || 0,
        senderId: msg.senderId || msg.userId || msg.sender?.id || 0,
        senderName: msg.senderName || msg.userName || msg.sender?.name || msg.user?.name || '',
        senderProfileImage: msg.senderProfileImage || msg.profileImage || msg.sender?.profileImage || msg.user?.profileImage,
        content: msg.content || msg.message || '',
        messageType: msg.messageType || msg.type || 'CHAT',
        timestamp: msg.timestamp || msg.createdAt || msg.time || new Date().toISOString(),
        mentionUserId: msg.mentionUserId || msg.mentionedUserId,
        attachmentUrl: msg.attachmentUrl || msg.fileUrl,
        attachmentType: msg.attachmentType || msg.fileType
      }));
    }
    
    // 단일 메시지 처리
    const message: ChatMessage = {
      messageId: parsed.messageId || parsed.id || `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      chatRoomId: parsed.chatRoomId || parsed.roomId || 0,
      senderId: parsed.senderId || parsed.userId || parsed.sender?.id || 0,
      senderName: parsed.senderName || parsed.userName || parsed.sender?.name || parsed.user?.name || '',
      senderProfileImage: parsed.senderProfileImage || parsed.profileImage || parsed.sender?.profileImage || parsed.user?.profileImage,
      content: parsed.content || parsed.message || '',
      messageType: parsed.messageType || parsed.type || 'CHAT',
      timestamp: parsed.timestamp || parsed.createdAt || parsed.time || new Date().toISOString(),
      mentionUserId: parsed.mentionUserId || parsed.mentionedUserId,
      attachmentUrl: parsed.attachmentUrl || parsed.fileUrl,
      attachmentType: parsed.attachmentType || parsed.fileType
    };
    
    return [message];
  } catch (error) {
    console.error('[WS] 메시지 파싱 실패:', error, '원본 메시지:', rawMessage);
    return [];
  }
};

// WebSocket 디버깅 헬퍼
const WS_DEBUG = {
  enabled: true,
  
  log(action: string, data?: any) {
    if (!this.enabled) return;
    const timestamp = new Date().toISOString().substr(11, 12);
    console.log(`[${timestamp}] [WS] ${action}`, data || '');
  },
  
  warn(action: string, data?: any) {
    if (!this.enabled) return;
    const timestamp = new Date().toISOString().substr(11, 12);
    console.warn(`[${timestamp}] [WS] ⚠️ ${action}`, data || '');
  },
  
  error(action: string, error?: any) {
    if (!this.enabled) return;
    const timestamp = new Date().toISOString().substr(11, 12);
    console.error(`[${timestamp}] [WS] ❌ ${action}`, error || '');
  },
  
  trace(category: string, action: string, data?: any) {
    if (!this.enabled) return;
    const timestamp = new Date().toISOString().substr(11, 12);
    console.log(`[${timestamp}] [WS] 🔍 ${category} → ${action}`, data || '');
  }
};

export interface WebSocketMessage {
  messageId?: string;
  chatRoomId: number;
  senderId: number;
  senderName: string;
  senderProfileImage?: string;
  content: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'TYPING' | 'STOP_TYPING' | 'MENTION' | 'FILE' | 'IMAGE';
  timestamp?: string;
  mentionUserId?: number;
  attachmentUrl?: string;
  attachmentType?: string;
}

export interface UserStatusMessage {
  userId: number;
  chatRoomId: number;
  action: 'JOIN' | 'LEAVE';
  timestamp: string;
  userName: string;
  userProfileImage?: string;
}

export type MessageHandler = (message: ChatMessage) => void;
export type UserStatusHandler = (status: UserStatusMessage) => void;
export type TypingHandler = (message: WebSocketMessage) => void;
export type ErrorHandler = (error: any) => void;

class ChatWebSocketService {
  private client: Client | null = null;
  private connected = false;
  private currentChatRoomId: number | null = null;
  
  // 연결 추적용
  private connectionAttempts = 0;
  private lastConnectTime: number | null = null;

  // 이벤트 핸들러들
  private messageHandlers: MessageHandler[] = [];
  private userStatusHandlers: UserStatusHandler[] = [];
  private typingHandlers: TypingHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];

  /**
   * WebSocket 연결
   */
  connect(userId: number, userName: string): Promise<void> {
    this.connectionAttempts += 1;
    const connectId = this.connectionAttempts;
    this.lastConnectTime = Date.now();
    
    WS_DEBUG.log(`연결 시도 #${connectId}`, { userId, userName, currentlyConnected: this.connected });
    
    // 이미 연결되어 있고 같은 사용자라면 스킵
    if (this.connected && this.currentUserId === userId && this.client?.connected) {
      WS_DEBUG.warn(`이미 연결되어 있음, 연결 스킵`, { connectId, userId, currentUserId: this.currentUserId });
      return Promise.resolve();
    }
    
    // 이전 연결이 있다면 정리
    if (this.client) {
      WS_DEBUG.log(`이전 연결 정리 중...`, { connectId });
      try {
        this.client.deactivate();
      } catch (e) {
        WS_DEBUG.warn(`이전 연결 정리 중 오류 무시`, e);
      }
    }
    
    return new Promise((resolve, reject) => {
      try {
        WS_DEBUG.trace('connect', 'CREATING_CLIENT', { connectId, userId, userName });
        // SockJS를 사용한 WebSocket 연결
        this.client = new Client({
          webSocketFactory: () => {
          const sockjs = new SockJS('/ws');
          WS_DEBUG.log('SockJS 인스턴스 생성', { url: '/ws' });
          
          // SockJS 이벤트 리스너 추가
          sockjs.onopen = () => {
            WS_DEBUG.log('SockJS 연결 성공');
          };
          
          sockjs.onerror = (error) => {
            WS_DEBUG.error('SockJS 연결 오류', error);
          };
          
          sockjs.onclose = () => {
            WS_DEBUG.warn('SockJS 연결 종료');
          };
          
          return sockjs;
        },
          connectHeaders: {},
          debug: process.env.NODE_ENV === 'development' ? console.log : () => {},
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        this.currentUserId = userId;
        this.currentUserName = userName;
        WS_DEBUG.trace('connect', 'CLIENT_CREATED', { connectId, userId, userName });

        // 연결 성공 핸들러
        this.client.onConnect = (frame) => {
          WS_DEBUG.log(`연결 성공 #${connectId}`, { frame: frame.headers });
          console.log('WebSocket 연결 성공:', frame);
          this.connected = true;
          resolve();
        };

        // 연결 실패 핸들러
        this.client.onStompError = (frame) => {
          WS_DEBUG.error(`STOMP 오류 #${connectId}`, { frame: frame.headers, message: frame.headers['message'] });
          console.error('STOMP 오류:', frame);
          this.connected = false;
          this.handleError(frame);
          reject(new Error(`STOMP 오류: ${frame.headers['message']}`));
        };

        // WebSocket 에러 핸들러
        this.client.onWebSocketError = (error) => {
          WS_DEBUG.error(`WebSocket 오류 #${connectId}`, error);
          console.error('WebSocket 오류:', error);
          this.connected = false;
          this.handleError(error);
          reject(error);
        };

        // 연결 해제 핸들러
        this.client.onDisconnect = () => {
          WS_DEBUG.warn(`연결 해제 #${connectId}`);
          console.log('WebSocket 연결 해제됨');
          this.connected = false;
        };

        // 연결 시작
        WS_DEBUG.trace('connect', 'ACTIVATING_CLIENT', { connectId });
        this.client.activate();
      } catch (error) {
        WS_DEBUG.error(`WebSocket 초기화 실패 #${connectId}`, error);
        console.error('WebSocket 초기화 실패:', error);
        this.handleError(error);
        reject(error);
      }
    });
  }

  /**
   * WebSocket 연결 해제
   */
  disconnect(): void {
    WS_DEBUG.log('연결 해제 요청', { 
      connected: this.connected, 
      currentChatRoomId: this.currentChatRoomId
    });
    
    if (this.client && this.connected) {
      // 현재 채팅방에서 퇴장 메시지 전송
      if (this.currentChatRoomId) {
        WS_DEBUG.trace('disconnect', 'LEAVING_ROOM', { chatRoomId: this.currentChatRoomId });
        this.leaveRoom();
      }

      WS_DEBUG.trace('disconnect', 'DEACTIVATING_CLIENT', {});
      this.client.deactivate();
    }
    
    this.connected = false;
    this.currentChatRoomId = null;
    WS_DEBUG.log('연결 해제 완료', {});
  }

  /**
   * 채팅방 입장
   */
  joinRoom(chatRoomId: number): void {
    WS_DEBUG.log(`채팅방 입장 요청`, { 
      chatRoomId, 
      currentRoomId: this.currentChatRoomId,
      connected: this.connected,
      clientConnected: this.client?.connected 
    });
    
    if (!this.client) {
      WS_DEBUG.error('WebSocket 클라이언트가 없음', { chatRoomId });
      console.error('WebSocket 클라이언트가 없음');
      return;
    }
    
    // 중복 입장 방지
    if (this.currentChatRoomId === chatRoomId) {
      WS_DEBUG.warn('이미 같은 채팅방에 있음, 입장 스킵', { chatRoomId });
      return;
    }

    // WebSocket이 연결될 때까지 대기
    const waitForConnection = () => {
      if (this.connected && this.client?.connected) {
        WS_DEBUG.trace('joinRoom', 'CONNECTION_READY', { chatRoomId });
        this.performJoinRoom(chatRoomId);
      } else {
        WS_DEBUG.trace('joinRoom', 'WAITING_CONNECTION', { 
          chatRoomId,
          connected: this.connected,
          clientConnected: this.client?.connected 
        });
        // 100ms 후 다시 시도
        setTimeout(waitForConnection, 100);
      }
    };

    waitForConnection();
  }

  /**
   * 실제 채팅방 입장 수행
   */
  private performJoinRoom(chatRoomId: number): void {
    if (!this.client || !this.connected) {
      WS_DEBUG.error('실제 입장 실패: WebSocket이 연결되지 않음', { chatRoomId });
      console.error('WebSocket이 연결되지 않음');
      return;
    }

    // 이전 채팅방에서 퇴장
    if (this.currentChatRoomId && this.currentChatRoomId !== chatRoomId) {
      WS_DEBUG.log('이전 채팅방에서 퇴장', { 
        previousRoomId: this.currentChatRoomId, 
        newRoomId: chatRoomId 
      });
      this.leaveRoom();
    }

    this.currentChatRoomId = chatRoomId;
    WS_DEBUG.log(`채팅방 입장 시작`, { chatRoomId });

    try {
      // 채팅 메시지 구독
      WS_DEBUG.trace('performJoinRoom', 'SUBSCRIBING_CHAT', { chatRoomId });
      this.client.subscribe(`/topic/chat/${chatRoomId}`, (message: Message) => {
        try {
          WS_DEBUG.trace('message', 'RAW_MESSAGE_RECEIVED', { 
            body: message.body,
            bodyLength: message.body?.length || 0
          });
          
          const chatMessages = safeParseMessage(message.body);
          
          if (!chatMessages || chatMessages.length === 0) {
            WS_DEBUG.error('메시지 파싱 실패 - 빈 배열 반환', { rawMessage: message.body });
            return;
          }
          
          WS_DEBUG.trace('message', 'PARSED_MESSAGES', { 
            count: chatMessages.length,
            firstMessageId: chatMessages[0]?.messageId,
            firstMessageType: chatMessages[0]?.messageType
          });
          
          // 배치로 받은 각 메시지를 개별 처리
          chatMessages.forEach(chatMessage => {
            WS_DEBUG.trace('message', 'PROCESSING_INDIVIDUAL_MESSAGE', { 
              messageId: chatMessage.messageId, 
              messageType: chatMessage.messageType,
              senderId: chatMessage.senderId,
              senderName: chatMessage.senderName,
              hasContent: !!chatMessage.content
            });
            this.handleMessage(chatMessage);
          });
        } catch (error) {
          WS_DEBUG.error('메시지 처리 오류', { 
            error, 
            rawMessage: message.body,
            messageLength: message.body?.length || 0
          });
          console.error('메시지 처리 오류:', error);
          this.handleError(error);
        }
      });

      // 사용자 상태 변경 구독
      WS_DEBUG.trace('performJoinRoom', 'SUBSCRIBING_USER_STATUS', { chatRoomId });
      this.client.subscribe(`/topic/user-status/${chatRoomId}`, (message: Message) => {
        try {
          const userStatus: UserStatusMessage = JSON.parse(message.body);
          WS_DEBUG.trace('message', 'USER_STATUS_RECEIVED', { 
            action: userStatus.action, 
            userId: userStatus.userId, 
            userName: userStatus.userName 
          });
          this.handleUserStatus(userStatus);
        } catch (error) {
          WS_DEBUG.error('사용자 상태 메시지 파싱 오류', { error, rawMessage: message.body });
          console.error('사용자 상태 메시지 파싱 오류:', error);
          this.handleError(error);
        }
      });

      // 타이핑 상태 구독
      WS_DEBUG.trace('performJoinRoom', 'SUBSCRIBING_TYPING', { chatRoomId });
      this.client.subscribe(`/topic/typing/${chatRoomId}`, (message: Message) => {
        try {
          const typingMessage: WebSocketMessage = JSON.parse(message.body);
          WS_DEBUG.trace('message', 'TYPING_RECEIVED', { 
            type: typingMessage.type, 
            senderId: typingMessage.senderId,
            senderName: typingMessage.senderName 
          });
          this.handleTyping(typingMessage);
        } catch (error) {
          WS_DEBUG.error('타이핑 메시지 파싱 오류', { error, rawMessage: message.body });
          console.error('타이핑 메시지 파싱 오류:', error);
          this.handleError(error);
        }
      });

      // 개인 멘션 알림 구독 (JWT 토큰으로 사용자 식별)
      WS_DEBUG.trace('performJoinRoom', 'SUBSCRIBING_MENTION', { chatRoomId });
      this.client.subscribe(`/user/queue/mention`, (message: Message) => {
        try {
          const mentionMessages = safeParseMessage(message.body);
          if (!mentionMessages || mentionMessages.length === 0) {
            WS_DEBUG.error('멘션 메시지 파싱 실패', { rawMessage: message.body });
            return;
          }
          
          // 멘션은 보통 단일 메시지이지만 배치로 올 수도 있음
          mentionMessages.forEach(mentionMessage => {
            WS_DEBUG.trace('message', 'MENTION_RECEIVED', { 
              messageId: mentionMessage.messageId,
              senderId: mentionMessage.senderId
            });
            this.handleMessage(mentionMessage);
            // 멘션 알림 표시
            this.showMentionNotification(mentionMessage);
          });
        } catch (error) {
          WS_DEBUG.error('멘션 메시지 파싱 오류', { error, rawMessage: message.body });
          console.error('멘션 메시지 파싱 오류:', error);
          this.handleError(error);
        }
      });

      // 입장 메시지 전송
      WS_DEBUG.trace('performJoinRoom', 'SENDING_JOIN_MESSAGE', { chatRoomId });
      this.client.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify({
          chatRoomId: chatRoomId,
          type: 'JOIN'
        })
      });

      WS_DEBUG.log(`채팅방 ${chatRoomId}에 입장 완료`);
      console.log(`채팅방 ${chatRoomId}에 입장`);
    } catch (error) {
      WS_DEBUG.error('채팅방 입장 중 오류', { chatRoomId, error });
      console.error('채팅방 입장 중 오류:', error);
      this.handleError(error);
    }
  }

  /**
   * 채팅방 퇴장
   */
  leaveRoom(): void {
    if (!this.client || !this.connected || !this.currentChatRoomId) {
      return;
    }

    // 퇴장 메시지 전송
    this.client.publish({
      destination: '/app/chat.removeUser',
      body: JSON.stringify({
        chatRoomId: this.currentChatRoomId,
        type: 'LEAVE'
      })
    });

    console.log(`채팅방 ${this.currentChatRoomId}에서 퇴장`);
    this.currentChatRoomId = null;
  }

  /**
   * 채팅 메시지 전송
   */
  sendMessage(content: string): void {
    if (!this.client || !this.connected || !this.currentChatRoomId) {
      WS_DEBUG.error('메시지 전송 불가', { 
        hasClient: !!this.client, 
        connected: this.connected, 
        hasRoomId: !!this.currentChatRoomId 
      });
      console.error('메시지 전송 불가: WebSocket 미연결 또는 채팅방 미입장');
      return;
    }

    const message = {
      chatRoomId: this.currentChatRoomId,
      content: content,
      type: 'CHAT'
    };

    WS_DEBUG.log('메시지 전송', { 
      messageLength: content.length
    });

    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(message)
    });
  }

  /**
   * 멘션 메시지 전송
   */
  sendMentionMessage(content: string, mentionUserId: number): void {
    if (!this.client || !this.connected || !this.currentChatRoomId) {
      WS_DEBUG.error('멘션 메시지 전송 불가', { 
        hasClient: !!this.client, 
        connected: this.connected, 
        hasRoomId: !!this.currentChatRoomId
      });
      console.error('멘션 메시지 전송 불가: WebSocket 미연결 또는 채팅방 미입장');
      return;
    }

    const message = {
      chatRoomId: this.currentChatRoomId,
      content: content,
      type: 'MENTION',
      mentionUserId: mentionUserId
    };

    WS_DEBUG.log('멘션 메시지 전송', { mentionUserId });

    this.client.publish({
      destination: '/app/chat.sendMention',
      body: JSON.stringify(message)
    });
  }

  /**
   * 파일 메시지 전송
   */
  sendFileMessage(content: string, attachmentUrl: string, attachmentType: string): void {
    if (!this.client || !this.connected || !this.currentChatRoomId) {
      WS_DEBUG.error('파일 메시지 전송 불가', { 
        hasClient: !!this.client, 
        connected: this.connected, 
        hasRoomId: !!this.currentChatRoomId
      });
      console.error('파일 메시지 전송 불가: WebSocket 미연결 또는 채팅방 미입장');
      return;
    }

    const message = {
      chatRoomId: this.currentChatRoomId,
      content: content,
      type: attachmentType.startsWith('image/') ? 'IMAGE' : 'FILE',
      attachmentUrl: attachmentUrl,
      attachmentType: attachmentType
    };

    WS_DEBUG.log('파일 메시지 전송', { fileType: attachmentType });

    this.client.publish({
      destination: '/app/chat.sendFile',
      body: JSON.stringify(message)
    });
  }

  /**
   * 타이핑 상태 전송
   */
  sendTypingStatus(isTyping: boolean): void {
    if (!this.client || !this.connected || !this.currentChatRoomId) {
      return;
    }

    const message = {
      chatRoomId: this.currentChatRoomId,
      content: '',
      type: isTyping ? 'TYPING' : 'STOP_TYPING'
    };

    const endpoint = isTyping ? '/app/chat.typing' : '/app/chat.stopTyping';
    this.client.publish({
      destination: endpoint,
      body: JSON.stringify(message)
    });
  }

  /**
   * 메시지 읽음 처리
   */
  markMessageAsRead(messageId: string): void {
    if (!this.client || !this.connected || !this.currentChatRoomId) {
      return;
    }

    const message = {
      chatRoomId: this.currentChatRoomId,
      messageId: messageId
    };

    this.client.publish({
      destination: '/app/chat.markRead',
      body: JSON.stringify(message)
    });
  }

  /**
   * 이벤트 핸들러 등록
   */
  onMessage(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  onUserStatus(handler: UserStatusHandler): void {
    this.userStatusHandlers.push(handler);
  }

  onTyping(handler: TypingHandler): void {
    this.typingHandlers.push(handler);
  }

  onError(handler: ErrorHandler): void {
    this.errorHandlers.push(handler);
  }

  /**
   * 이벤트 핸들러 제거
   */
  removeMessageHandler(handler: MessageHandler): void {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }

  removeUserStatusHandler(handler: UserStatusHandler): void {
    const index = this.userStatusHandlers.indexOf(handler);
    if (index > -1) {
      this.userStatusHandlers.splice(index, 1);
    }
  }

  removeTypingHandler(handler: TypingHandler): void {
    const index = this.typingHandlers.indexOf(handler);
    if (index > -1) {
      this.typingHandlers.splice(index, 1);
    }
  }

  removeErrorHandler(handler: ErrorHandler): void {
    const index = this.errorHandlers.indexOf(handler);
    if (index > -1) {
      this.errorHandlers.splice(index, 1);
    }
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.connected;
  }

  getCurrentChatRoomId(): number | null {
    return this.currentChatRoomId;
  }

  // 내부 메서드들
  private handleMessage(message: ChatMessage): void {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('메시지 핸들러 오류:', error);
      }
    });
  }

  private handleUserStatus(status: UserStatusMessage): void {
    this.userStatusHandlers.forEach(handler => {
      try {
        handler(status);
      } catch (error) {
        console.error('사용자 상태 핸들러 오류:', error);
      }
    });
  }

  private handleTyping(message: WebSocketMessage): void {
    this.typingHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('타이핑 핸들러 오류:', error);
      }
    });
  }

  private handleError(error: any): void {
    this.errorHandlers.forEach(handler => {
      try {
        handler(error);
      } catch (handlerError) {
        console.error('에러 핸들러 오류:', handlerError);
      }
    });
  }

  private showMentionNotification(message: ChatMessage): void {
    // 브라우저 알림 권한 확인 및 표시
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${message.senderName}님이 멘션했습니다`, {
        body: message.content,
        icon: message.senderProfileImage || '/default-avatar.png'
      });
    }
  }
}

// 싱글톤 인스턴스
export const chatWebSocketService = new ChatWebSocketService();
