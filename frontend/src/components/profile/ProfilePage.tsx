import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppFooter } from '../Common';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'wishlist' | 'reviews'>('wishlist');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            className="mr-3"
            onClick={() => navigate('/', { replace: true })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">마이페이지</h1>
        </div>
        <div className="flex items-center">
          <button className="p-1 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button 
            className="p-1"
            onClick={() => navigate('/settings', { replace: true })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 사용자 프로필 영역 */}
      <div className="bg-white p-4 flex items-center mb-2">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <div className="font-semibold">따뜻한 셀럽_26745</div>
          <div className="text-sm text-gray-500">일반회원 · 하객력 0</div>
        </div>
      </div>

      {/* 프로필 업데이트 버튼 */}
      <div className="bg-white p-4 flex justify-between mb-2">
        <button 
          className="w-full bg-gray-100 py-2 px-4 rounded text-sm"
          onClick={() => navigate('/profile/edit')}
        >
          프로필 수정
        </button>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-200 bg-white">
        <button 
          className={`flex-1 py-3 px-4 text-center ${activeTab === 'wishlist' ? 'text-purple-600 border-b-2 border-purple-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('wishlist')}
        >
          찜 목록
        </button>
        <button 
          className={`flex-1 py-3 px-4 text-center ${activeTab === 'reviews' ? 'text-purple-600 border-b-2 border-purple-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('reviews')}
        >
          리뷰
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="flex-1 p-4 pb-20">
        {activeTab === 'wishlist' ? (
          <div className="text-center text-gray-500 py-10">
            찜한 내역이 없습니다.
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            작성한 리뷰가 없습니다.
          </div>
        )}
      </div>

      {/* Footer */}
      <AppFooter />
    </div>
  );
};

export default ProfilePage;