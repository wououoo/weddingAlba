import React, { useState, useEffect } from 'react';
import { PostingItem, TabType } from './MainTypes';
import { fetchPostings } from './MainUtils';
import SearchBar from './SearchBar';
import TabNavigation from './TabNavigation';
import PostingCard from './PostingCard';
import BottomNavigation from './BottomNavigation';
import FloatingButton from './FloatingButton';
import './MainStyles.css';

const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [postings, setPostings] = useState<PostingItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  
  useEffect(() => {
    const loadPostings = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPostings(activeTab);
        setPostings(data);
      } catch (error) {
        console.error('Error fetching postings', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPostings();
  }, [activeTab]);
  
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };
  
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    // 실제 구현 시 검색 API 호출
  };
  
  // 필터링된 게시글 목록
  const filteredPostings = searchKeyword 
    ? postings.filter(post => 
        post.title.includes(searchKeyword) || 
        post.location.includes(searchKeyword) ||
        post.tags.some(tag => tag.includes(searchKeyword))
      )
    : postings;
  
  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      {/* 상단 검색바 */}
      <SearchBar onSearch={handleSearch} />
      
      {/* 탭 네비게이션 */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* 게시글 목록 */}
      <div className="container mx-auto">
        <h2 className="text-lg font-semibold mb-4 px-4">
          {activeTab === 'all' && '전체 모집글'}
          {activeTab === 'recommended' && '내 주변 모집글'}
          {activeTab === 'recent' && '주말 모집글'}
          {activeTab === 'popular' && '높은 보수 모집글'}
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          </div>
        ) : filteredPostings.length > 0 ? (
          <div className="space-y-4 px-4">
            {filteredPostings.map((posting) => (
              <PostingCard key={posting.id} posting={posting} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchKeyword 
              ? `'${searchKeyword}'에 대한 검색 결과가 없습니다.` 
              : '모집글이 없습니다.'}
          </div>
        )}
      </div>
      
      {/* 플로팅 버튼 */}
      <FloatingButton />
      
      {/* 네비게이션 바 */}
      <BottomNavigation />
    </div>
  );
};

export default MainPage;