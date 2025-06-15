import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewItem from './ReviewItem';
import { get } from '../../../utils/httpClient';

/**
 * 리뷰 목록 컴포넌트
 * 
 * 백엔드 API 연결 가이드:
 * 1. 게스트 리뷰 API: GET /api/guest-reviews?page=1&limit=10
 * 2. 호스트 리뷰 API: GET /api/host-reviews?page=1&limit=10
 * 3. 리뷰 카운트 API: GET /api/guest-reviews/count, GET /api/host-reviews/count
 * 
 * API 응답 형식:
 * {
 *   data: Array<GuestReview | HostReview>,
 *   totalCount: number,
 *   hasMore: boolean,
 *   currentPage: number
 * }
 */

// 리뷰 타입 정의
type ReviewType = 'guest' | 'host';

// 게스트 리뷰 인터페이스 (모집자가 게스트에게 작성한 리뷰)
interface GuestReview {
  guestReviewId: number;
  applyId: number;
  postingId: number;
  userId: number; // 게스트(신청자) ID
  content: string;
  score: number;
  createdAt: number[];
  updatedAt: number[];
  guestInfo: {
    nickname: string;
    profileImageUrl?: string;
    guestPower: number;
  };
  postingInfo: {
    title: string;
    appointmentDatetime: number[];
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
  createdAt: number[];
  updatedAt: number[];
  hostInfo: {
    nickname: string;
    profileImageUrl?: string;
    hostPower: number;
  };
  postingInfo: {
    title: string;
    appointmentDatetime: number[];
    location: string;
  };
}

interface ReviewListProps {
  className?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [reviewItems, setReviewItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeReviewType, setActiveReviewType] = useState<ReviewType>('guest');
  const [guestReviewCount, setGuestReviewCount] = useState(0);
  const [hostReviewCount, setHostReviewCount] = useState(0);

  const itemsPerPage = 10;

  // 게스트 리뷰 더미 데이터 생성 (모집자가 게스트에게 작성한 리뷰)
  const generateDummyGuestReviews = () => {
    const dummyData = [
      {
        guestReviewId: 1,
        applyId: 101,
        postingId: 201,
        userId: 301,
        content: '정말 좋은 하객이었습니다. 시간도 정확하게 지키고 매너도 훌륭했어요. 다음에도 꼭 함께하고 싶습니다!',
        score: 5,
        createdAt: [2025, 6, 8, 14, 30],
        updatedAt: [2025, 6, 8, 14, 30],
        guestInfo: {
          nickname: '김하객',
          profileImageUrl: null,
          guestPower: 85
        },
        postingInfo: {
          title: '따뜻한 봄날 결혼식 하객 모집',
          appointmentDatetime: [2025, 6, 5, 15, 0],
          location: '서울 강남구 웨딩홀'
        }
      },
      {
        guestReviewId: 2,
        applyId: 102,
        postingId: 202,
        userId: 302,
        content: '성실하고 예의바른 하객이었습니다. 결혼식 분위기를 한층 더 좋게 만들어주셨어요.',
        score: 4,
        createdAt: [2025, 6, 7, 10, 15],
        updatedAt: [2025, 6, 7, 10, 15],
        guestInfo: {
          nickname: '박예의',
          profileImageUrl: 'https://via.placeholder.com/40',
          guestPower: 92
        },
        postingInfo: {
          title: '가을 야외 결혼식 하객 구합니다',
          appointmentDatetime: [2025, 6, 3, 16, 30],
          location: '경기도 파주시 정원'
        }
      },
      {
        guestReviewId: 3,
        applyId: 103,
        postingId: 203,
        userId: 303,
        content: '조금 늦게 도착하셨지만 그 외에는 모든 면에서 만족스러웠습니다. 친근하고 밝은 성격이 인상적이었어요.',
        score: 3,
        createdAt: [2025, 6, 6, 16, 45],
        updatedAt: [2025, 6, 6, 16, 45],
        guestInfo: {
          nickname: '이밝음',
          profileImageUrl: null,
          guestPower: 78
        },
        postingInfo: {
          title: '소중한 사람들과 함께하는 결혼식',
          appointmentDatetime: [2025, 6, 1, 14, 0],
          location: '부산시 해운대구 컨벤션홀'
        }
      }
    ];

    return dummyData;
  };

  // 호스트 리뷰 더미 데이터 생성 (게스트가 호스트에게 작성한 리뷰)
  const generateDummyHostReviews = () => {
    const dummyData = [
      {
        hostReviewId: 1,
        applyId: 201,
        postingId: 301,
        userId: 401,
        content: '정말 좋은 결혼식이었습니다. 주최자분이 매우 친절하시고 행사 진행도 완벽했어요!',
        score: 5,
        createdAt: [2025, 6, 8, 16, 30],
        updatedAt: [2025, 6, 8, 16, 30],
        hostInfo: {
          nickname: '신랑김씨',
          profileImageUrl: 'https://via.placeholder.com/40',
          hostPower: 95
        },
        postingInfo: {
          title: '따뜻한 봄날 결혼식 하객 모집',
          appointmentDatetime: [2025, 6, 5, 15, 0],
          location: '서울 강남구 웨딩홀'
        }
      },
      {
        hostReviewId: 2,
        applyId: 202,
        postingId: 302,
        userId: 402,
        content: '음식도 맛있고 분위기도 좋았어요. 다만 시간이 조금 길어서 아쉬웠습니다.',
        score: 4,
        createdAt: [2025, 6, 7, 18, 15],
        updatedAt: [2025, 6, 7, 18, 15],
        hostInfo: {
          nickname: '신부박씨',
          profileImageUrl: null,
          hostPower: 88
        },
        postingInfo: {
          title: '가을 야외 결혼식 하객 구합니다',
          appointmentDatetime: [2025, 6, 3, 16, 30],
          location: '경기도 파주시 정원'
        }
      }
    ];

    return dummyData;
  };

  // 리뷰 목록 가져오기
  const fetchReviews = async (reviewType: ReviewType, page: number = 1, append: boolean = false) => {
    setIsLoading(true);
    try {
      // 실제 API 호출
      const endpoint = reviewType === 'guest' ? '/api/guest-reviews' : '/api/host-reviews';
      // const response = await get<any>(`${endpoint}?page=${page}&limit=${itemsPerPage}`);
      // const { data, totalCount: total, hasMore: more } = response;
      
      // 더미 데이터 사용 (실제 배포 시 삭제 예정)
      const dummyData = reviewType === 'guest' ? generateDummyGuestReviews() : generateDummyHostReviews();
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageData = dummyData.slice(startIndex, endIndex);
      
      if (append && page > 1) {
        setReviewItems(prev => [...prev, ...pageData]);
      } else {
        setReviewItems(pageData);
      }

      setTotalCount(dummyData.length);
      setHasMore(endIndex < dummyData.length);
      setCurrentPage(page);

      // 리뷰 카운트 설정 (실제 API에서는 별도 엔드포인트로 처리)
      if (reviewType === 'guest') {
        setGuestReviewCount(dummyData.length);
      } else {
        setHostReviewCount(dummyData.length);
      }

    } catch (error) {
      console.error('리뷰 목록 로드 실패:', error);
      alert('리뷰 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      
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
      // 실제 API 호출
      // const guestResponse = await get<{ count: number }>('/api/guest-reviews/count');
      // const hostResponse = await get<{ count: number }>('/api/host-reviews/count');
      // setGuestReviewCount(guestResponse.count);
      // setHostReviewCount(hostResponse.count);
      
      // 더미 데이터 사용 (실제 배포 시 삭제 예정)
      const guestData = generateDummyGuestReviews();
      const hostData = generateDummyHostReviews();
      
      setGuestReviewCount(guestData.length);
      setHostReviewCount(hostData.length);
    } catch (error) {
      console.error('리뷰 카운트 로드 실패:', error);
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
      fetchReviews(reviewType, 1, false);
    }
  };

  // 게시글 상세 이동
  const handlePostingClick = (postingId: number) => {
    navigate(`/postings/${postingId}`);
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchReviewCounts();
    fetchReviews(activeReviewType, 1, false);
  }, []);

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
  if (reviewItems.length === 0) {
    return (
      <div className={`text-center text-gray-500 py-10 ${className}`}>
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-400 mb-2">작성한 리뷰가 없습니다</p>
        <p className="text-sm text-gray-400">참여한 결혼식에 대한 리뷰를 작성해보세요!</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 리뷰 카운트 및 타입 선택 버튼 */}
      <div className="mb-6">
        <div className="mb-3 text-sm text-gray-600">
          총 {guestReviewCount + hostReviewCount}개의 리뷰를 작성했습니다.
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleReviewTypeChange('guest')}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeReviewType === 'guest'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:bg-purple-50'
            }`}
          >
            게스트 리뷰
          </button>
          <button
            onClick={() => handleReviewTypeChange('host')}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeReviewType === 'host'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:bg-purple-50'
            }`}
          >
            호스트 리뷰
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
              ? '내가 게스트로 참여한 후 모집자에게 받은 리뷰입니다.'
              : '내가 호스트로 모집한 후 게스트에게 받은 리뷰입니다.'
            }
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        {reviewItems.map((review, index) => {
          // 리뷰 ID 키 생성 (게스트 리뷰와 호스트 리뷰 구분)
          const reviewKey = activeReviewType === 'guest' 
            ? `guest-${review.guestReviewId}-${index}`
            : `host-${review.hostReviewId}-${index}`;
          
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