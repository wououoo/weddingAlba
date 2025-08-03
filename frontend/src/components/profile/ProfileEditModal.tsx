import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileEdit } from './hooks/useProfile';
import LocationSelector from './LocationSelector';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
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
    handleSubmit: originalHandleSubmit
  } = useProfileEdit();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  if (!isOpen) return null;

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

  // 활동 지역 선택 핸들러
  const handleLocationSelect = (location: string) => {
    setActivityArea(location);
    setShowLocationSelector(false);
  };

  // 프로필 저장 핸들러 (모달 닫기 추가)
  const handleSubmit = async () => {
    try {
      await originalHandleSubmit();
      onClose(); // 성공시 모달 닫기
    } catch (err) {
      // 에러는 useProfileEdit에서 처리됨
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
        <div className="relative p-0 bg-white w-full max-w-md m-auto rounded-none min-h-screen">
          {/* 헤더 */}
          <div className="flex items-center p-4 border-b border-gray-200">
            <button onClick={onClose} className="mr-4" disabled={isSaving}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-bold flex-1">프로필 수정</h1>
          </div>

          {/* 오류 메시지 */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-4 rounded" role="alert">
              <p>{error}</p>
              <button 
                onClick={() => setError(null)}
                className="float-right text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              <p className="ml-3 text-gray-700">프로필 정보를 불러오는 중...</p>
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

          {/* 프로필 정보 */}
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
                  className="w-full p-3 bg-gray-100 rounded text-gray-700 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={activityArea}
                  onChange={(e) => setActivityArea(e.target.value)}
                  placeholder="활동 지역을 선택하거나 입력해주세요"
                  disabled={isLoading || isSaving}
                  maxLength={50}
                />
                <div className="absolute left-3 top-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLocationSelector(true)}
                  className="absolute right-3 top-3 text-blue-500 hover:text-blue-700"
                  disabled={isLoading || isSaving}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7M9 20l6-3M9 20V7M15 17l5.447-2.724A1 1 0 0021 13.382V2.618a1 1 0 00-1.447-.894L15 4M15 17V4M9 7l6-3" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                오른쪽 지도 아이콘을 클릭하여 지도에서 선택할 수 있습니다
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
            
            <div className="flex justify-between items-center py-4 border-t border-gray-200 mb-20">
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
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={isLoading || isSaving || !nickname.trim()}
              className={`w-full py-3 text-white font-medium rounded-md ${
                isLoading || isSaving || !nickname.trim()
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>

      {/* 위치 선택 모달 */}
      {showLocationSelector && (
        <LocationSelector
          value={activityArea}
          onChange={handleLocationSelect}
          onClose={() => setShowLocationSelector(false)}
        />
      )}
    </>
  );
};

export default ProfileEditModal;
