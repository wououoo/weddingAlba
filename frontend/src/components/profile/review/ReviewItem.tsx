import React from 'react';

// 리뷰 타입 정의
type ReviewType = 'guest' | 'host';

interface ReviewItemProps {
  review: any;
  reviewType: ReviewType;
  onPostingClick: (postingId: number) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  reviewType,
  onPostingClick
}) => {
  
  // 날짜 포맷팅 함수
  const formatDate = (dateData: any) => {
    try {
      let date;
      
      // 배열 형태의 날짜 데이터 처리 [year, month, day, hour, minute]
      if (Array.isArray(dateData) && dateData.length >= 5) {
        // Java LocalDateTime 배열: [year, month, day, hour, minute, second?, nano?]
        // JavaScript Date는 month가 0부터 시작하므로 -1 해야 함
        const [year, month, day, hour, minute, second = 0] = dateData;
        date = new Date(year, month - 1, day, hour, minute, second);
      } else if (typeof dateData === 'string') {
        // 문자열 형태의 날짜 처리
        let dateString = dateData;
        if (dateString.includes(' ') && !dateString.includes('T')) {
          dateString = dateString.replace(' ', 'T');
        }
        date = new Date(dateString);
      } else {
        // 기본 Date 생성자 사용
        date = new Date(dateData);
      }
      
      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        return '날짜 정보 없음';
      }
      
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '날짜 형식 오류';
    }
  };

  // 별점 렌더링 함수
  const renderStars = (score: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ${i <= score ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      );
    }
    return stars;
  };

  // 점수에 따른 텍스트 색상
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  // 점수에 따른 배경 색상
  const getScoreBgColor = (score: number) => {
    if (score >= 4) return 'bg-green-50';
    if (score >= 3) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* 리뷰 헤더 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1">
              {/* 리뷰 대상 정보 */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {/* 게스트 리뷰인 경우 게스트 정보, 호스트 리뷰인 경우 호스트 정보 */}
                  {(reviewType === 'guest' ? review.guestInfo?.profileImageUrl : review.hostInfo?.profileImageUrl) ? (
                    <img 
                      src={reviewType === 'guest' ? review.guestInfo.profileImageUrl : review.hostInfo.profileImageUrl} 
                      alt={`${reviewType === 'guest' ? '게스트' : '호스트'} 프로필`} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    {reviewType === 'guest' 
                      ? (review.guestInfo?.nickname || '게스트') 
                      : (review.hostInfo?.nickname || '호스트')
                    }
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {reviewType === 'guest' 
                      ? `하객력 ${review.guestInfo?.guestPower || 0}`
                      : `호스트력 ${review.hostInfo?.hostPower || 0}`
                    }
                  </div>
                </div>
              </div>
            </div>
            
            {/* 오른쪽: 리뷰 타입 배지 및 점수 */}
            <div className="flex flex-col items-end space-y-2">
              {/* 리뷰 타입 표시 배지 */}
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                reviewType === 'guest' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {reviewType === 'guest' ? '게스트 리뷰' : '호스트 리뷰'}
              </div>
              
              {/* 점수와 별점 */}
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${getScoreBgColor(review.score)}`}>
                <div className="flex items-center space-x-1">
                  {renderStars(review.score)}
                </div>
                <span className={`text-sm font-semibold ${getScoreColor(review.score)}`}>
                  {review.score}/5
                </span>
              </div>
            </div>
          </div>

          {/* 리뷰 내용 */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2 font-medium">
              {reviewType === 'guest' 
                ? '모집자가 나에게 작성한 리뷰:' 
                : '내가 모집자에게 작성한 리뷰:'
              }
            </div>
            <p className="text-gray-800 leading-relaxed text-sm">
              "{review.content}"
            </p>
          </div>

          {/* 결혼식 정보 */}
          <div 
            className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg cursor-pointer hover:from-purple-50 hover:to-blue-50 hover:border-purple-200 border border-transparent transition-all duration-200"
            onClick={() => onPostingClick(review.postingId)}
          >
            <h4 className="font-semibold text-purple-600 mb-2 hover:text-purple-700 transition-colors">
              {review.postingInfo?.title}
            </h4>
            
            {/* 장소 정보 */}
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {review.postingInfo?.location}
            </div>
            
            {/* 결혼식 날짜 */}
            <div className="flex items-center text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012 0v4m4-4v4m-6 4h8m-8 0V9a1 1 0 011-1h6a1 1 0 011 1v6m-8 0h8" />
              </svg>
              {formatDate(review.postingInfo?.appointmentDatetime)}
            </div>
          </div>

          {/* 리뷰 작성 일시 */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              리뷰 작성: {formatDate(review.createdAt)}
            </div>
            
            {/* 게시글 보기 힌트 */}
            <div className="text-xs text-gray-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              클릭하여 게시글 보기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;