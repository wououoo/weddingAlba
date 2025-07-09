import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppFooter } from '../common';
import { useChatRooms } from './hooks/useChatRoom';
import { ChatRoom } from './api/chatApi';

const formatTimeAgo = (timestamp: string): string => {
  // timestamp 유효성 검사
  if (!timestamp || timestamp === 'Invalid Date') {
    return '';
  }
  
  try {
    const now = new Date();
    const messageTime = new Date(timestamp);
    
    // 날짜가 유효한지 확인
    if (isNaN(messageTime.getTime())) {
      console.warn('Invalid timestamp:', timestamp);
      return '';
    }
    
    const diffInMs = now.getTime() - messageTime.getTime();
    
    // 미래 시간인 경우 (서버 시간과 클라이언트 시간 차이)
    if (diffInMs < 0) {
      return '방금 전';
    }
    
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    // 1주일 이상인 경우 날짜 형식으로 표시
    return messageTime.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error, 'timestamp:', timestamp);
    return '시간 미상';
  }
};

const ChatRoomItem: React.FC<{ 
  room: ChatRoom; 
  onClick: (roomId: number, type: string) => void;
}> = ({ room, onClick }) => {
  const isGroup = room.type === 'GROUP' || room.type === 'PUBLIC';
  
  // JWT 토큰에서 사용자 ID 추출 (실제로는 hook이나 context에서)
  // 서버에서 토큰으로 처리하므로 더 이상 필요 없음
  const getCurrentUserId = () => {
    // 토큰 기반에서는 서버가 알아서 처리
    return 0; // 임시값
  };
  
  const currentUserId = getCurrentUserId();
  
  // 안전한 날짜 처리 - lastActiveAt 기준으로 변경
  const getLastActiveTime = () => {
    // lastActiveAt > lastMessageAt > createdAt 순으로 우선순위
    const timestamp = room.lastActiveAt || room.lastMessageAt || room.createdAt;
    if (!timestamp) {
      return ''; // 빈 문자열로 변경 (시간 미상 제거)
    }
    return formatTimeAgo(timestamp);
  };
  
  // 개인 채팅방의 경우 상대방 이름 표시 (프로필 이름 우선)
  const getDisplayName = () => {
    if (isGroup) {
      return room.roomName;
    } else {
      // 1:1 채팅방에서 상대방 이름 반환
      if (room.hostUserId === currentUserId) {
        // 내가 호스트인 경우 -> 게스트 정보 표시
        const displayName = room.guestNickname || room.guestName;
        return displayName || '게스트';
      } else {
        // 내가 게스트인 경우 -> 호스트 정보 표시
        const displayName = room.hostNickname || room.hostName;
        return displayName || '호스트';
      }
    }
  };

  const getSubInfo = () => {
    if (isGroup) {
      return `참여자 ${room.participantCount || 0}명`;
    } else {
      return room.type === 'PERSONAL' ? '1:1 채팅' : '개인 채팅';
    }
  };

  // 디버깅: 안읽은 메시지 개수 로그
  console.log('ChatRoom unreadMessageCount:', {
    chatRoomId: room.chatRoomId,
    unreadMessageCount: room.unreadMessageCount,
    type: typeof room.unreadMessageCount,
    condition: (room.unreadMessageCount ?? 0) > 0
  });

  // 안전한 안읽은 메시지 개수 처리
  const hasUnreadMessages = () => {
    const count = room.unreadMessageCount;
    if (count === undefined || count === null) return false;
    if (typeof count === 'string') return parseInt(count, 10) > 0;
    if (typeof count === 'number') return count > 0;
    return false;
  };

  return (
    <div 
      className="bg-white p-4 flex cursor-pointer hover:bg-gray-50 border-b border-gray-100"
      onClick={() => onClick(room.chatRoomId, room.type.toLowerCase())}
    >
      {/* 프로필 이미지 */}
      <div className="relative mr-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          {isGroup ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
      </div>
      
      {/* 채팅방 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className={`font-semibold truncate ${
            hasUnreadMessages() ? 'text-gray-900' : 'text-gray-700'
          }`}>
            {getDisplayName()}
          </h3>
          <div className="flex items-center ml-2 flex-shrink-0">
            {/* 시간 표시 - 시간이 있을 때만 표시 */}
            {getLastActiveTime() && (
              <span className="text-xs text-gray-400">
                {getLastActiveTime()}
              </span>
            )}
            
            {/* 안읽은 메시지 배지 - 크기 증가 */}
            {hasUnreadMessages() && (
              <div className="ml-2 bg-red-500 text-white text-sm font-bold rounded-full min-w-[24px] h-6 flex items-center justify-center px-2">
                {(room.unreadMessageCount! > 99) ? '99+' : room.unreadMessageCount}
              </div>
            )}
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-1">
          {getSubInfo()}
        </p>
        
        {room.lastMessage && (
          <p className={`text-sm mt-1 truncate ${
            hasUnreadMessages() ? 'text-gray-900 font-medium' : 'text-gray-600'
          }`}>
            {room.lastMessageSender && room.lastMessageSender !== '나' && (
              <span className="font-medium">{room.lastMessageSender}: </span>
            )}
            {room.lastMessage}
          </p>
        )}
      </div>
    </div>
  );
};

const ChatListPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'group' | 'private'>('all');
  
  // 토큰 기반 인증으로 수정된 후 - 사용자 ID 불필요
  const { chatRooms, isLoading, error, refresh } = useChatRooms();
  
  // 활성화된 탭에 따라 채팅방 필터링
  const filteredChatRooms = chatRooms.filter(room => {
    if (activeTab === 'all') return true;
    if (activeTab === 'group') return room.type === 'GROUP' || room.type === 'PUBLIC';
    if (activeTab === 'private') return room.type === 'PERSONAL';
    return true;
  });

  // 채팅방 클릭 핸들러
  const handleChatRoomClick = (roomId: number, type: string) => {
    if (type === 'group' || type === 'public') {
      navigate(`/chat/group/${roomId}`);
    } else {
      navigate(`/chat/private/${roomId}`);
    }
  };

  // 에러 재시도
  const handleRetry = () => {
    refresh();
  };

  // 새로고침
  const handleRefresh = () => {
    refresh();
  };

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-bold">채팅</h1>
          <button onClick={handleRefresh} className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* 에러 메시지 */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button 
            onClick={handleRetry}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            다시 시도
          </button>
        </div>

        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-bold">채팅</h1>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh} 
            className="p-2"
            disabled={isLoading}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex bg-white border-b border-gray-200">
        <button 
          className={`flex-1 py-3 ${activeTab === 'all' ? 'text-purple-600 border-b-2 border-purple-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('all')}
        >
          전체 {chatRooms.length > 0 && `(${chatRooms.length})`}
        </button>
        <button 
          className={`flex-1 py-3 ${activeTab === 'group' ? 'text-purple-600 border-b-2 border-purple-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('group')}
        >
          단체 {chatRooms.filter(r => r.type === 'GROUP' || r.type === 'PUBLIC').length > 0 && 
            `(${chatRooms.filter(r => r.type === 'GROUP' || r.type === 'PUBLIC').length})`}
        </button>
        <button 
          className={`flex-1 py-3 ${activeTab === 'private' ? 'text-purple-600 border-b-2 border-purple-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('private')}
        >
          개인 {chatRooms.filter(r => r.type === 'PERSONAL').length > 0 && 
            `(${chatRooms.filter(r => r.type === 'PERSONAL').length})`}
        </button>
      </div>

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-auto pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-500">채팅방 목록을 불러오는 중...</p>
          </div>
        ) : filteredChatRooms.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredChatRooms.map((room) => (
              <ChatRoomItem
                key={room.chatRoomId}
                room={room}
                onClick={handleChatRoomClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500">
              {activeTab === 'all' && '채팅방이 없습니다.'}
              {activeTab === 'group' && '참여 중인 단체 채팅방이 없습니다.'}
              {activeTab === 'private' && '개인 채팅방이 없습니다.'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              새로운 하객 모집글에 참여하여 채팅을 시작해보세요.
            </p>
          </div>
        )}
      </div>

      {/* 푸터 */}
      <AppFooter />
    </div>
  );
};

export default ChatListPage;
