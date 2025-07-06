import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChatRoom } from './hooks/useChatRoom';
import { ChatRoomSkeleton } from './components/ChatSkeleton';
import { ChatMessage } from './api/chatApi';

// 임시 사용자 정보 (실제로는 인증 시스템에서 가져와야 함)
const CURRENT_USER = {
  id: 1,
  name: '이신부',
  profileImage: '/profiles/lee_bride.jpg'
};

const GroupChatRoom: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 디버깅: 컴포넌트 마운트 추적
  const mountCountRef = useRef(0);
  
  useEffect(() => {
    mountCountRef.current += 1;
    const mountId = mountCountRef.current;
    console.log(`🟢 GroupChatRoom 마운트 #${mountId}`, { roomId });
    
    return () => {
      console.log(`🔴 GroupChatRoom 언마운트 #${mountId}`, { roomId });
    };
  }, [roomId]);
  
  // 실제 채팅 훅 사용
  const chatRoomId = parseInt(roomId || '0');
  console.log(`🔄 useChatRoom 호출`, { chatRoomId, userId: CURRENT_USER.id, userName: CURRENT_USER.name });
  
  const {
    chatRoom,
    messages,
    isLoadingMessages,
    sendMessage,
    sendMentionMessage,
    typingUsers,
    startTyping,
    stopTyping,
    onlineUsers,
    isConnected,
    error
  } = useChatRoom(
    chatRoomId,
    CURRENT_USER.id,
    CURRENT_USER.name
  );

  // 메시지 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송 핸들러
  const handleSendMessage = () => {
    if (message.trim() === '' || !isConnected) return;
    
    // @멘션 검사
    const mentionMatch = message.match(/@(\\S+)/);
    if (mentionMatch) {
      // 멘션된 사용자 찾기 (실제로는 참여자 목록에서 찾아야 함)
      const mentionedUser = mentionMatch[1];
      // 간단한 예시: 사용자 이름으로 ID 매핑
      const userNameToId: { [key: string]: number } = {
        '김웨딩': 2,
        '박메이크': 3,
        '최플래너': 4,
        '정알바': 5
      };
      
      const mentionUserId = userNameToId[mentionedUser];
      if (mentionUserId) {
        sendMentionMessage(message.trim(), mentionUserId);
      } else {
        sendMessage(message.trim());
      }
    } else {
      sendMessage(message.trim());
    }
    
    setMessage('');
  };

  // 엔터키로 메시지 전송
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // 타이핑 상태 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (e.target.value.trim() && isConnected) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  // 에러 처리
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-red-700 mb-2">채팅방 연결 실패</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/chat')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            채팅 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 로딩 중
  if (isLoadingMessages || !chatRoom) {
    return <ChatRoomSkeleton />;
  }

  // 채팅방이 없을 때
  if (!roomId || parseInt(roomId) === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8">
          <div className="text-gray-400 text-6xl mb-4">💬</div>
          <h1 className="text-xl font-bold text-gray-700 mb-2">채팅방을 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-4">유효하지 않은 채팅방 ID입니다.</p>
          <button 
            onClick={() => navigate('/chat')}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            채팅 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center shadow-sm">
        <button 
          onClick={() => navigate('/chat', { replace: true })} 
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-lg">{chatRoom.roomName}</h1>
          <div className="flex items-center text-xs text-gray-500 space-x-2">
            <span>{chatRoom.type === 'GROUP' ? '그룹 채팅' : chatRoom.type === 'PUBLIC' ? '공개 채팅' : '개인 채팅'}</span>
            <span>•</span>
            <span>참여자 {onlineUsers.size}명 온라인</span>
            {!isConnected && (
              <>
                <span>•</span>
                <span className="text-red-500">연결 중...</span>
              </>
            )}
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages
          .filter(msg => 
            msg.messageType !== 'JOIN' && 
            msg.messageType !== 'LEAVE' &&
            msg.messageType !== 'TYPING' &&
            msg.messageType !== 'STOP_TYPING'
          )
          .length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">💬</div>
            <p className="text-gray-500">아직 메시지가 없습니다.</p>
            <p className="text-gray-400 text-sm">첫 번째 메시지를 보내보세요!</p>
          </div>
        ) : (
          messages
            .filter(msg => 
              msg.messageType !== 'JOIN' && 
              msg.messageType !== 'LEAVE' &&
              msg.messageType !== 'TYPING' &&
              msg.messageType !== 'STOP_TYPING'
            )
            .map((msg) => (
            <div
              key={msg.messageId}
              className={`flex ${msg.senderId === CURRENT_USER.id ? 'justify-end' : 'justify-start'}`}
            >
              {msg.senderId !== CURRENT_USER.id && (
                <div className="mr-3 flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {msg.senderName?.charAt(0) || '?'}
                  </div>
                </div>
              )}
              <div className={`max-w-[70%]`}>
                {msg.senderId !== CURRENT_USER.id && (
                  <div className="text-xs text-gray-600 mb-1 font-medium">{msg.senderName}</div>
                )}
                <div className="flex items-end">
                  {msg.senderId === CURRENT_USER.id && (
                    <div className="text-xs text-gray-500 mr-2 self-end">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                  <div className={`rounded-lg py-2 px-3 ${
                    msg.senderId === CURRENT_USER.id 
                      ? 'bg-purple-600 text-white' 
                      : msg.messageType === 'MENTION'
                      ? 'bg-yellow-100 border border-yellow-300'
                      : msg.messageType === 'SYSTEM'
                      ? 'bg-gray-100 text-gray-600 text-center italic'
                      : 'bg-white border border-gray-200'
                  }`}>
                    {msg.messageType === 'SYSTEM' ? (
                      <span>🔔 {msg.content}</span>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.senderId !== CURRENT_USER.id && (
                    <div className="text-xs text-gray-500 ml-2 self-end">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* 타이핑 상태 표시 */}
        {typingUsers.size > 0 && (
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>{Array.from(typingUsers).join(', ')}님이 입력 중...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            type="text"
            className="flex-1 border-0 focus:ring-2 focus:ring-purple-500 focus:border-transparent px-4 py-2 rounded-full bg-gray-100"
            placeholder={isConnected ? "메시지 입력... (@사용자명 으로 멘션 가능)" : "연결 중..."}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
          />
          <button 
            className={`p-2 rounded-full transition-colors ${
              message.trim() && isConnected
                ? 'text-purple-600 hover:bg-purple-100' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleSendMessage}
            disabled={!message.trim() || !isConnected}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatRoom;
