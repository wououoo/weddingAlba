import React, { memo } from 'react';
import { ChatMessage } from '../api/chatApi';

// 🔧 타임스탬프 포맷팅 최적화 (안전성 강화)
const formatTime = (timestamp: string): string => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp detected:', timestamp);
      return '';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.warn('시간 포맷팅 오류:', error, 'timestamp:', timestamp);
    return '';
  }
};

interface OptimizedChatMessageProps {
  message: ChatMessage;
  isMe: boolean;
  showSender?: boolean;
  currentUserId: number;
  onMarkAsRead?: (messageId: string) => void;
}

// 🚀 React.memo로 최적화된 채팅 메시지 컴포넌트
const OptimizedChatMessage: React.FC<OptimizedChatMessageProps> = memo(({
  message,
  isMe,
  showSender = true,
  currentUserId,
  onMarkAsRead
}) => {
  // 🔧 메시지 타입별 렌더링
  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'IMAGE':
        return (
          <div className="max-w-xs">
            <img 
              src={message.attachmentUrl} 
              alt="이미지" 
              className="rounded-lg max-w-full h-auto"
              loading="lazy"
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
      
      case 'MENTION':
        return (
          <div className="p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <span className="text-yellow-800">{message.content}</span>
          </div>
        );
      
      default:
        return <span>{message.content}</span>;
    }
  };

  // 🔧 메시지 스타일 결정
  const getMessageStyle = () => {
    if (isMe) {
      return 'bg-purple-600 text-white';
    }
    
    switch (message.messageType) {
      case 'MENTION':
        return 'bg-yellow-100 border border-yellow-300';
      case 'SYSTEM':
        return 'bg-gray-100 text-gray-600 text-center italic';
      default:
        return 'bg-white border border-gray-200';
    }
  };

  return (
    <div className={`mb-4 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      {/* 프로필 이미지 (상대방 메시지일 때만) */}
      {!isMe && (
        <div className="mr-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            {message.senderProfileImage ? (
              <img 
                src={message.senderProfileImage} 
                alt={message.senderName}
                className="w-8 h-8 rounded-full object-cover"
                loading="lazy"
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
        {/* 발신자 이름 (상대방 메시지이고 showSender가 true일 때만) */}
        {!isMe && showSender && (
          <div className="text-xs text-gray-600 mb-1 font-medium">
            {message.senderName}
          </div>
        )}
        
        <div className="flex items-end">
          {/* 시간 (내 메시지일 때는 왼쪽에) */}
          {isMe && (
            <div className="text-xs text-gray-500 mr-2 self-end">
              {formatTime(message.timestamp)}
            </div>
          )}
          
          {/* 메시지 내용 */}
          <div className={`rounded-lg py-2 px-3 ${getMessageStyle()}`}>
            {renderMessageContent()}
          </div>
          
          {/* 시간 (상대방 메시지일 때는 오른쪽에) */}
          {!isMe && (
            <div className="text-xs text-gray-500 ml-2 self-end">
              {formatTime(message.timestamp)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // 🚀 커스텀 비교 함수로 불필요한 리렌더링 방지
  return (
    prevProps.message.messageId === nextProps.message.messageId &&
    prevProps.isMe === nextProps.isMe &&
    prevProps.showSender === nextProps.showSender &&
    prevProps.currentUserId === nextProps.currentUserId &&
    prevProps.message.content === nextProps.message.content &&  // 컨텐츠 변경 감지
    prevProps.message.senderName === nextProps.message.senderName  // 사용자명 변경 감지
  );
});

OptimizedChatMessage.displayName = 'OptimizedChatMessage';

export default OptimizedChatMessage;
