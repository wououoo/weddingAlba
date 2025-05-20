import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostingItem } from './types/types';
import { formatPrice } from './utils';
import SearchBar from './SearchBar';
import TabNavigation from './TabNavigation';
import PostingCard from './PostingCard';
import BottomNavigation from './BottomNavigation';
import FloatingButton from './FloatingButton';
import { useHost } from './hooks';
import './HostStyles.css';

const Host: React.FC = () => {
  // 커스텀 훅에서 상태와 핸들러 가져오기
  const {
    activeTab,
    postings,
    isLoading,
    error,
    searchKeyword,
    handleTabChange,
    handleSearch,
    handleAddPosting
  } = useHost();
  
  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      {/* 상단 검색바 */}
      <SearchBar onSearch={handleSearch} />
      
      {/* 탭 네비게이션 */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
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
        ) : postings.length > 0 ? (
          <div className="space-y-4 px-4">
            {postings.map((posting) => (
              <PostingCard key={posting.id} posting={posting} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {
              searchKeyword 
                ? `'${searchKeyword}'에 대한 검색 결과가 없습니다.` 
                : '모집글이 없습니다.'
            }
          </div>
        )}
      </div>
      
      {/* 플로팅 버튼 */}
      <FloatingButton onClick={handleAddPosting} />
      
      {/* 네비게이션 바 */}
      <BottomNavigation />
    </div>
  );
};

export default Host;