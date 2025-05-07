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
    <div className="bg-gray-100 min-h-screen">
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
      <div className="fixed bottom-24 right-4">
        <button
          className="bg-purple-600 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
          onClick={handleAddPosting}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Main;