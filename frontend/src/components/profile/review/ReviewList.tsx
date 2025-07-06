import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewItem from './ReviewItem';
import { reviewApi, type GuestReview, type HostReview } from './api/reviewApi';

/**
 * 리뷰 목록 컴포넌트 - API 모듈 사용 버전
 * 
<<<<<<< HEAD
 * 백엔드 API 연결:
 * 1. 게스트 리뷰 API: GET /api/review/guest-reviews?page=1&limit=10
 * 2. 호스트 리뷰 API: GET /api/review/host-reviews?page=1&limit=10
 * 3. 리뷰 카운트 API: GET /api/review/guest-reviews/count, GET /api/review/host-reviews/count
 * 
 * API 응답 형식:
 * {
 *   data: Array<GuestReview | HostReview>,
 *   totalCount: number,
 *   hasMore: boolean,
 *   currentPage: number
 * }
=======
 * API 엔드포인트:
 * 1. 게스트 리뷰 목록: GET /api/review/guest-reviews?page=1&limit=10
 * 2. 호스트 리뷰 목록: GET /api/review/host-reviews?page=1&limit=10
 * 3. 게스트 리뷰 카운트: GET /api/review/guest-reviews/count
 * 4. 호스트 리뷰 카운트: GET /api/review/host-reviews/count
>>>>>>> ac7ebf3176fa2638bce854fe964e7227718683aa
 */

// 리뷰 타입 정의
type ReviewType = 'guest' | 'host';

<<<<<<< HEAD
// 게스트 리뷰 인터페이스 (모집자가 게스트에게 작성한 리뷰)
interface GuestReview {
  guestReviewId: number;
  applyId: number;
  postingId: number;
  userId: number; // 게스트(신청자) ID
  content: string;
  score: number;
  createdAt: string; // ISO 문자열로 받음
  updatedAt: string;
  guestInfo: {
    nickname: string;
    profileImageUrl?: string;
    guestPower: number;
  };
  postingInfo: {
    title: string;
    appointmentDatetime: string; // ISO 문자열로 받음
    location: string;
  };
}

// 호스트 리뷰 인터페이스 (신청자가 호스트에게 작성한 리뷰)
interface HostReview {
  hostReviewId: number;
  applyId: number;
  postingId: number;
  userId: number; // 호스트(모집자) ID
  content: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  hostInfo: {
    nickname: string;
    profileImageUrl?: string;
    hostPower: number;
  };
  postingInfo: {
    title: string;
    appointmentDatetime: string;
    location: string;
  };
}

// API 응답 인터페이스
interface ReviewListResponse<T> {
  data: T[];
  totalCount: number;
  hasMore: boolean;
  currentPage: number;
}

interface ReviewCountResponse {
  count: number;
}

=======
>>>>>>> ac7ebf3176fa2638bce854fe964e7227718683aa
interface ReviewListProps {
  className?: string;
  userId?: number; // 특정 사용자의 리뷰를 조회할 때 사용
}

const ReviewList: React.FC<ReviewListProps> = ({ className = '', userId }) => {
  const navigate = useNavigate();
  const [reviewItems, setReviewItems] = useState<(GuestReview | HostReview)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeReviewType, setActiveReviewType] = useState<ReviewType>('guest');
  const [guestReviewCount, setGuestReviewCount] = useState(0);
  const [hostReviewCount, setHostReviewCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 10;

  // 리뷰 목록 가져오기
  const fetchReviews = async (reviewType: ReviewType, page: number = 1, append: boolean = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
<<<<<<< HEAD
      // 실제 API 호출
      const endpoint = reviewType === 'guest' ? '/review/guest-reviews' : '/review/host-reviews';
      const response = await get<ReviewListResponse<GuestReview | HostReview>>(
        `${endpoint}?page=${page}&limit=${itemsPerPage}`
      );
      
      // ApiResponse 래퍼에서 실제 데이터 추출
      if (!response.success || !response.data) {
        throw new Error(response.message || '데이터를 불러올 수 없습니다.');
      }
      
      const { data, totalCount: total, hasMore: more, currentPage: current } = response.data;
=======
      let response;
      
      // userId가 있으면 특정 사용자의 리뷰 조회, 없으면 현재 사용자의 리뷰 조회
      if (userId) {
        response = reviewType === 'guest' 
          ? await reviewApi.getGuestReviewsByUserId(userId, page, itemsPerPage)
          : await reviewApi.getHostReviewsByUserId(userId, page, itemsPerPage);
      } else {
        response = reviewType === 'guest' 
          ? await reviewApi.getGuestReviews(page, itemsPerPage)
          : await reviewApi.getHostReviews(page, itemsPerPage);
      }
>>>>>>> ac7ebf3176fa2638bce854fe964e7227718683aa
      
      // API 응답 처리
      if (!response.success || !response.data) {
        throw new Error(response.message || '리뷰 목록을 불러오는데 실패했습니다.');
      }

      const reviewData = response.data;
      
      // 데이터 검증
      if (!reviewData || !Array.isArray(reviewData.data)) {
        throw new Error('올바르지 않은 응답 형식입니다.');
      }

      // 빈 데이터 처리
      if (reviewData.data.length === 0) {
        if (append && page > 1) {
          setHasMore(false);
        } else {
          setReviewItems([]);
          setTotalCount(reviewData.totalCount || 0);
          setHasMore(reviewData.hasMore || false);
          setCurrentPage(reviewData.currentPage || 1);
        }
        return;
      }
      
      // 데이터 설정
      if (append && page > 1) {
<<<<<<< HEAD
        setReviewItems(prev => [...prev, ...data]);
      } else {
        setReviewItems(data);
      }

      setTotalCount(total);
      setHasMore(more);
      setCurrentPage(current);
=======
        setReviewItems(prev => [...prev, ...reviewData.data]);
      } else {
        setReviewItems(reviewData.data);
      }

      setTotalCount(reviewData.totalCount || 0);
      setHasMore(reviewData.hasMore || false);
      setCurrentPage(reviewData.currentPage || page);
>>>>>>> ac7ebf3176fa2638bce854fe964e7227718683aa

    } catch (error) {
      console.error('리뷰 목록 로드 실패:', error);
      
      let errorMessage = '리뷰 목록을 불러오는데 실패했습니다.';
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = '로그인이 필요합니다.';
        } else if (error.message.includes('403')) {
          errorMessage = '권한이 없습니다.';
        } else if (error.message.includes('404')) {
          errorMessage = '리뷰 데이터를 찾을 수 없습니다.';
        } else if (error.message.includes('timeout') || error.message.includes('ECONNABORTED')) {
          errorMessage = '서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.';
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      if (!append) {
        setReviewItems([]);
        setTotalCount(0);
        setHasMore(false);
        setCurrentPage(1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 리뷰 카운트 가져오기
  const fetchReviewCounts = async () => {
    try {
<<<<<<< HEAD
      // 실제 API 호출
      const guestResponse = await get<ReviewCountResponse>('/review/guest-reviews/count');
      const hostResponse = await get<ReviewCountResponse>('/review/host-reviews/count');
      
      // ApiResponse 래퍼에서 실제 데이터 추출
      if (guestResponse.success && guestResponse.data) {
        setGuestReviewCount(guestResponse.data.count);
      }
      
      if (hostResponse.success && hostResponse.data) {
        setHostReviewCount(hostResponse.data.count);
      }
    } catch (error) {
      console.error('리뷰 카운트 로드 실패:', error);
      // 에러가 발생해도 카운트는 0으로 유지
=======
      // userId가 있는 경우 카운트는 조회하지 않음 (다른 사용자 프로필 조회 시)
      if (userId) {
        setGuestReviewCount(0);
        setHostReviewCount(0);
        return;
      }

      const [guestResponse, hostResponse] = await Promise.all([
        reviewApi.getGuestReviewCount(),
        reviewApi.getHostReviewCount()
      ]);
      
      // API 응답 처리
      const guestCount = guestResponse.success && guestResponse.data ? guestResponse.data.count : 0;
      const hostCount = hostResponse.success && hostResponse.data ? hostResponse.data.count : 0;
      
      setGuestReviewCount(guestCount);
      setHostReviewCount(hostCount);
      
    } catch (error) {
      console.error('리뷰 카운트 로드 실패:', error);
      // 오류 시 기본값 0으로 설정
>>>>>>> ac7ebf3176fa2638bce854fe964e7227718683aa
      setGuestReviewCount(0);
      setHostReviewCount(0);
    }
  };

  // 더보기 버튼 클릭
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchReviews(activeReviewType, currentPage + 1, true);
    }
  };

  // 리뷰 타입 변경
  const handleReviewTypeChange = (reviewType: ReviewType) => {
    if (reviewType !== activeReviewType) {
      setActiveReviewType(reviewType);
      setCurrentPage(1);
      setError(null);
      fetchReviews(reviewType, 1, false);
    }
  };

  // 게시글 상세 이동
  const handlePostingClick = (postingId: number) => {
    navigate(`/postings/${postingId}`);
  };

  // 재시도 함수
  const handleRetry = () => {
    setError(null);
    fetchReviews(activeReviewType, 1, false);
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchReviewCounts();
    fetchReviews(activeReviewType, 1, false);
  }, [userId]); // userId 변경 시에도 재로드

  // 에러 상태
  if (error && reviewItems.length === 0) {
    return (
      <div className={`text-center py-10 ${className}`}>
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-600 mb-2">오류가 발생했습니다</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 로딩 상태
  if (isLoading && reviewItems.length === 0) {
    return (
      <div className={`flex items-center justify-center py-10 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">리뷰 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 빈 상태
  if (reviewItems.length === 0 && !isLoading) {
    return (
      <div className={`text-center text-gray-500 py-10 ${className}`}>
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-400 mb-2">
          {activeReviewType === 'guest' ? '받은 게스트 리뷰가' : '받은 호스트 리뷰가'} 없습니다
        </p>
        <p className="text-sm text-gray-400">
          {activeReviewType === 'guest' 
            ? '게스트로 참여한 결혼식에서 리뷰를 받아보세요!' 
            : '호스트로 모집한 결혼식에서 리뷰를 받아보세요!'
          }
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 리뷰 카운트 및 타입 선택 버튼 */}
      <div className="mb-6">
        {!userId && (
          <div className="mb-3 text-sm text-gray-600">
            총 {guestReviewCount + hostReviewCount}개의 리뷰를 받았습니다.
          </div>
        )}
        <div className="flex space-x-3">
          <button
            onClick={() => handleReviewTypeChange('guest')}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeReviewType === 'guest'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:bg-purple-50'
            }`}
          >
<<<<<<< HEAD
            게스트 리뷰 ({guestReviewCount})
=======
            받은 게스트 리뷰 {!userId && `(${guestReviewCount})`}
>>>>>>> ac7ebf3176fa2638bce854fe964e7227718683aa
          </button>
          <button
            onClick={() => handleReviewTypeChange('host')}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeReviewType === 'host'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:bg-purple-50'
            }`}
          >
<<<<<<< HEAD
            호스트 리뷰 ({hostReviewCount})
=======
            받은 호스트 리뷰 {!userId && `(${hostReviewCount})`}
>>>>>>> ac7ebf3176fa2638bce854fe964e7227718683aa
          </button>
        </div>
      </div>

      {/* 현재 보고 있는 리뷰 타입 설명 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            activeReviewType === 'guest' ? 'bg-blue-500' : 'bg-green-500'
          }`}></div>
          <p className="text-sm text-gray-700 font-medium">
            {activeReviewType === 'guest' 
              ? `${userId ? '이 사용자가' : '내가'} 게스트로 참여한 후 모집자로부터 받은 리뷰입니다.`
              : `${userId ? '이 사용자가' : '내가'} 호스트로 모집한 후 게스트로부터 받은 리뷰입니다.`
            }
          </p>
        </div>
      </div>

      {/* 에러 알림 (부분 에러) */}
      {error && reviewItems.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="space-y-6">
        {reviewItems.map((review, index) => {
          // 리뷰 ID 키 생성 (게스트 리뷰와 호스트 리뷰 구분)
          const reviewKey = activeReviewType === 'guest' 
            ? `guest-${(review as GuestReview).guestReviewId}-${index}`
            : `host-${(review as HostReview).hostReviewId}-${index}`;
          
          return (
            <ReviewItem
              key={reviewKey}
              review={review}
              reviewType={activeReviewType}
              onPostingClick={handlePostingClick}
            />
          );
        })}
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
              `더보기 (${totalCount - reviewItems.length}개 더)`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
