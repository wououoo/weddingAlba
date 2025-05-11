import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportPostingPage: React.FC = () => {
  const navigate = useNavigate();
  const [postingId, setPostingId] = useState('');
  const [reportType, setReportType] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 신고 제출 로직 구현
    alert('신고가 제출되었습니다.');
    navigate('/settings');
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
        <h1 className="text-xl font-bold">모집글 신고하기</h1>
      </div>
      
      {/* 신고 폼 */}
      <div className="flex-1 overflow-auto p-4">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          {/* 모집글 ID */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postingId">
              모집글 ID
            </label>
            <input
              id="postingId"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={postingId}
              onChange={(e) => setPostingId(e.target.value)}
              placeholder="신고할 모집글의 ID를 입력하세요"
              required
            />
          </div>
          
          {/* 신고 유형 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reportType">
              신고 유형
            </label>
            <select
              id="reportType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              required
            >
              <option value="">신고 유형을 선택하세요</option>
              <option value="fake">허위 정보</option>
              <option value="inappropriate">부적절한 내용</option>
              <option value="scam">사기</option>
              <option value="other">기타</option>
            </select>
          </div>
          
          {/* 상세 내용 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="details">
              상세 내용
            </label>
            <textarea
              id="details"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="신고 내용을 자세히 작성해주세요"
              required
            />
          </div>
          
          {/* 버튼 */}
          <div className="flex items-center justify-center mt-6">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              신고하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportPostingPage;