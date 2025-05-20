import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('따뜻한 셀럽_26745');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  const handleEditProfileImage = () => {
    // 프로필 이미지 변경 로직
    console.log('프로필 이미지 변경');
  };

  const handleSubmit = () => {
    // 프로필 정보 저장 로직
    console.log('프로필 저장:', { nickname, bio, location });
    navigate('/mypage', { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더 */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <button onClick={() => navigate('/mypage', { replace: true })} className="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">프로필 수정</h1>
      </div>

      {/* 프로필 이미지 */}
      <div className="flex justify-center mt-8 mb-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <button 
            onClick={handleEditProfileImage}
            className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 프로필 정보 */}
      <div className="px-4">
        {/* 닉네임 */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">닉네임</label>
          <input 
            type="text"
            className="w-full p-3 bg-gray-100 rounded text-gray-700"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        {/* 자기 소개 */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">자기 소개</label>
          <textarea 
            className="w-full p-3 bg-gray-100 rounded text-gray-700 min-h-[100px]"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자신을 알릴 수 있는 소개글을 작성해 주세요."
          ></textarea>
          <div className="text-right text-sm text-gray-500 mt-1">0/35자</div>
        </div>

        {/* 활동 지역 */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">활동 지역</label>
          <div className="relative">
            <input 
              type="text"
              className="w-full p-3 bg-gray-100 rounded text-gray-700 pl-10"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="활동 지역을 자유롭게 입력해주세요."
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* SNS 설정하기 */}
        <div className="flex justify-between items-center py-4 border-t border-gray-200">
          <span className="font-medium">SNS 설정하기</span>
          <div className="flex items-center text-gray-500">
            <span className="mr-2">입력한 SNS정보가 없습니다.</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* 추가 설정들 */}
        <div className="flex justify-between items-center py-4 border-t border-gray-200">
          <span className="font-medium">내 취향 선택하기</span>
          <div className="flex items-center text-gray-500">
            <span className="mr-2">미설정</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-4 border-t border-gray-200">
          <span className="font-medium">생일/기념일 등록하기</span>
          <div className="flex items-center text-gray-500">
            <span className="mr-2">0 건</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-red-500 text-white font-medium rounded-md"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default ProfileEditPage;