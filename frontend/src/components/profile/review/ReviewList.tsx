import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewItem from './ReviewItem';
import { get } from '../../../utils/httpClient';

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

  const itemsPerPage = 10;

  // 더미 데이터 생성
  const generateDummyReviews = () => {
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
        // 추가 정보 (실제 API에서는 JOIN으로 가져올 데이터)
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
      },
      {
        guestReviewId: 4,
        applyId: 104,
        postingId: 204,
        userId: 304,
        content: '완벽한 하객이었습니다! 드레스코드도 잘 지켜주시고, 결혼식 내내 적극적으로 참여해주셨어요. 강력 추천합니다!',
        score: 5,
        createdAt: [2025, 6, 5, 11, 20],
        updatedAt: [2025, 6, 5, 11, 20],
        guestInfo: {
          nickname: '최완벽',
          profileImageUrl: 'https://via.placeholder.com/40',
          guestPower: 98
        },
        postingInfo: {
          title: '화창한 봄 결혼식 하객 모집',
          appointmentDatetime: [2025, 5, 28, 13, 30],
          location: '서울 송파구 럭셔리홀'
        }
      },
      {
        guestReviewId: 5,
        applyId: 105,
        postingId: 205,
        userId: 305,
        content: '평범한 수준이었습니다. 특별히 나쁘지도 좋지도 않았어요.',
        score: 2,
        createdAt: [2025, 6, 4, 9, 10],
        updatedAt: [2025, 6, 4, 9, 10],
        guestInfo: {
          nickname: '김평범',
          profileImageUrl: null,
          guestPower: 65
        },
        postingInfo: {
          title: '겨울 실내 결혼식 하객 구해요',
          appointmentDatetime: [2025, 5, 25, 12, 0],
          location: '인천시 중구 웨딩센터'
        }
      }
    ];

    return dummyData;
  };

  // 리뷰 목록 가져오기
  const fetchReviews = async (page: number = 1, append: boolean = false) => {
    setIsLoading(true);
    try {
      // 실제 API 호출 (현재는 주석 처리)
      // const response = await get<any>(`/guest-reviews?page=${page}&limit=${itemsPerPage}`);
      
      // 더미 데이터 사용
      const dummyData = generateDummyReviews();
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

    } catch (error) {
      console.error('리뷰 목록을 불러오는 중 오류가 발생했습니다:', error);
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

  // 더보기 버튼 클릭
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchReviews(currentPage + 1, true);
    }
  };

  // 게시글 상세 이동
  const handlePostingClick = (postingId: number) => {
    navigate(`/postings/${postingId}`);
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchReviews(1, false);
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
      <div className="mb-4 text-sm text-gray-600">
        총 {totalCount}개의 리뷰를 작성했습니다.
      </div>
      
      <div className="space-y-4">
        {reviewItems.map((review, index) => (
          <ReviewItem
            key={`${review.guestReviewId}-${index}`}
            review={review}
            onPostingClick={handlePostingClick}
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
              `더보기 (${totalCount - reviewItems.length}개 더)`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;