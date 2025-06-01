import React, { useRef, useState } from 'react';
import { useProfileEdit } from './hooks/useProfile';
import LocationSelector from './LocationSelector';

const ProfileEditPage: React.FC = () => {
  const {
    nickname, setNickname,
    selfIntroduction, setSelfIntroduction,
    activityArea, setActivityArea,
    profileImageUrl,
    isLoading,
    isSaving,
    error, setError,
    introductionLength,
    maxIntroductionLength,
    handleIntroductionChange,
    handleProfileImageChange,
    handleSubmit,
    navigate
  } = useProfileEdit();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);

  // 프로필 이미지 변경 핸들러
  const handleEditProfileImage = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다.');
        return;
      }

      handleProfileImageChange(file);
    }
  };

  // 로딩 상태
  if (isLoading && !error) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="flex items-center p-4 border-b border-gray-200">
          <button onClick={() => navigate('/mypage', { replace: true })} className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">프로필 수정</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-700">프로필 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

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

      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-4 rounded" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* 프로필 이미지 */}
      <div className="flex justify-center mt-8 mb-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt="프로필 이미지" 
                className="w-full h-full object-cover"
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <button 
            onClick={handleEditProfileImage}
            className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1"
            disabled={isLoading || isSaving}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* 프로필 정보 입력 */}
      <div className="px-4">
        {/* 닉네임 */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            닉네임 <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            className="w-full p-3 bg-gray-100 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
            disabled={isLoading || isSaving}
            maxLength={20}
            required
          />
        </div>

        {/* 자기 소개 */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">자기 소개</label>
          <textarea 
            className="w-full p-3 bg-gray-100 rounded text-gray-700 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            value={selfIntroduction}
            onChange={handleIntroductionChange}
            placeholder="자신을 알릴 수 있는 소개글을 작성해 주세요."
            disabled={isLoading || isSaving}
          />
          <div className={`text-right text-sm mt-1 ${introductionLength > maxIntroductionLength * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
            {introductionLength}/{maxIntroductionLength}자
          </div>
        </div>

        {/* 활동 지역 */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">활동 지역</label>
          <div className="relative">
            <input 
              type="text"
              className="w-full p-3 bg-gray-100 rounded text-gray-700 pl-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={activityArea}
              onClick={() => setIsLocationSelectorOpen(true)}
              readOnly
              placeholder="활동 지역을 선택해주세요."
              disabled={isLoading || isSaving}
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="absolute right-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 추가 설정 섹션들 (추후 구현) */}
        <div className="border-t border-gray-200 pt-4">
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
      </div>

      {/* 저장 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={isLoading || isSaving}
          className={`w-full py-3 text-white font-medium rounded-md ${
            isLoading || isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>

      {/* LocationSelector 모달 */}
      {isLocationSelectorOpen && (
        <LocationSelector
          value={activityArea}
          onChange={(location) => {
            setActivityArea(location);
            setIsLocationSelectorOpen(false);
          }}
          onClose={() => setIsLocationSelectorOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileEditPage;
