import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChatRoom } from './hooks/useChatRoom';
import { ChatMessage } from './api/chatApi';

// 임시 사용자 정보 (실제로는 AuthContext에서 가져와야 함)
const getCurrentUser = () => {
  return {
    id: 1,
    name: '사용자',
    profileImage: null
  };
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageItem: React.FC<{
  message: ChatMessage;
  isMe: boolean;
  showSender: boolean;
  onMarkAsRead: (messageId: string) => void;
}> = ({ message, isMe, showSender, onMarkAsRead }) => {
  const messageRef = useRef<HTMLDivElement>(null);

  // 메시지가 화면에 보이면 읽음 처리
  useEffect(() => {
    if (!isMe && messageRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onMarkAsRead(message.messageId);
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(messageRef.current);
      return () => observer.disconnect();
    }
  }, [isMe, message.messageId, onMarkAsRead]);

  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'IMAGE':
        return (
          <div className="max-w-xs">
            <img 
              src={message.attachmentUrl} 
              alt="이미지" 
              className="rounded-lg max-w-full h-auto"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.png';
              }}
            />
            {message.content && (
              <p className="mt-2">{message.content}</p>
            )}
          </div>
        );
      
      case 'FILE':
        return (
          <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div className="flex-1">
              <p className="font-medium">{message.content || '파일'}</p>
              <p className="text-xs text-gray-500">{message.attachmentType}</p>
            </div>
            <a 
              href={message.attachmentUrl} 
              download 
              className="text-purple-600 hover:text-purple-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </a>
          </div>
        );
      
      case 'JOIN':
      case 'LEAVE':
      case 'SYSTEM':
        return (
          <div className="text-center text-gray-500 text-sm py-2">
            {message.content}
          </div>
        );
      
      default:
        return <span>{message.content}</span>;
    }
  };

  // 시스템 메시지는 중앙 정렬
  if (message.messageType === 'JOIN' || message.messageType === 'LEAVE' || message.messageType === 'SYSTEM') {
    return (
      <div ref={messageRef} className="my-2">
        {renderMessageContent()}
      </div>
    );
  }

  return (
    <div
      ref={messageRef}
      className={`mb-4 flex ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      {!isMe && (
        <div className="mr-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            {message.senderProfileImage ? (
              <img 
                src={message.senderProfileImage} 
                alt={message.senderName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
        </div>
      )}
      
      <div className="max-w-[70%]">
        {!isMe && showSender && (
          <div className="text-xs text-gray-600 mb-1">{message.senderName}</div>
        )}
        <div className="flex items-end">
          {isMe && <div className="text-xs text-gray-500 mr-2">{formatTime(message.timestamp)}</div>}
          <div className={`rounded-lg py-2 px-3 ${isMe ? 'bg-purple-600 text-white' : 'bg-white border'}`}>
            {renderMessageContent()}
          </div>
          {!isMe && <div className="text-xs text-gray-500 ml-2">{formatTime(message.timestamp)}</div>}
        </div>
      </div>
    </div>
  );
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentUser = getCurrentUser();
  const chatRoomId = roomId ? parseInt(roomId) : 0;

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
    unreadCount,
    isConnected,
    error,
    clearError
  } = useChatRoom(chatRoomId, currentUser.id, currentUser.name);

  // 메시지 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !isConnected) return;
    
    sendMessage(message.trim());
    setMessage('');
    stopTyping();
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

  // 스크롤 상단에서 더 많은 메시지 로드
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop === 0 && hasMoreMessages && !isLoadingMessages) {
      loadMoreMessages();
    }
  }, [hasMoreMessages, isLoadingMessages, loadMoreMessages]);

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

  // 상대방 정보 계산
  const getOtherUserInfo = () => {
    if (chatRoom.type === 'PERSONAL') {
      if (chatRoom.hostUserId === currentUser.id) {
        return { name: '게스트', role: '신청자' };
      } else {
        return { name: '호스트', role: '모집자' };
      }
    }
    return { name: chatRoom.roomName, role: '' };
  };

  const otherUser = getOtherUserInfo();

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center">
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
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div 
        className="flex-1 overflow-auto p-4 bg-gray-100" 
        onScroll={handleScroll}
      >
        {/* 로딩 인디케이터 (상단) */}
        {isLoadingMessages && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* 메시지 목록 */}
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser.id;
          const prevMessage = index > 0 ? messages[index - 1] : null;
          const showSender = !isMe && (!prevMessage || prevMessage.senderId !== msg.senderId);
          
          return (
            <MessageItem
              key={msg.messageId}
              message={msg}
              isMe={isMe}
              showSender={showSender}
              onMarkAsRead={handleMarkAsRead}
            />
          );
        })}

        {/* 타이핑 인디케이터 */}
        <TypingIndicator typingUsers={typingUsers} currentUserId={currentUser.id} />
        
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t border-gray-200 p-4">
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
