import React from 'react';

interface BookmarkItemProps {
  item: any;
  onPostingClick: (postingId: number) => void;
  onEditMemo: (item: any) => void;
  onDeleteMemo: (bookmarkId: number) => void;
  onBookmarkRemove: (bookmarkId: number) => void;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({
  item,
  onPostingClick,
  onEditMemo,
  onDeleteMemo,
  onBookmarkRemove
}) => {
  
  // 날짜 포맷팅 함수
  const formatDate = (dateData: any) => {
    try {
      console.log('원본 날짜 데이터:', dateData);
      
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
        console.error('유효하지 않은 날짜:', dateData);
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
      console.error('날짜 파싱 오류:', error, dateData);
      return '날짜 형식 오류';
    }
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.isBookmarked) {
      onBookmarkRemove(item.bookmarkId);
    }
  };

  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition-all bg-white cursor-pointer ${!item.isBookmarked ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start">
        <div 
          className="flex-1"
          onClick={() => onPostingClick(item.posting.postingId)}
        >
          <h3 className="font-semibold text-lg mb-2 hover:text-purple-600 transition-colors">
            {item.posting.title}
          </h3>
          
          {/* 신랑/신부 정보 */}
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {item.posting.personName} {item.posting.isSelf === 1 ? '(본인)' : '(지인)'}
          </div>
          
          {/* 장소 정보 */}
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {item.posting.location}
          </div>
          
          {/* 날짜 정보 */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012 0v4m4-4v4m-6 4h8m-8 0V9a1 1 0 011-1h6a1 1 0 011 1v6m-8 0h8" />
            </svg>
            {formatDate(item.posting.appointmentDatetime)}
          </div>
          
          {/* 모바일 청첩장 정보 */}
          <div className="flex items-center text-sm text-purple-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {item.posting.hasMobileInvitation === 1 ? '모바일 청첩장 있음' : '모바일 청첩장 없음'}
          </div>
          
          {/* 메모 표시 */}
          {item.memo && (
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded mt-2 relative group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-gray-600">💭</span> {item.memo}
                </div>
                <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* 메모 수정 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditMemo(item);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="메모 수정"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  {/* 메모 삭제 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMemo(item.bookmarkId);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="메모 삭제"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* 게시글 상세 보기 힌트 */}
          <div className="text-xs text-gray-400 mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            클릭하여 상세보기
          </div>
        </div>
        
        {/* 우측 액션 버튼들 */}
        <div className="flex flex-col items-center ml-4 space-y-2">
          {/* 북마크 버튼 */}
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-full transition-colors ${
              item.isBookmarked 
                ? 'text-red-500 hover:bg-red-50' 
                : 'text-gray-400 hover:bg-gray-100'
            }`}
            title={item.isBookmarked ? "북마크 해제" : "북마크"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={item.isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          {/* 메모 추가/수정 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditMemo(item);
            }}
            className={`p-2 rounded-full transition-colors ${
              item.memo 
                ? 'text-blue-500 hover:bg-blue-50' 
                : 'text-gray-400 hover:bg-gray-100'
            }`}
            title={item.memo ? "메모 수정" : "메모 추가"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookmarkItem;