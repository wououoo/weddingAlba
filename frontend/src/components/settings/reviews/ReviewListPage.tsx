import React from 'react';
import { useNavigate } from 'react-router-dom';

// 샘플 리뷰 데이터
const sampleReviews = [
  {
    id: 1,
    postingTitle: '강남 S웨딩홀 하객',
    rating: 5,
    content: '진행이 원활했고 주최측이 매우 친절했습니다. 다음에도 참여하고 싶네요.',
    date: '2025-05-16',
    createdAt: '2025-05-17'
  },
  {
    id: 2,
    postingTitle: '송파 L호텔 하객',
    rating: 4,
    content: '대체로 좋았으나 대기 시간이 조금 길었습니다. 하지만 음식이 정말 맛있었어요!',
    date: '2025-04-29',
    createdAt: '2025-04-30'
  },
  {
    id: 3,
    postingTitle: '강서 K컨벤션 하객',
    rating: 3,
    content: '보통이었습니다. 교통이 불편했지만 사람들은 친절했어요.',
    date: '2025-04-10',
    createdAt: '2025-04-11'
  }
];

const ReviewListPage: React.FC = () => {
  const navigate = useNavigate();

  // 별점 표시 함수
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <button onClick={() => navigate('/settings', { replace: true })} className="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">리뷰 목록</h1>
      </div>
      
      {/* 필터 버튼 */}
      <div className="p-4 flex space-x-2 overflow-x-auto">
        <button className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm whitespace-nowrap">
          전체
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm whitespace-nowrap">
          5점
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm whitespace-nowrap">
          4점
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm whitespace-nowrap">
          3점 이하
        </button>
      </div>
      
      {/* 리뷰 목록 */}
      <div className="flex-1 overflow-auto p-4">
        {sampleReviews.length > 0 ? (
          <div className="space-y-4">
            {sampleReviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                <div>
                  <h3 className="font-medium">{review.postingTitle}</h3>
                  <p className="text-sm text-gray-500">
                    행사일: {review.date}
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="flex mr-2">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-600">{review.rating}.0</span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    {review.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    작성일: {review.createdAt}
                  </p>
                </div>
                
                {/* 버튼 그룹 */}
                <div className="mt-3 flex justify-end space-x-2">
                  <button className="text-blue-600 text-sm">수정</button>
                  <button className="text-red-600 text-sm">삭제</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500">작성한 리뷰가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewListPage;