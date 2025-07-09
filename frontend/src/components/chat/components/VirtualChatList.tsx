import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChatMessage } from '../api/chatApi';
import OptimizedChatMessage from './OptimizedChatMessage';

interface VirtualChatListProps {
  messages: ChatMessage[];
  currentUserId: number;
  onLoadMore?: () => void;
  hasMoreMessages?: boolean;
  isLoadingMessages?: boolean;
  onMarkAsRead?: (messageId: string) => void;
  containerHeight?: number;
}

// 🚀 단순하고 안정적인 채팅 목록 컴포넌트 (가상화 없이)
const VirtualChatList: React.FC<VirtualChatListProps> = ({
  messages,
  currentUserId,
  onLoadMore,
  hasMoreMessages = false,
  isLoadingMessages = false,
  onMarkAsRead,
  containerHeight = 400
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const isUserScrollingRef = useRef(false);
  
  // 🔧 스크롤 이벤트 핸들러 (성능 최적화)
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    
    // 사용자가 수동으로 스크롤하고 있는지 추적
    isUserScrollingRef.current = true;
    
    // 스크롤 완료 후 플래그 리셋
    setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 150);
    
    // 🔧 상단 도달시 더 많은 메시지 로드
    if (target.scrollTop === 0 && hasMoreMessages && !isLoadingMessages && onLoadMore) {
      onLoadMore();
    }
  }, [hasMoreMessages, isLoadingMessages, onLoadMore]);

  // 🔧 새 메시지 도착시 자동 스크롤 (단순하고 안정적인 버전)
  useEffect(() => {
    // 메시지가 새로 추가되었을 때만 처리
    if (containerRef.current && messages.length > prevMessagesLengthRef.current) {
      const container = containerRef.current;
      
      // 사용자가 수동으로 스크롤 중이면 자동 스크롤 안함
      if (isUserScrollingRef.current) {
        prevMessagesLengthRef.current = messages.length;
        return;
      }
      
      const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
      
      // 사용자가 하단 근처에 있거나 새로운 메시지가 내가 보낸 것이라면 자동 스크롤
      const lastMessage = messages[messages.length - 1];
      const isMyMessage = lastMessage?.senderId === currentUserId;
      
      if (isNearBottom || isMyMessage) {
        // 간단하고 자연스러운 스크롤
        requestAnimationFrame(() => {
          if (container) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'auto' // smooth 대신 auto로 즉시 이동
            });
          }
        });
      }
    }
    
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, currentUserId]);

  // 🔧 발신자 표시 여부 결정
  const shouldShowSender = useCallback((currentMessage: ChatMessage, index: number) => {
    if (currentMessage.senderId === currentUserId) return false;
    
    if (index === 0) return true;
    
    const prevMessage = messages[index - 1];
    return !prevMessage || prevMessage.senderId !== currentMessage.senderId;
  }, [currentUserId, messages]);

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-auto p-4"
      style={{ 
        // 🚀 스크롤 성능 최적화
        scrollBehavior: 'auto',
        willChange: 'scroll-position',
        transform: 'translateZ(0)' // GPU 가속 활성화
      }}
      onScroll={handleScroll}
    >
      {/* 🔧 상단 로딩 인디케이터 */}
      {isLoadingMessages && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* 🚀 모든 메시지 렌더링 (단순하고 안정적) */}
      <div className="space-y-2">
        {messages.map((message, index) => {
          const isMe = message.senderId === currentUserId;
          
          // 디버깅: 메시지 소유권 확인
          if (process.env.NODE_ENV === 'development') {
            console.log(`메시지 #${index}:`, {
              messageId: message.messageId,
              senderId: message.senderId,
              currentUserId,
              isMe,
              senderName: message.senderName,
              content: message.content?.substring(0, 20) + '...'
            });
          }
          
          return (
            <div key={message.messageId} className="w-full">
              <OptimizedChatMessage
                message={message}
                isMe={isMe}
                showSender={shouldShowSender(message, index)}
                currentUserId={currentUserId}
                onMarkAsRead={onMarkAsRead}
              />
            </div>
          );
        })}
      </div>

      {/* 🔧 메시지가 없을 때 */}
      {messages.length === 0 && !isLoadingMessages && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">💬</div>
          <p className="text-gray-500">아직 메시지가 없습니다.</p>
          <p className="text-gray-400 text-sm">첫 번째 메시지를 보내보세요!</p>
        </div>
      )}
    </div>
  );
};

export default VirtualChatList;