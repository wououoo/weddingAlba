import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useProfileEdit } from './hooks/useProfile';
import LocationSelector from './LocationSelector';
import { ProfileGalleryService, ProfileGalleryImage } from '../../services/ProfileGalleryService';

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

  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);
  const [isFileSelecting, setIsFileSelecting] = useState(false); // 파일 선택 중복 방지
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false); // 갤러리 전체 목록 모달
  
  // 프로필 갤러리 이미지들 (로컬 상태)
  const [galleryImages, setGalleryImages] = useState<ProfileGalleryImage[]>([]);
  const [originalGalleryImages, setOriginalGalleryImages] = useState<ProfileGalleryImage[]>([]); // 초기 로드된 이미지들
  const [pendingGalleryFiles, setPendingGalleryFiles] = useState<File[]>([]);
  const [deletedGalleryImageIds, setDeletedGalleryImageIds] = useState<number[]>([]); // 삭제된 이미지 ID들
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const maxGalleryImages = 5;

  // 컴포넌트 마운트 시 갤러리 이미지 로드
  useEffect(() => {
    loadGalleryImages();
  }, []);

  // 총 이미지 개수 계산
  const totalImageCount = galleryImages.length + pendingGalleryFiles.length;

  // 메인 갤러리 이미지 찾기
  const mainGalleryImage = galleryImages.find(img => img.isMain);
  
  // 표시할 프로필 이미지 결정 (우선순위: 첫 번째 pending 이미지 > 기존 프로필 이미지 > 메인 갤러리 이미지)
  const displayProfileImage = pendingGalleryFiles.length > 0
    ? URL.createObjectURL(pendingGalleryFiles[0])
    : profileImageUrl || mainGalleryImage?.imageUrl;

  // 갤러리 이미지 로드
  const loadGalleryImages = useCallback(async () => {
    try {
      setIsGalleryLoading(true);
      
      const images = await ProfileGalleryService.getGalleryImages();
      
      setGalleryImages(images);
      setOriginalGalleryImages(images); // 초기 상태 저장
    } catch (error) {
      setError('갤러리 이미지를 불러오는데 실패했습니다.');
    } finally {
      setIsGalleryLoading(false);
    }
  }, [setError]);

  // 프로필 이미지 변경 핸들러 (갤러리에 추가)
  const handleEditProfileImage = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (isFileSelecting) {
      return;
    }
    
    galleryFileInputRef.current?.click();
  }, [isFileSelecting]);

  // 갤러리 이미지 추가 핸들러
  const handleAddGalleryImage = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (isFileSelecting) {
      return;
    }
    
    galleryFileInputRef.current?.click();
  }, [isFileSelecting]);

  // 갤러리 파일 선택 핸들러 (프로필 이미지 편집과 갤러리 추가 통합)
  const handleGalleryFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // 중복 처리 방지
    if (isFileSelecting) {
      return;
    }
    
    setIsFileSelecting(true);
    
    const files = e.target.files;
    if (!files || files.length === 0) {
      setIsFileSelecting(false);
      return;
    }

    const newFiles: File[] = [];

    Array.from(files).forEach(file => {
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

      newFiles.push(file);
    });

    if (newFiles.length > 0) {
      
      // 상태 업데이트를 하나의 함수 호출로 처리
      setPendingGalleryFiles(prev => {
        
        // 최대 개수 체크
        const totalCount = galleryImages.length + prev.length + newFiles.length;
        if (totalCount > maxGalleryImages) {
          setError(`최대 ${maxGalleryImages}장까지만 업로드 가능합니다.`);
          return prev; // 기존 상태 유지
        }
        
        const updated = [...prev, ...newFiles];
        return updated;
      });
    }
    
    // 파일 input 즉시 초기화 (중복 선택 방지)
    e.target.value = '';
    
    // 다음 틱에서 플래그 해제
    setTimeout(() => {
      setIsFileSelecting(false);
    }, 100);
  }, [isFileSelecting, galleryImages.length, maxGalleryImages, setError]);

  // 갤러리 이미지 삭제 핸들러 (기존 이미지)
  const handleRemoveGalleryImage = (imageId: number) => {
    // UI에서 이미지 제거
    setGalleryImages(prev => prev.filter(img => img.id !== imageId));
    // 삭제할 이미지 ID 추가
    setDeletedGalleryImageIds(prev => [...prev, imageId]);
  };

  // 갤러리 파일 삭제 핸들러 (새로 추가된 파일)
  const handleRemovePendingFile = (fileIndex: number) => {
    setPendingGalleryFiles(prev => prev.filter((_, index) => index !== fileIndex));
  };

  // 메인 이미지 변경 핸들러
  const handleSetMainImage = async (imageId: number) => {
    try {
      
      // API 호출로 메인 이미지 설정
      await ProfileGalleryService.setMainGalleryImage(imageId);
      
      // 로컬 상태 업데이트
      setGalleryImages(prev => prev.map(img => ({
        ...img,
        isMain: img.id === imageId
      })));
      
    } catch (error) {
      setError('메인 이미지 설정에 실패했습니다.');
    }
  };

  // 갤러리 모달 열기
  const handleOpenGalleryModal = () => {
    setIsGalleryModalOpen(true);
  };

  // 프로필 저장 핸들러 (갤러리 포함 - 통합 저장)
  const handleSaveProfile = async () => {
    try {
      setIsGalleryLoading(true);

      // 통합 API 호출 - profileImage는 전달하지 않고 galleryImages만 전달
      // 서버에서 첫 번째 galleryImage를 메인 프로필 이미지로 처리하도록 함
      await ProfileGalleryService.saveProfileWithGallery(
        {
          nickname,
          selfIntroduction,
          activityArea
        },
        undefined, // profileImage는 전달하지 않음
        pendingGalleryFiles, // 갤러리 이미지들 (첫 번째가 메인이 됨)
        deletedGalleryImageIds // 삭제할 갤러리 이미지 ID들
      );
      

      // 성공 시 상태 정리
      setPendingGalleryFiles([]);
      setDeletedGalleryImageIds([]);
      
      // 갤러리 이미지 다시 로드 (메인 이미지 변경사항 반영)
      await loadGalleryImages();
      
      // 성공 메시지 또는 페이지 이동
      navigate('/mypage', { replace: true });
      
    } catch (error) {
      setError('프로필 저장에 실패했습니다.');
    } finally {
      setIsGalleryLoading(false);
    }
  };

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
            {displayProfileImage ? (
              <img 
                src={displayProfileImage} 
                alt="프로필 이미지" 
                className={`w-full h-full object-cover ${
                  pendingGalleryFiles.length > 0 ? 'border-2 border-blue-300' : ''
                }`}
              />
            ) : (
              // 기본 아이콘
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          
          {/* 새로 선택된 이미지 표시 */}
          {pendingGalleryFiles.length > 0 && (
            <div className="absolute top-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          )}
          
          {/* 메인 갤러리 이미지에서 가져온 경우 표시 */}
          {pendingGalleryFiles.length === 0 && !profileImageUrl && mainGalleryImage && (
            <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
              갤러리
            </div>
          )}
          
          <button 
            onClick={handleEditProfileImage}
            className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1"
            disabled={isLoading || isSaving}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 프로필 정보 입력 */}
      <div className="px-4 pb-20">
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

        {/* SNS 설정하기 */}
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex justify-between items-center py-4">
            <span className="font-medium">SNS 설정하기</span>
            <div className="flex items-center text-gray-500">
              <span className="mr-2 text-sm">입력한 SNS정보가 없습니다.</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 프로필 갤러리 */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">프로필 갤러리</span>
            <div className="flex items-center gap-2">
              {totalImageCount > 0 && (
                <button
                  onClick={handleOpenGalleryModal}
                  className="flex items-center text-gray-600 text-sm border border-gray-300 px-2 py-1 rounded"
                  disabled={isLoading || isSaving || isGalleryLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  전체목록보기
                </button>
              )}
              {totalImageCount < maxGalleryImages && (
                <button
                  onClick={handleAddGalleryImage}
                  className="flex items-center text-red-500 text-sm"
                  disabled={isLoading || isSaving || isGalleryLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  사진 추가
                </button>
              )}
            </div>
          </div>
          
          {/* 갤러리 이미지 스크롤 영역 */}
          {isGalleryLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
              <span className="ml-2 text-gray-600">처리 중...</span>
            </div>
          ) : totalImageCount > 0 ? (
            <div className="overflow-x-auto">
              <div className="flex space-x-3 pb-2" style={{width: 'max-content'}}>
                        {/* 추가 버튼 (최대 개수 미달 시에만 표시) */}
                {totalImageCount < maxGalleryImages && (
                  <div 
                    onClick={handleAddGalleryImage}
                    className="flex-shrink-0 w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-xs text-gray-500 text-center">여러장<br/>선택</span>
                  </div>
                )}
                
                {/* 새로 추가된 파일들 (미리보기) - 첫 번째가 메인 프로필 이미지가 됨 */}
                {pendingGalleryFiles.map((file, index) => (
                  <div key={`pending-${index}`} className="relative flex-shrink-0">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden border-2 border-blue-300">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`새 이미지 ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* 첫 번째 이미지는 메인 프로필로 표시 */}
                    {index === 0 && (
                      <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                        메인
                      </div>
                    )}
                    
                    {/* 저장 대기 표시 */}
                    <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    
                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => handleRemovePendingFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      disabled={isGalleryLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* 기존 갤러리 이미지들 */}
                {galleryImages.map((image, index) => (
                  <div key={`existing-${image.id}`} className="relative flex-shrink-0">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      <img 
                        src={image.imageUrl} 
                        alt={`갤러리 이미지 ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // 이미지 로드 실패 시 대체 텍스트 표시
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.error-text')) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'error-text text-xs text-red-500 text-center';
                            errorDiv.textContent = '이미지 로드 실패';
                            parent.appendChild(errorDiv);
                          }
                        }}
                      />
                    </div>
                    
                    {/* 메인 이미지 표시 (새 이미지가 없을 때만) */}
                    {image.isMain && pendingGalleryFiles.length === 0 && (
                      <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                        메인
                      </div>
                    )}
                    
                    {/* 디버그 정보 */}
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate w-full">
                      ID: {image.id} | Order: {image.imageOrder}
                    </div>
                    
                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => handleRemoveGalleryImage(image.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      disabled={isGalleryLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 이미지가 없을 때 표시할 빈 상태 */
            <div className="flex items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <div 
                  onClick={handleAddGalleryImage}
                  className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">프로필 사진을 추가해보세요</p>
                <p className="text-gray-400 text-xs mt-1">한 번에 여러 장을 선택할 수 있어요</p>
              </div>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            최대 {maxGalleryImages}장까지 업로드 가능합니다. 한 번에 여러 장을 선택할 수 있습니다.
            {pendingGalleryFiles.length > 0 && (
              <span className="text-blue-600 font-medium">
                {' '}({pendingGalleryFiles.length}장이 저장 대기 중)
              </span>
            )}
          </p>
          
          {/* 숨겨진 갤러리 파일 입력 */}
          <input
            ref={galleryFileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <button
          onClick={handleSaveProfile}
          disabled={isLoading || isSaving || isGalleryLoading}
          className={`w-full py-3 text-white font-medium rounded-md ${
            isLoading || isSaving || isGalleryLoading
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isGalleryLoading ? '갤러리 저장 중...' : isSaving ? '프로필 저장 중...' : '저장'}
        </button>
        {pendingGalleryFiles.length > 0 && (
          <>
            <p className="text-center text-sm text-blue-600 mt-1">
              첫 번째 이미지가 메인 프로필 이미지가 됩니다
            </p>
            <p className="text-center text-sm text-blue-600 mt-1">
              {pendingGalleryFiles.length}장의 이미지가 갤러리에 저장됩니다
            </p>
          </>
        )}
        {deletedGalleryImageIds.length > 0 && (
          <p className="text-center text-sm text-red-600 mt-1">
            {deletedGalleryImageIds.length}장의 이미지가 삭제됩니다
          </p>
        )}
      </div>

      {/* 갤러리 전체 목록 모달 */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-h-[80vh] rounded-t-lg overflow-hidden">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">갤러리 관리</h3>
              <button 
                onClick={() => setIsGalleryModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              {/* 안내 텍스트 */}
              <p className="text-sm text-gray-600 mb-4">
                메인 프로필 이미지로 사용할 사진을 선택하세요. 메인 이미지는 프로필 상단에 표시됩니다.<br/>
                <span className="text-xs text-gray-500">한 번에 여러 장의 사진을 선택하여 추가할 수 있습니다.</span>
              </p>

              {/* 새로 추가된 파일들 */}
              {pendingGalleryFiles.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">새로 추가된 사진 ({pendingGalleryFiles.length}장)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {pendingGalleryFiles.map((file, index) => (
                      <div key={`pending-${index}`} className="relative">
                        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 border-blue-300">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`새 이미지 ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* 첫 번째 이미지는 메인으로 표시 */}
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            메인 예정
                          </div>
                        )}
                        
                        {/* 순서 표시 */}
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                          {index + 1}
                        </div>
                        
                        {/* 삭제 버튼 */}
                        <button
                          onClick={() => handleRemovePendingFile(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    첫 번째 사진이 메인 프로필 이미지가 됩니다.
                  </p>
                </div>
              )}

              {/* 기존 갤러리 이미지들 */}
              {galleryImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">기존 갤러리 사진</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {galleryImages.map((image) => (
                      <div key={`existing-${image.id}`} className="relative">
                        <div 
                          className={`aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 ${
                            image.isMain ? 'border-blue-500' : 'border-gray-300'
                          }`}
                          onClick={() => handleSetMainImage(image.id)}
                        >
                          <img 
                            src={image.imageUrl} 
                            alt={`갤러리 이미지`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* 메인 이미지 표시 */}
                        {image.isMain && pendingGalleryFiles.length === 0 && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            메인
                          </div>
                        )}
                        
                        {/* 메인 선택 버튼 */}
                        {!image.isMain && pendingGalleryFiles.length === 0 && (
                          <button
                            onClick={() => handleSetMainImage(image.id)}
                            className="absolute bottom-2 left-2 bg-white bg-opacity-90 text-xs px-2 py-1 rounded text-gray-700 hover:bg-opacity-100"
                          >
                            메인으로 설정
                          </button>
                        )}
                        
                        {/* 삭제 버튼 */}
                        <button
                          onClick={() => handleRemoveGalleryImage(image.id)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 빈 상태 */}
              {galleryImages.length === 0 && pendingGalleryFiles.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">갤러리에 사진이 없습니다</p>
                  <button
                    onClick={() => {
                      setIsGalleryModalOpen(false);
                      handleAddGalleryImage();
                    }}
                    className="mt-2 text-red-500 text-sm"
                  >
                    사진 추가하기
                  </button>
                </div>
              )}
            </div>

            {/* 모달 하단 버튼 */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="flex-1 py-2 text-gray-600 font-medium"
                >
                  닫기
                </button>
                <button
                  onClick={() => {
                    setIsGalleryModalOpen(false);
                    handleAddGalleryImage();
                  }}
                  className="flex-1 py-2 bg-red-500 text-white font-medium rounded"
                  disabled={totalImageCount >= maxGalleryImages}
                >
                  사진 추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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