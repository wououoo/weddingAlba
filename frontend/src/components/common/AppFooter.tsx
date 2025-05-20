import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AppFooter: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // 현재 활성화된 메뉴 확인
  const isHome = path === '/' || path.startsWith('/home');
  const isPostings = path.startsWith('/posting') || path === '/postings';
  const isChat = path.startsWith('/chat');
  const isMypage = path.startsWith('/mypage') || path.startsWith('/profile') || path.startsWith('/settings');
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center px-2 py-3">
        <Link to="/" className={`flex flex-col items-center ${isHome ? 'text-purple-600' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs">홈</span>
        </Link>
        
        <Link to="/posting/list" className={`flex flex-col items-center ${isPostings ? 'text-purple-600' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="text-xs">예정된공고</span>
        </Link>
        
        <Link to="/chat" className={`flex flex-col items-center ${isChat ? 'text-purple-600' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-xs">채팅</span>
        </Link>
        
        <Link to="/mypage" className={`flex flex-col items-center ${isMypage ? 'text-purple-600' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs">MY</span>
        </Link>
      </div>
    </footer>
  );
};

export default AppFooter;