import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BookmarkItem from './BookmarkItem';
import BookmarkMemoModal from './BookmarkMemoModal';
import { Toast, useToast } from '../toast';
import { get, put, post, del } from '../../../utils/httpClient';

interface BookmarkListProps {
  className?: string;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { toastState, showToast, hideToast } = useToast();
  const [bookmarkItems, setBookmarkItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [editingMemo, setEditingMemo] = useState<{ bookmarkId: number; memo: string } | null>(null);
  const [isSavingMemo, setIsSavingMemo] = useState(false);
  
  // 렌더링 없이 삭제 상태 관리 (useRef 사용)
  const deletedItemsRef = useRef<Set<number>>(new Set());
  const pendingTimersRef = useRef<Map<number, { item: any; timeoutId: NodeJS.Timeout }>>(new Map());
  
  // 화면 업데이트용 강제 리렌더링 (필요시에만)
  const [, forceUpdate] = useState({});
  const triggerRerender = useCallback(() => {
    forceUpdate({});
  }, []);

  const itemsPerPage = 10;

  // 실제 북마크 해제 API 호출
  const performBookmarkRemoval = async (bookmarkId: number) => {
    try {
      const response = await del<any>(`/bookmarks/${bookmarkId}`);
      const isSuccess = response.success !== false;
      
      if (!isSuccess && response.success === false) {
        throw new Error(response.message || '북마크 해제에 실패했습니다.');
      }

      return true;
    } catch (error) {
      console.error('북마크 삭제 API 오류:', error);
      return false;
    }
  };

  // 되돌리기 처리
  const handleUndoRemoval = useCallback((bookmarkId: number) => {
    console.log(`북마크 ${bookmarkId} 되돌리기 시작`);
    
    const pendingItem = pendingTimersRef.current.get(bookmarkId);
    if (!pendingItem) {
      console.log(`되돌리기: 북마크 ${bookmarkId}를 pending에서 찾을 수 없음`);
      return;
    }

    // 타이머 취소
    clearTimeout(pendingItem.timeoutId);
    
    // 삭제 목록에서 제거
    deletedItemsRef.current.delete(bookmarkId);
    pendingTimersRef.current.delete(bookmarkId);
    
    // 총 개수 복원
    setTotalCount(prev => prev + 1);
    
    // 토스트 숨기기
    hideToast();
    
    // 화면 업데이트
    triggerRerender();
    
    console.log(`북마크 ${bookmarkId} 되돌리기 완료`);
  }, [hideToast, triggerRerender]);

  // 북마크 해제 (렌더링 없는 버전)
  const handleBookmarkRemove = useCallback((bookmarkId: number) => {
    console.log(`북마크 삭제 요청: ${bookmarkId}`);
    
    // 이미 삭제 대기 중이면 되돌리기
    if (deletedItemsRef.current.has(bookmarkId)) {
      console.log(`북마크 ${bookmarkId} 이미 삭제 대기 중 - 되돌리기`);
      handleUndoRemoval(bookmarkId);
      return;
    }

    // 해당 북마크 찾기
    const targetItem = bookmarkItems.find(item => item.bookmarkId === bookmarkId);
    if (!targetItem) {
      console.log(`북마크 ${bookmarkId}를 찾을 수 없음`);
      return;
    }

    console.log(`북마크 ${bookmarkId} 삭제 처리 시작`);

    // 백업 아이템 생성
    const backupItem = {
      ...targetItem,
      posting: { ...targetItem.posting },
      isBookmarked: true
    };

    // 1. 삭제 목록에 추가 (렌더링 없음)
    deletedItemsRef.current.add(bookmarkId);
    
    // 2. 총 개수 감소
    setTotalCount(prev => {
      const newCount = prev - 1;
      console.log(`총 개수 변경: ${prev} -> ${newCount}`);
      return newCount;
    });

    // 3. 토스트 표시
    showToast(
      '북마크가 해제되었습니다',
      '되돌리기',
      () => handleUndoRemoval(bookmarkId)
    );

    // 4. 타이머 설정
    const timeoutId = setTimeout(async () => {
      console.log(`북마크 ${bookmarkId} API 삭제 시작`);
      const success = await performBookmarkRemoval(bookmarkId);
      
      if (success) {
        console.log(`북마크 ${bookmarkId} API 삭제 성공`);
        // 성공: 실제 목록에서 제거
        setBookmarkItems(prev => prev.filter(item => item.bookmarkId !== bookmarkId));
      } else {
        console.log(`북마크 ${bookmarkId} API 삭제 실패 - 복원`);
        // 실패: 삭제 목록에서 제거하여 복원
        deletedItemsRef.current.delete(bookmarkId);
        setTotalCount(prev => prev + 1);
        triggerRerender(); // 화면 업데이트
        alert('북마크 해제에 실패했습니다. 다시 시도해주세요.');
      }
      
      // pending에서 제거
      pendingTimersRef.current.delete(bookmarkId);
      console.log(`북마크 ${bookmarkId} pending에서 제거`);
    }, 4000);

    // 5. pending에 추가
    pendingTimersRef.current.set(bookmarkId, { item: backupItem, timeoutId });
    console.log(`북마크 ${bookmarkId} pending에 추가`);

    // 6. 화면 업데이트 (삭제된 것처럼 보이게)
    triggerRerender();
    
  }, [bookmarkItems, handleUndoRemoval, showToast, triggerRerender]);

  // 북마크 목록 가져오기
  const fetchBookmarks = async (page: number = 1, append: boolean = false) => {
    setIsLoading(true);
    try {
      const currentScrollY = append ? window.scrollY : 0;
      
      const response = await get<any>(`/bookmarks?page=${page}&limit=${itemsPerPage}`);
            
      const isSuccess = response.success !== false && response.data !== null && response.data !== undefined;
      
      if (!isSuccess) {
        if (response.message && (
          response.message.includes('없습니다') || 
          response.message.includes('존재하지 않습니다') ||
          response.message.includes('찾을 수 없습니다') ||
          response.message.includes('404')
        )) {
          setBookmarkItems([]);
          setTotalCount(0);
          setHasMore(false);
          setCurrentPage(1);
          return;
        }
        throw new Error(response.message || '북마크 목록을 불러오는데 실패했습니다.');
      }

      let apiResponse;
      if (response.data && response.data.data) {
        apiResponse = response.data;
      } else if (response.data && Array.isArray(response.data)) {
        apiResponse = response;
      } else {
        apiResponse = response;
      }

      if (!apiResponse.data || apiResponse.data.length === 0) {
        if (append && page > 1) {
          setHasMore(false);
        } else {
          setBookmarkItems([]);
          setTotalCount(apiResponse.totalCount || 0);
          setHasMore(apiResponse.hasMore || false);
          setCurrentPage(apiResponse.currentPage || 1);
        }
        return;
      }

      const mappedData = apiResponse.data.map((bookmark: any) => ({
        bookmarkId: bookmark.bookmarkId,
        postingId: bookmark.postingId,
        marcDate: bookmark.marcDate,
        userId: bookmark.userId,
        memo: bookmark.memo,
        posting: {
          postingId: bookmark.posting.postingId,
          title: bookmark.posting.title,
          appointmentDatetime: bookmark.posting.appointmentDatetime,
          location: bookmark.posting.location,
          isSelf: bookmark.posting.isSelf,
          personName: bookmark.posting.personName,
          personPhoneNumber: bookmark.posting.personPhoneNumber,
          hasMobileInvitation: bookmark.posting.hasMobileInvitation,
          registrationDatetime: bookmark.posting.registrationDatetime
        },
        isBookmarked: true
      }));

      if (append && page > 1) {
        setBookmarkItems(prev => [...prev, ...mappedData]);
      } else {
        setBookmarkItems(mappedData);
      }

      setTotalCount(apiResponse.totalCount || 0);
      setHasMore(apiResponse.hasMore || false);
      setCurrentPage(apiResponse.currentPage || page);

      if (append && currentScrollY > 0) {
        setTimeout(() => {
          window.scrollTo(0, currentScrollY);
        }, 50);
      }

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('ECONNABORTED')) {
          if (!append) {
            setBookmarkItems([]);
            setTotalCount(0);
            setHasMore(false);
            setCurrentPage(1);
          }
          return;
        }
        
        if (error.message.includes('없습니다') || 
            error.message.includes('404') ||
            error.message.includes('존재하지 않습니다') ||
            error.message.includes('찾을 수 없습니다')) {
          if (!append) {
            setBookmarkItems([]);
            setTotalCount(0);
            setHasMore(false);
            setCurrentPage(1);
          }
          return;
        }
        
        alert('북마크 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      if (!append) {
        setBookmarkItems([]);
        setTotalCount(0);
        setHasMore(false);
        setCurrentPage(1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 더보기 버튼 클릭
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchBookmarks(currentPage + 1, true);
    }
  };

  // 메모 수정 시작
  const handleEditMemo = (item: any) => {
    setEditingMemo({ 
      bookmarkId: item.bookmarkId, 
      memo: item.memo || '' 
    });
  };

  // 모달에서 메모 삭제
  const handleDeleteMemoFromModal = async () => {
    if (!editingMemo) return;
    
    try {
      const response = await del<any>(`/bookmarks/${editingMemo.bookmarkId}/memo`);
      
      let isSuccess = false;
      
      if (response.success === true && response.data) {
        isSuccess = true;
      } else if ((response as any).bookmarkId) {
        isSuccess = true;
      } else if (response.data && (response.data as any).bookmarkId) {
        isSuccess = true;
      }
      
      if (!isSuccess) {
        throw new Error('메모 삭제에 실패했습니다.');
      }

      setBookmarkItems(prev => prev.map(item => 
        item.bookmarkId === editingMemo.bookmarkId 
          ? { ...item, memo: null }
          : item
      ));

      setEditingMemo(null);
      alert('메모가 성공적으로 삭제되었습니다.');
    } catch (error) {
      alert('메모 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 메모 저장
  const handleSaveMemo = async () => {
    if (!editingMemo || isSavingMemo) return;

    setIsSavingMemo(true);
    try {      
      const response = await put<any>(`/bookmarks/${editingMemo.bookmarkId}/memo`, {
        memo: editingMemo.memo
      });
      
      let isSuccess = false;
      
      if (response.success === true && response.data) {
        isSuccess = true;
      } else if ((response as any).bookmarkId) {
        isSuccess = true;
      } else if (response.data && (response.data as any).bookmarkId) {
        isSuccess = true;
      }
      
      if (!isSuccess) {
        throw new Error('메모 저장에 실패했습니다.');
      }

      setBookmarkItems(prev => prev.map(item => 
        item.bookmarkId === editingMemo.bookmarkId 
          ? { ...item, memo: editingMemo.memo }
          : item
      ));

      setEditingMemo(null);
      alert('메모가 성공적으로 저장되었습니다.');
    } catch (error) {
      alert('메모 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSavingMemo(false);
    }
  };

  // 메모 삭제
  const handleDeleteMemo = async (bookmarkId: number) => {
    if (!window.confirm('메모를 삭제하시겠습니까?')) return;

    try {
      const response = await del<any>(`/bookmarks/${bookmarkId}/memo`);
      
      let isSuccess = false;
      
      if (response.success === true && response.data) {
        isSuccess = true;
      } else if ((response as any).bookmarkId) {
        isSuccess = true;
      } else if (response.data && (response.data as any).bookmarkId) {
        isSuccess = true;
      }
            
      if (!isSuccess) {
        throw new Error('메모 삭제에 실패했습니다.');
      }

      setBookmarkItems(prev => prev.map(item => 
        item.bookmarkId === bookmarkId 
          ? { ...item, memo: null }
          : item
      ));

      alert('메모가 성공적으로 삭제되었습니다.');
    } catch (error) {
      alert('메모 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 게시글 상세 이동
  const handlePostingClick = (postingId: number) => {
    navigate(`/postings/${postingId}`);
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchBookmarks(1, false);
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      pendingTimersRef.current.forEach(({ timeoutId }) => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  // 로딩 상태
  if (isLoading && bookmarkItems.length === 0) {
    return (
      <div className={`flex items-center justify-center py-10 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">북마크 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 빈 상태
  if (bookmarkItems.length === 0) {
    return (
      <div className={`text-center text-gray-500 py-10 ${className}`}>
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-400 mb-2">북마크한 내역이 없습니다</p>
        <p className="text-sm text-gray-400">관심 있는 결혼식을 북마크해보세요!</p>
      </div>
    );
  }

  // 화면에 표시할 아이템들 (삭제 대기 중인 것들은 회색으로 표시)
  const visibleItems = bookmarkItems.map(item => ({
    ...item,
    // 삭제 대기 중이면 isBookmarked를 false로 설정 (회색으로 표시됨)
    isBookmarked: !deletedItemsRef.current.has(item.bookmarkId)
  }));
  
  // 실제로 보이는 (삭제되지 않은) 개수
  const activeCount = bookmarkItems.filter(item => !deletedItemsRef.current.has(item.bookmarkId)).length;

  return (
    <div className={className}>
      <div className="mb-4 text-sm text-gray-600">
        총 {totalCount}개 중 {activeCount}개를 북마크했습니다.
      </div>
      
      <div className="space-y-4">
        {visibleItems.map((item, index) => (
          <BookmarkItem
            key={`${item.bookmarkId}-${index}`}
            item={item}
            onPostingClick={handlePostingClick}
            onEditMemo={handleEditMemo}
            onDeleteMemo={handleDeleteMemo}
            onBookmarkRemove={handleBookmarkRemove}
          />
        ))}
      </div>
      
      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white inline-block mr-2"></div>
                로딩 중...
              </>
            ) : (
              `더보기 (${totalCount - bookmarkItems.length}개 더)`
            )}
          </button>
        </div>
      )}

      {/* 메모 편집 모달 */}
      {editingMemo && (
        <BookmarkMemoModal
          editingMemo={editingMemo}
          isSaving={isSavingMemo}
          onSave={handleSaveMemo}
          onCancel={() => setEditingMemo(null)}
          onChange={(memo) => setEditingMemo(prev => prev ? { ...prev, memo } : null)}
          onDelete={handleDeleteMemoFromModal}
        />
      )}

      {/* 토스트 */}
      <Toast
        isVisible={toastState.isVisible}
        message={toastState.message}
        actionText={toastState.actionText}
        onAction={toastState.onAction}
        onClose={hideToast}
      />
    </div>
  );
};

export default BookmarkList;