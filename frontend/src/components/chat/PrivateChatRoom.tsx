import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChatRoom } from './hooks/useChatRoom';
import VirtualChatList from './components/VirtualChatList';
import ChatPerformanceMonitor from './components/ChatPerformanceMonitor';

// JWT 토큰에서 사용자 정보를 추출하는 함수 (디버깅 향상)
const getCurrentUser = () => {
  // 실제로는 JWT 토큰을 디코딩해서 사용자 정보를 가져와야 함
  // 현재는 서버에서 토큰으로 사용자를 식별하므로 클라이언트에서는 ID만 필요
  
  // 디버깅: 로컬스토리지에서 사용자 ID 확인
  const token = localStorage.getItem('accessToken');
  console.log('현재 토큰:', token ? '존재' : '없음');
  
  // 임시: 여러 사용자 ID로 테스트
  // 만약 다른 사용자로 로그인했다면 ID를 바꿀 수 있음
  const userId = 1; // 임시 - 실제로는 토큰에서 추출
  
  console.log('현재 사용자 ID:', userId);
  
  return {
    id: userId,
    name: '이신부', // 사용자 이름 - 실제로는 토큰에서 추출해야 함
  };
};

const TypingIndicator: React.FC<{ typingUsers: Set<number>; currentUserId: number }> = ({ 
  typingUsers, 
  currentUserId 
}) => {
  const otherTypingUsers = Array.from(typingUsers).filter(id => id !== currentUserId);
  
  if (otherTypingUsers.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 p-2 text-gray-500 text-sm">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span>상대방이 입력 중...</span>
    </div>
  );
};

const PrivateChatRoom: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 🔧 컴포넌트 마운트 추적 (개선된 버전)
  const mountCountRef = useRef(0);
  
  useEffect(() => {
    mountCountRef.current += 1;
    const mountId = mountCountRef.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🟢 PrivateChatRoom 마운트 #${mountId}`, { roomId });
    }
    
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔴 PrivateChatRoom 언마운트 #${mountId}`, { roomId });
      }
    };
  }, [roomId]);

  const currentUser = getCurrentUser();
  const chatRoomId = roomId ? parseInt(roomId) : 0;
  
  // useChatRoom 호출 - 사용자 정보 전달
  const {
    chatRoom,
    messages,
    isLoadingMessages,
    hasMoreMessages,
    loadMoreMessages,
    sendMessage,
    typingUsers,
    startTyping,
    stopTyping,
    markAsRead,
    isConnected,
    error,
    clearError
  } = useChatRoom(chatRoomId, currentUser.id, currentUser.name);

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !isConnected) return;
    
    sendMessage(message.trim());
    setMessage('');
    stopTyping();
    
    // 🚀 즉시 입력창 포커스 유지
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  }, [message, isConnected, sendMessage, stopTyping]);

  // 엔터키로 메시지 전송
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // 타이핑 상태 처리
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (value.trim() && !isTyping) {
      setIsTyping(true);
      startTyping();
    }

    // 타이핑 중지 타이머 리셋
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping();
    }, 1000);
  }, [isTyping, startTyping, stopTyping]);

  // 메시지 읽음 처리
  const handleMarkAsRead = useCallback((messageId: string) => {
    markAsRead(messageId);
  }, [markAsRead]);

  // 파일 첨부 (구현 예정)
  const handleFileAttach = useCallback(() => {
    // TODO: 파일 선택 및 업로드 로직 구현
    console.log('파일 첨부 기능 구현 예정');
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // 에러 상태
  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <div className="bg-white p-4 border-b border-gray-200 flex items-center">
          <button onClick={() => navigate('/chat', { replace: true })} className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="font-bold">채팅</h1>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button 
            onClick={clearError}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 로딩 상태
  if (!chatRoom) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-500 ml-4">채팅방을 불러오는 중...</p>
      </div>
    );
  }

  // 상대방 정보 계산 (실제 사용자 정보 사용)
  const getOtherUserInfo = () => {
    if (chatRoom.type === 'PERSONAL') {
      if (chatRoom.hostUserId === currentUser.id) {
        // 내가 호스트인 경우 -> 게스트 정보 표시
        const displayName = chatRoom.guestNickname || chatRoom.guestName || '게스트';
        return { name: displayName, role: '신청자' };
      } else {
        // 내가 게스트인 경우 -> 호스트 정보 표시
        const displayName = chatRoom.hostNickname || chatRoom.hostName || '호스트';
        return { name: displayName, role: '모집자' };
      }
    }
    return { name: chatRoom.roomName, role: '' };
  };

  const otherUser = getOtherUserInfo();

  return (
    <div className="relative h-screen bg-gray-50 overflow-hidden">
      {/* 성능 모니터 (개발 환경에서만 표시) */}
      <ChatPerformanceMonitor
        messageCount={messages.length}
        isConnected={isConnected}
        typingUsers={typingUsers.size}
      />
      
      {/* 완전 고정 헤더 */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white p-4 border-b border-gray-200 flex items-center shadow-sm h-16">
        <button onClick={() => navigate('/chat', { replace: true })} className="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h1 className="font-bold">{otherUser.name}</h1>
            {!isConnected && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">연결 끊김</span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {otherUser.role} • {chatRoom.description || '1:1 채팅'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 메시지 영역 (가운데 영역) - 절대 위치 지정 */}
      <div 
        className="absolute bg-gray-50"
        style={{ 
          top: '64px',    // 헤더 높이
          bottom: '96px', // 푸터 높이
          left: '0',
          right: '0',
          overflow: 'hidden'
        }}
      >
        <VirtualChatList
          messages={messages.filter(msg => msg.messageType !== 'JOIN' && msg.messageType !== 'LEAVE' && msg.messageType !== 'SYSTEM')}
          currentUserId={currentUser.id}
          onLoadMore={loadMoreMessages}
          hasMoreMessages={hasMoreMessages}
          isLoadingMessages={isLoadingMessages}
          onMarkAsRead={handleMarkAsRead}
          containerHeight={Math.max(300, (window?.innerHeight || 600) - 160)} // 고정 값 사용
        />
        
        {/* 타이핑 인디케이터 */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gray-50">
          <TypingIndicator typingUsers={typingUsers} currentUserId={currentUser.id} />
        </div>
      </div>

      {/* 완전 고정 푸터 (입력 영역) */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <button 
            onClick={handleFileAttach}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          <div className="flex-1 flex items-end">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={isConnected ? "메시지 입력..." : "연결 중..."}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={!isConnected}
              autoFocus
            />
          </div>
          
          <button 
            className={`p-2 rounded-full transition-colors ${
              message.trim() && isConnected
                ? 'text-purple-600 hover:bg-purple-50' 
                : 'text-gray-400'
            }`}
            onClick={handleSendMessage}
            disabled={!message.trim() || !isConnected}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        {/* 연결 상태 표시 */}
        {!isConnected && (
          <div className="mt-2 text-center">
            <span className="text-xs text-red-500">채팅 서버와 연결이 끊어졌습니다. 재연결 중...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateChatRoom;
