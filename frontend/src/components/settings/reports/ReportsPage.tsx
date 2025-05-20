import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <button onClick={() => navigate('/settings')} className="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">신고 관리</h1>
      </div>
      
      {/* 신고 관리 컨텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="mt-4 px-4 text-gray-500">신고 내역</div>
        
        <div className="bg-white">
          {/* 신고 내역이 없을 때 표시할 메시지 */}
          <div className="p-6 text-center text-gray-500">
            <p>신고 내역이 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;