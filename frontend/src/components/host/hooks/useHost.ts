// useHost.ts - 호스트 화면에서 사용하는 로직을 담는 커스텀 훅
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabType, PostingItem } from '../types/types';
import { hostApi } from '../api/hostApi';

export function useHost() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [postings, setPostings] = useState<PostingItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  
  // 게시글 데이터 로드
  useEffect(() => {
    const loadPostings = async () => {
      setIsLoading(true);
      try {
        const response = await hostApi.getPostings(activeTab);
        
        if (response.success && response.data) {
          setPostings(response.data);
          setError(null);
        } else {
          setError(response.message || '게시글 목록을 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('게시글 로딩 오류:', error);
        setError('게시글 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPostings();
  }, [activeTab]);
  
  // 탭 변경 핸들러
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };
  
  // 검색 핸들러
  const handleSearch = async (keyword: string) => {
    setSearchKeyword(keyword);
    
    if (!keyword.trim()) {
      // 검색어가 없는 경우 모든 게시글 표시
      const response = await hostApi.getPostings(activeTab);
      if (response.success && response.data) {
        setPostings(response.data);
      }
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await hostApi.searchPostings(keyword);
      
      if (response.success && response.data) {
        setPostings(response.data);
        setError(null);
      } else {
        setError(response.message || '검색 결과를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 게시글 클릭 핸들러
  const handlePostingClick = (id: number) => {
    navigate(`/posting/${id}`);
  };
  
  // 신청하기 버튼 클릭 핸들러
  const handleApplyClick = (id: number) => {
    navigate(`/apply/${id}`);
  };
  
  // 찜하기 버튼 클릭 핸들러
  const handleBookmarkClick = async (id: number) => {
    try {
      const response = await hostApi.bookmarkPosting(id);
      
      if (response.success) {
        alert('게시글을 찜 목록에 추가했습니다.');
      } else {
        alert(response.message || '찜하기에 실패했습니다.');
      }
    } catch (error) {
      console.error('찜하기 오류:', error);
      alert('찜하기 처리 중 오류가 발생했습니다.');
    }
  };
  
  // 게시글 작성 버튼 클릭 핸들러
  const handleAddPosting = () => {
    navigate('/posting/create');
  };
  
  // 필터링된 게시글 목록
  const filteredPostings = searchKeyword 
    ? postings.filter(post => 
        post.title.includes(searchKeyword) || 
        post.location.includes(searchKeyword) ||
        post.tags.some(tag => tag.includes(searchKeyword))
      )
    : postings;
  
  return {
    // 상태
    activeTab,
    postings: filteredPostings,
    isLoading,
    error,
    searchKeyword,
    
    // 핸들러
    handleTabChange,
    handleSearch,
    handlePostingClick,
    handleApplyClick,
    handleBookmarkClick,
    handleAddPosting,
    
    // 네비게이션
    navigate
  };
}