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
  
  // 삭제된 북마크를 일시적으로 저장하는 상태
  const [pendingRemoval, setPendingRemoval] = useState<{ bookmarkId: number; item: any } | null>(null);
  const removalTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const itemsPerPage = 10;

  // 북마크 해제 되돌리기 (먼저 정의)
  const handleUndoRemoval = useCallback(() => {
   
    if (!pendingRemoval) {
      return;
    }


    // 타이머 취소
    if (removalTimeoutRef.current) {
      clearTimeout(removalTimeoutRef.current);
      removalTimeoutRef.current = null;
    }

    // 북마크 상태 복원
    setBookmarkItems(prev => {
      const updated = prev.map(item => 
        item.bookmarkId === pendingRemoval.bookmarkId 
          ? { ...pendingRemoval.item, isBookmarked: true }
          : item
      );
      return updated;
    });
    setTotalCount(prev => prev + 1);

    // 상태 초기화
    setPendingRemoval(null);
    hideToast();
    
  }, [pendingRemoval, hideToast]);

  // 실제 북마크 해제 API 호출
  const performBookmarkRemoval = async (bookmarkId: number) => {
    try {      
      const response = await del<any>(`/bookmarks/${bookmarkId}`);
      
      // 백엔드 응답 구조에 맞춰 수정: 200 응답이면 성공으로 처리
      const isSuccess = response.success !== false;
      
      if (!isSuccess && response.success === false) {
        throw new Error(response.message || '북마크 해제에 실패했습니다.');
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  // 북마크 해제 (토스트 방식)
  const handleBookmarkRemove = useCallback((bookmarkId: number) => {
    
    // 이미 삭제 대기 중인 아이템이라면 되돌리기 (현재 상태를 직접 참조)
    const currentPending = pendingRemoval;
    if (currentPending && currentPending.bookmarkId === bookmarkId) {
      handleUndoRemoval();
      return;
    }

    // 기존 타이머가 있다면 취소
    if (removalTimeoutRef.current) {
      clearTimeout(removalTimeoutRef.current);
    }

    // 해당 북마크 아이템 찾기
    const targetItem = bookmarkItems.find(item => item.bookmarkId === bookmarkId);
    if (!targetItem) {
      return;
    }



    // 메모리에 삭제될 아이템 저장 (딥 복사로 단절된 객체 생성)
    const backupItem = {
      ...targetItem,
      posting: { ...targetItem.posting },
      isBookmarked: true // 백업 시에는 항상 true로 저장
    };
    setPendingRemoval({ bookmarkId, item: backupItem });

    // UI에서 즉시 제거 (isBookmarked를 false로 설정)
    setBookmarkItems(prev => prev.map(item => 
      item.bookmarkId === bookmarkId 
        ? { ...item, isBookmarked: false }
        : item
    ));
    setTotalCount(prev => prev - 1);

    // 토스트 표시 (handleUndoRemoval을 직접 참조하지 않고 새로운 함수 생성)
    showToast(
      '북마크가 해제되었습니다',
      '되돌리기',
      () => {
        // pendingRemoval 상태를 직접 확인하지 않고 bookmarkId로 처리
        
        // 타이머 취소
        if (removalTimeoutRef.current) {
          clearTimeout(removalTimeoutRef.current);
          removalTimeoutRef.current = null;
        }

        // 북마크 상태 복원 (backupItem 사용)
        setBookmarkItems(prev => {
          const updated = prev.map(item => 
            item.bookmarkId === bookmarkId 
              ? { ...backupItem, isBookmarked: true }
              : item
          );
          return updated;
        });
        setTotalCount(prev => prev + 1);

        // 상태 초기화
        setPendingRemoval(null);
        hideToast();
      }
    );

    // 4초 후 실제 삭제 실행
    removalTimeoutRef.current = setTimeout(async () => {
      const success = await performBookmarkRemoval(bookmarkId);
      if (success) {
        // 성공 시 완전히 제거
        setBookmarkItems(prev => prev.filter(item => item.bookmarkId !== bookmarkId));
        setPendingRemoval(null);
        hideToast();
      } else {        
        // 북마크 상태 복원
        setBookmarkItems(prev => {
          const updated = prev.map(item => 
            item.bookmarkId === bookmarkId 
              ? { ...backupItem, isBookmarked: true }
              : item
          );
          return updated;
        });
        setTotalCount(prev => prev + 1);
        setPendingRemoval(null);
        hideToast();
        
        alert('북마크 해제에 실패했습니다. 다시 시도해주세요.');
      }
    }, 2000);
    
  }, [bookmarkItems, showToast, hideToast]);

  // 북마크 목록 가져오기
  const fetchBookmarks = async (page: number = 1, append: boolean = false) => {
    setIsLoading(true);
    try {
      const currentScrollY = append ? window.scrollY : 0;
      
      
      const response = await get<any>(`/bookmarks?page=${page}&limit=${itemsPerPage}`);
            
      // 백엔드 응답 구조에 맞춰 수정: success 필드가 없는 경우도 처리
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

      // 응답 데이터 구조 확인
      let apiResponse;
      if (response.data && response.data.data) {
        apiResponse = response.data;
      } else if (response.data && Array.isArray(response.data)) {
        apiResponse = response;
      } else {
        apiResponse = response;
      }

      // 빈 배열인 경우 정상적으로 처리
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

      // 데이터 매핑
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

      // 스크롤 위치 복원
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

  // 모달에서 메모 삭제 (전체 삭제 버튼용)
  const handleDeleteMemoFromModal = async () => {
    if (!editingMemo) return;
    
    try {
      
      const response = await del<any>(`/bookmarks/${editingMemo.bookmarkId}/memo`);
      
      
      // 백엔드에서 북마크 객체를 직접 반환하는 경우 처리
      let isSuccess = false;
      
      if (response.success === true && response.data) {
        isSuccess = true;
      } else if (response.bookmarkId) {
        isSuccess = true;
      } else if (response.data && response.data.bookmarkId) {
        isSuccess = true;
      }
      
      if (!isSuccess) {
        throw new Error('메모 삭제에 실패했습니다.');
      }

      // 성공적으로 삭제되면 상태 업데이트
      setBookmarkItems(prev => prev.map(item => 
        item.bookmarkId === editingMemo.bookmarkId 
          ? { ...item, memo: null }
          : item
      ));

      // 모달 닫기
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
      
      // 백엔드에서 북마크 객체를 직접 반환하는 경우 처리
      let isSuccess = false;
      let bookmarkData = null;
      
      if (response.success === true && response.data) {
        // httpClient가 래핑한 응답: {success: true, data: BookmarkObject}
        isSuccess = true;
        bookmarkData = response.data;
      } else if (response.bookmarkId) {
        // 백엔드에서 직접 반환한 북마크 객체
        isSuccess = true;
        bookmarkData = response;
      } else if (response.data && response.data.bookmarkId) {
        // 중간 래핑된 형태
        isSuccess = true;
        bookmarkData = response.data;
      }
      
     
      if (!isSuccess) {
        throw new Error('메모 저장에 실패했습니다.');
      }

      // 성공적으로 저장되면 상태 업데이트
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
    if (!confirm('메모를 삭제하시겠습니까?')) return;

    try {
      const response = await del<any>(`/bookmarks/${bookmarkId}/memo`);
      
      // 백엔드에서 북마크 객체를 직접 반환하는 경우 처리
      let isSuccess = false;
      
      if (response.success === true && response.data) {
        // httpClient가 래핑한 응답: {success: true, data: BookmarkObject}
        isSuccess = true;
      } else if (response.bookmarkId) {
        // 백엔드에서 직접 반환한 북마크 객체
        isSuccess = true;
      } else if (response.data && response.data.bookmarkId) {
        // 중간 래핑된 형태
        isSuccess = true;
      }
            
      if (!isSuccess) {
        throw new Error('메모 삭제에 실패했습니다.');
      }

      // 성공적으로 삭제되면 상태 업데이트
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
      if (removalTimeoutRef.current) {
        clearTimeout(removalTimeoutRef.current);
      }
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

  return (
    <div className={className}>
      <div className="mb-4 text-sm text-gray-600">
        총 {totalCount}개 중 {bookmarkItems.filter(item => item.isBookmarked).length}개를 북마크했습니다.
      </div>
      
      <div className="space-y-4">
        {bookmarkItems.map((item, index) => (
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