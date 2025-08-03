import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccountPage: React.FC = () => {
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
        <h1 className="text-xl font-bold">계정 설정</h1>
      </div>
      
      {/* 계정 설정 컨텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="mt-4 px-4 text-gray-500">계정 정보</div>
        
        <div className="bg-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span>이메일</span>
            <span className="text-gray-500">user@example.com</span>
          </div>
          
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span>연결된 소셜 계정</span>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded">카카오</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4">
            <span>비밀번호 변경</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="mt-6 px-4 text-gray-500">계정 관리</div>
        
        <div className="bg-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 text-red-500">
            <span>로그아웃</span>
          </div>
          
          <div className="flex items-center justify-between p-4 text-red-500">
            <span>계정 삭제</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;