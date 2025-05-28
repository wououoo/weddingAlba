import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoutComponent, WithdrawComponent } from './auth';
import { AppFooter } from '../Common';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 설정 헤더 */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <button onClick={() => navigate('/', { replace: true })} className="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">설정</h1>
      </div>
      
      {/* 설정 컨텐츠 */}
      <div className="flex-1 overflow-auto pb-20">
        {/* 알람 섹션 */}
        <div className="mt-4 px-4 text-gray-500">알람</div>
        
        <div className="bg-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-100" onClick={() => navigate('/settings/notifications')}>
            <span>알람 설정</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* 계정 섹션 */}
        <div className="mt-6 px-4 text-gray-500">계정</div>
        
        <div className="bg-white">
          <LogoutComponent />
          
          <div className="flex items-center justify-between p-4 border-b border-gray-100" onClick={() => navigate('/settings/user/edit')}>
            <span>내 정보 수정</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <WithdrawComponent />
        </div>
        
        {/* 신고 섹션 */}
        <div className="mt-6 px-4 text-gray-500">신고</div>
        
        <div className="bg-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-100" onClick={() => navigate('/settings/report/posting')}>
            <span>모집글 신고하기</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between p-4 border-b border-gray-100" onClick={() => navigate('/settings/report/user')}>
            <span>유저 신고하기</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between p-4 border-b border-gray-100" onClick={() => navigate('/settings/report/list')}>
            <span>신고 목록</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* 사용자 관리 섹션 */}
        <div className="mt-6 px-4 text-gray-500">사용자 관리</div>
        
        <div className="bg-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-100" onClick={() => navigate('/settings/applications')}>
            <span>신청 목록</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between p-4 border-b border-gray-100" onClick={() => navigate('/settings/recruitments')}>
            <span>모집 목록</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between p-4 border-b border-gray-100" onClick={() => navigate('/settings/reviews')}>
            <span>리뷰 목록</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Footer */}
      <AppFooter />
    </div>
  );
};

export default SettingsPage;