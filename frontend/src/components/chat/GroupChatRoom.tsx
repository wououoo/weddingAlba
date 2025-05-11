import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// 샘플 채팅 데이터
interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
}

interface ChatRoomInfo {
  id: number;
  title: string;
  participants: number;
  date: string;
  location: string;
}

const sampleChatRooms: Record<string, ChatRoomInfo> = {
  '1': {
    id: 1,
    title: '강남 S웨딩홀 하객 모집',
    participants: 8,
    date: '2025.05.15',
    location: '서울 강남구'
  },
  '3': {
    id: 3,
    title: '분당 P컨벤션 하객 모집',
    participants: 5,
    date: '2025.05.05',
    location: '경기 성남시 분당구'
  }
};

const sampleMessages: Record<string, Message[]> = {
  '1': [
    { id: 1, sender: '김모집자', content: '안녕하세요, 강남 S웨딩홀 하객 모집 채팅방입니다.', time: '오전 10:00', isMe: false },
    { id: 2, sender: '이하객', content: '안녕하세요! 참여하게 되어 기쁩니다.', time: '오전 10:05', isMe: false },
    { id: 3, sender: '나', content: '안녕하세요~ 반갑습니다!', time: '오전 10:10', isMe: true },
    { id: 4, sender: '김모집자', content: '오후 1시까지 강남역 2번 출구로 모여주세요.', time: '오전 11:30', isMe: false },
    { id: 5, sender: '박하객', content: '네, 알겠습니다!', time: '오후 12:00', isMe: false },
    { id: 6, sender: '나', content: '저도 갈게요!', time: '오후 12:30', isMe: true }
  ],
  '3': [
    { id: 1, sender: '정모집자', content: '분당 P컨벤션 하객 모집 채팅방입니다.', time: '오전 9:00', isMe: false },
    { id: 2, sender: '이하객', content: '반갑습니다!', time: '오전 9:15', isMe: false },
    { id: 3, sender: '나', content: '안녕하세요~', time: '오전 9:20', isMe: true },
    { id: 4, sender: '정모집자', content: '참석 인원 확인 부탁드립니다.', time: '오전 10:00', isMe: false }
  ]
};

const GroupChatRoom: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomInfo, setRoomInfo] = useState<ChatRoomInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 채팅방 및 메시지 로드
  useEffect(() => {
    if (roomId && sampleChatRooms[roomId]) {
      setRoomInfo(sampleChatRooms[roomId]);
      setMessages(sampleMessages[roomId] || []);
    }
  }, [roomId]);

  // 메시지 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송 핸들러
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      sender: '나',
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  // 엔터키로 메시지 전송
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!roomInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

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
          <h1 className="font-bold">{roomInfo.title}</h1>
          <p className="text-xs text-gray-500">
            {roomInfo.date} • {roomInfo.location} • 참여자 {roomInfo.participants}명
          </p>
        </div>
        <button className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-auto p-4 bg-gray-100">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
          >
            {!msg.isMe && (
              <div className="mr-2 flex-shrink-0">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            )}
            <div className={`max-w-[70%]`}>
              {!msg.isMe && <div className="text-xs text-gray-600 mb-1">{msg.sender}</div>}
              <div className="flex items-end">
                {msg.isMe && <div className="text-xs text-gray-500 mr-2">{msg.time}</div>}
                <div className={`rounded-lg py-2 px-3 ${msg.isMe ? 'bg-purple-600 text-white' : 'bg-white'}`}>
                  {msg.content}
                </div>
                {!msg.isMe && <div className="text-xs text-gray-500 ml-2">{msg.time}</div>}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex">
          <button className="p-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            type="text"
            className="flex-1 border-0 focus:ring-0 px-3"
            placeholder="메시지 입력..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className={`p-2 rounded-full ${message.trim() ? 'text-purple-600' : 'text-gray-400'}`}
            onClick={handleSendMessage}
            disabled={!message.trim()}
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