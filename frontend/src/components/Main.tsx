import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 하객 알바 게시글 인터페이스
interface PostingItem {
  id: number;
  title: string;
  location: string;
  price: number;
  date: string;
  time: string;
  requiredPeople: number;
  currentPeople: number;
  tags: string[];
}

const Main: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'recommended' | 'recent' | 'popular' | 'all'>('all');
  const [postings, setPostings] = useState<PostingItem[]>([]);
  
  // 실제 구현에서는 API 호출로 대체
  useEffect(() => {
    // 더미 데이터
    const dummyPostings: PostingItem[] = [
      {
        id: 1,
        title: '강남 S웨딩홀 하객 구합니다',
        location: '서울 강남구',
        price: 100000,
        date: '2025.05.15',
        time: '13:00',
        requiredPeople: 5,
        currentPeople: 0,
        tags: ['남녀혼합', '정장필수', '교통비포함']
      },
      {
        id: 2,
        title: '송파 L호텔 하객 급구',
        location: '서울 송파구',
        price: 120000,
        date: '2025.04.28',
        time: '11:30',
        requiredPeople: 3,
        currentPeople: 0,
        tags: ['여성우대', '20~30대', '식사제공']
      },
      {
        id: 3,
        title: '분당 P컨벤션 하객 모집',
        location: '경기 성남시 분당구',
        price: 90000,
        date: '2025.05.05',
        time: '14:00',
        requiredPeople: 8,
        currentPeople: 0,
        tags: ['남성우대', '정장여가능', '교통비별도']
      }
    ];
    
    setPostings(dummyPostings);
  }, []);
  
  const handleTabChange = (tab: 'recommended' | 'recent' | 'popular' | 'all') => {
    setActiveTab(tab);
    // 실제 구현에서는 탭에 따라 다른 API 호출
  };
  
  const handlePostingClick = (id: number) => {
    navigate(`/posting/${id}`);
  };
  
  const handleAddPosting = () => {
    navigate('/posting/create');
  };
  
  const formatPrice = (price: number): string => {
    return `${price.toLocaleString()}원`;
  };
  
  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      {/* 상단 검색바 */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-purple-700">하객알바</h1>
            <div className="relative flex-1 mx-4">
              <input
                type="text"
                placeholder="지역, 날짜, 보수 등으로 검색"
                className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg
                className="w-5 h-5 absolute right-3 top-2.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button className="text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 탭 네비게이션 */}
      <div className="bg-white shadow-md mb-4">
        <div className="container mx-auto">
          <div className="flex text-sm overflow-x-auto">
            <button
              className={`px-4 py-3 font-medium ${activeTab === 'all' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
              onClick={() => handleTabChange('all')}
            >
              전체보기
            </button>
            <button
              className={`px-4 py-3 font-medium ${activeTab === 'recommended' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
              onClick={() => handleTabChange('recommended')}
            >
              내 주변
            </button>
            <button
              className={`px-4 py-3 font-medium ${activeTab === 'recent' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
              onClick={() => handleTabChange('recent')}
            >
              주말
            </button>
            <button
              className={`px-4 py-3 font-medium ${activeTab === 'popular' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
              onClick={() => handleTabChange('popular')}
            >
              높은 보수
            </button>
            <button className="px-4 py-3 font-medium text-gray-500">
              급구
            </button>
          </div>
        </div>
      </div>
      
      {/* 게시글 목록 */}
      <div className="container mx-auto">
        <h2 className="text-lg font-semibold mb-4 px-4">추천 모집글</h2>
        <div className="space-y-4 px-4">
          {postings.map((posting) => (
            <div 
              key={posting.id} 
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
              onClick={() => handlePostingClick(posting.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg mb-1">{posting.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{posting.location}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{`${posting.date} (${posting.time})`}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {posting.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-purple-600 font-bold">{formatPrice(posting.price)}</span>
                  <div className="text-sm text-gray-500 mt-2">
                    모집 인원: <span className="font-medium">{posting.requiredPeople}명</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button className="text-white bg-purple-600 px-3 py-1 rounded-md text-sm hover:bg-purple-700" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/apply/${posting.id}`);
                  }}
                >
                  신청하기
                </button>
                <button className="ml-2 text-gray-500 border border-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    // 찜하기 기능
                  }}
                >
                  찜하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 플로팅 버튼 */}
      <div className="fixed bottom-16 right-4">
        <button
          className="bg-purple-600 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
          onClick={handleAddPosting}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      
      {/* 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
        <div className="flex justify-around">
          <button className="flex flex-col items-center text-purple-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">홈</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs">채팅</span>
          </button>
          <div className="w-6"></div>
          <button className="flex flex-col items-center text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-xs">찜</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">내 정보</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;