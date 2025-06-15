import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppFooter } from '../Common';

// 샘플 채팅방 데이터
const sampleChatRooms = [
  {
    id: 1,
    type: 'group',
    title: '강남 S웨딩홀 하객 모집',
    lastMessage: '네, 알겠습니다!',
    lastMessageTime: '오후 2:30',
    unreadCount: 3,
    participants: 8,
    date: '2025.05.15',
    location: '서울 강남구'
  },
  {
    id: 2,
    type: 'private',
    title: '김모집자',
    lastMessage: '어디로 가면 될까요?',
    lastMessageTime: '오전 11:45',
    unreadCount: 0,
    role: '모집자',
    postingTitle: '송파 L호텔 하객 구함'
  },
  {
    id: 3,
    type: 'group',
    title: '분당 P컨벤션 하객 모집',
    lastMessage: '참석 인원 확인 부탁드립니다.',
    lastMessageTime: '어제',
    unreadCount: 0,
    participants: 5,
    date: '2025.05.05',
    location: '경기 성남시 분당구'
  },
  {
    id: 4,
    type: 'private',
    title: '이하객',
    lastMessage: '넵, 제가 먼저 가있겠습니다.',
    lastMessageTime: '3일 전',
    unreadCount: 0,
    role: '신청자',
    postingTitle: '강남 S웨딩홀 하객 모집'
  }
];

const ChatListPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'group' | 'private'>('all');
  
  // 활성화된 탭에 따라 채팅방 필터링
  const filteredChatRooms = sampleChatRooms.filter(room => {
    if (activeTab === 'all') return true;
    return room.type === activeTab;
  });

  // 채팅방 클릭 핸들러
  const handleChatRoomClick = (roomId: number, type: string) => {
    if (type === 'group') {
      navigate(`/chat/group/${roomId}`);
    } else {
      navigate(`/chat/private/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-bold">채팅</h1>
        <button className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex bg-white border-b border-gray-200">
        <button 
          className={`flex-1 py-3 ${activeTab === 'all' ? 'text-purple-600 border-b-2 border-purple-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('all')}
        >
          전체
        </button>
        <button 
          className={`flex-1 py-3 ${activeTab === 'group' ? 'text-purple-600 border-b-2 border-purple-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('group')}
        >
          단체
        </button>
        <button 
          className={`flex-1 py-3 ${activeTab === 'private' ? 'text-purple-600 border-b-2 border-purple-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('private')}
        >
          개인
        </button>
      </div>

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-auto pb-20">
        {filteredChatRooms.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredChatRooms.map((room) => (
              <div 
                key={room.id} 
                className="bg-white p-4 flex cursor-pointer hover:bg-gray-50"
                onClick={() => handleChatRoomClick(room.id, room.type)}
              >
                {/* 프로필 이미지 */}
                <div className="relative mr-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {room.type === 'group' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  {room.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {room.unreadCount}
                    </div>
                  )}
                </div>
                
                {/* 채팅방 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold truncate">{room.title}</h3>
                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{room.lastMessageTime}</span>
                  </div>
                  
                  {room.type === 'group' ? (
                    <p className="text-xs text-gray-500 mt-1">
                      {room.date} • {room.location} • 참여자 {room.participants}명
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      {room.role} • {room.postingTitle}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-600 mt-1 truncate">{room.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500">채팅방이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 푸터 */}
      <AppFooter />
    </div>
  );
};

export default ChatListPage;