// UserEditPage.tsx - 사용자 정보 편집 화면 UI 컴포넌트

import React, { useEffect } from 'react';
import { useUserEdit } from './hooks/useUserEdit';
import { DatePickerProps } from './types/types';
import { DaumPostcodeData } from '../../../types/daum-postcode';

// 전역 타입 선언 (window.daum 접근을 위함)
declare global {
  interface Window {
    daum: any;
  }
}

const UserEditPage: React.FC = () => {
  // 커스텀 훅에서 상태와 핸들러 가져오기
  const {
    name, setName,
    region, setRegion,
    city, setCity,
    detailAddress, setDetailAddress,
    gender,
    phone,
    birthdate,
    isLoading,
    error, setError,
    showGenderModal, setShowGenderModal,
    showDatePicker, setShowDatePicker,
    showAddressSearch, setShowAddressSearch,
    birthParts,
    regionOptions,
    handlePhoneNumberChange,
    handleBirthdateSelect,
    handleSubmit,
    handleGenderSelect,
    handleAddressComplete,
    navigate
  } = useUserEdit();

  // daum 우편번호 서비스 초기화
  useEffect(() => {
    // 주소 검색 모달이 표시될 때만 실행
    if (showAddressSearch) {
      // 약간의 딜레이를 주어 DOM이 완전히 렌더링되도록 함
      setTimeout(() => {
        const container = document.getElementById('postcode-container');
        
        if (!container) {
          console.error('Postcode container not found');
          return;
        }

        // 이미 스크립트가 로드되어 있는지 확인
        if (window.daum && window.daum.Postcode) {
          initPostcode(container);
        } else {
          // 스크립트 로드
          const script = document.createElement('script');
          script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
          script.async = true;
          script.onload = () => {
            initPostcode(container);
          };
          script.onerror = () => {
            console.error('Failed to load Daum postcode script');
            setError('주소 검색 서비스를 불러오는데 실패했습니다.');
          };
          document.head.appendChild(script);
        }
      }, 300);
    }
  }, [showAddressSearch]);

  // 우편번호 서비스 초기화 함수
  const initPostcode = (container: HTMLElement) => {
    try {
      new window.daum.Postcode({
        oncomplete: (data: any) => {
          console.log('주소 검색 결과:', data);
          
          // 필요한 데이터만 추출하여 전달
          const postcodeData: DaumPostcodeData = {
            zonecode: data.zonecode || '',
            address: data.address || '',
            addressType: (data.addressType as 'R' | 'J') || 'R',
            roadAddress: data.roadAddress || '',
            jibunAddress: data.jibunAddress || '',
            bname: data.bname || '',
            buildingName: data.buildingName || '',
            apartment: (data.apartment as 'Y' | 'N') || 'N',
            userSelectedType: data.userSelectedType,
            sido: data.sido || '',
            sigungu: data.sigungu || ''
          };
          
          handleAddressComplete(postcodeData);
          setShowAddressSearch(false);
        },
        width: '100%',
        height: '100%'
      }).embed(container);
    } catch (e) {
      console.error('Daum postcode error:', e);
      setError('주소 검색 서비스 초기화에 실패했습니다.');
    }
  };

  // 성별 선택 모달 컴포넌트
  const GenderSelectionModal: React.FC = () => {
    if (!showGenderModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
        <div className="bg-white w-full rounded-t-lg max-h-[50vh] overflow-auto">
          <div className="p-4 text-center text-xl font-medium border-b">
            성별 선택
          </div>
          <div>
            <div 
              className="p-4 text-center hover:bg-gray-100 active:bg-gray-200 border-b"
              onClick={() => handleGenderSelect('MALE')}
            >
              남자 {gender === 'MALE' && <span className="text-purple-600 ml-2">✓</span>}
            </div>
            <div 
              className="p-4 text-center hover:bg-gray-100 active:bg-gray-200 border-b"
              onClick={() => handleGenderSelect('FEMALE')}
            >
              여자 {gender === 'FEMALE' && <span className="text-purple-600 ml-2">✓</span>}
            </div>
            <div 
              className="p-4 text-center hover:bg-gray-100 active:bg-gray-200 border-b"
              onClick={() => handleGenderSelect('')}
            >
              선택안함 {gender === '' && <span className="text-purple-600 ml-2">✓</span>}
            </div>
          </div>
          <div 
            className="p-4 text-center bg-gray-100 font-medium"
            onClick={() => setShowGenderModal(false)}
          >
            저장
          </div>
        </div>
      </div>
    );
  };

  // 날짜 선택기 컴포넌트
  const DatePicker: React.FC<DatePickerProps> = ({ 
    visible, 
    onClose, 
    onSelect, 
    initialYear = 2000, 
    initialMonth = 1, 
    initialDay = 1 
  }) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    
    const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month, 0).getDate();
    };
    
    const [selectedYear, setSelectedYear] = React.useState(initialYear);
    const [selectedMonth, setSelectedMonth] = React.useState(initialMonth);
    const [selectedDay, setSelectedDay] = React.useState(initialDay);
    
    const days = Array.from(
      { length: getDaysInMonth(selectedYear, selectedMonth) }, 
      (_, i) => i + 1
    );
    
    const handleSave = () => {
      const formattedMonth = selectedMonth.toString().padStart(2, '0');
      const formattedDay = selectedDay.toString().padStart(2, '0');
      onSelect(`${selectedYear}-${formattedMonth}-${formattedDay}`);
      onClose();
    };
    
    if (!visible) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
        <div className="bg-white w-full rounded-t-lg">
          <div className="p-4 text-center text-xl font-medium border-b">
            생년월일 선택
          </div>
          
          <div className="flex justify-between p-4">
            {/* 년도 선택 */}
            <div className="flex-1 h-48 overflow-auto px-2 border-r">
              {years.map((year) => (
                <div 
                  key={year} 
                  className={`p-2 text-center ${selectedYear === year ? 'text-purple-600 font-bold' : ''}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}년
                </div>
              ))}
            </div>
            
            {/* 월 선택 */}
            <div className="flex-1 h-48 overflow-auto px-2 border-r">
              {months.map((month) => (
                <div 
                  key={month} 
                  className={`p-2 text-center ${selectedMonth === month ? 'text-purple-600 font-bold' : ''}`}
                  onClick={() => {
                    setSelectedMonth(month);
                    // 선택된 일자가 새 월의 최대 일수보다 크면 조정
                    const maxDays = getDaysInMonth(selectedYear, month);
                    if (selectedDay > maxDays) {
                      setSelectedDay(maxDays);
                    }
                  }}
                >
                  {month}월
                </div>
              ))}
            </div>
            
            {/* 일 선택 */}
            <div className="flex-1 h-48 overflow-auto px-2">
              {days.map((day) => (
                <div 
                  key={day} 
                  className={`p-2 text-center ${selectedDay === day ? 'text-purple-600 font-bold' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}일
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 grid grid-cols-2 gap-2">
            <button
              className="p-3 text-center font-medium bg-gray-200 rounded-md"
              onClick={onClose}
            >
              취소
            </button>
            <button
              className="p-3 text-center font-medium bg-purple-600 text-white rounded-md"
              onClick={handleSave}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 로딩 컴포넌트
  if (isLoading && !error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex items-center p-4 border-b border-gray-200 bg-white">
          <button onClick={() => navigate('/settings', { replace: true })} className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">내 정보 수정</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-700">정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 메인 UI 렌더링
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <button onClick={() => navigate('/settings', { replace: true })} className="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">내 정보 수정</h1>
      </div>
      
      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* 사용자 정보 수정 폼 */}
      <div className="flex-1 overflow-auto p-4 pb-20">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          {/* 기본 정보 섹션 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">기본 정보</h2>
            
            {/* 이름 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                placeholder="이름을 입력해주세요"
                required
              />
            </div>
          </div>
          
          {/* 개인 정보 섹션 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">개인 정보</h2>
            
            {/* 성별 선택 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                성별 <span className="text-gray-500 text-xs font-normal">(선택사항)</span>
              </label>
              <div 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex justify-between items-center cursor-pointer"
                onClick={() => !isLoading && setShowGenderModal(true)}
              >
                <span>
                  {gender === 'MALE' ? '남자' : gender === 'FEMALE' ? '여자' : '선택안함'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* 전화번호 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                전화번호 <span className="text-gray-500 text-xs font-normal">(선택사항)</span>
              </label>
              <input
                id="phone"
                type="tel"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={phone}
                onChange={handlePhoneNumberChange}
                placeholder="010-0000-0000"
                disabled={isLoading}
              />
            </div>
            
            {/* 생년월일 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthdate">
                생년월일 <span className="text-gray-500 text-xs font-normal">(선택사항)</span>
              </label>
              <div 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex justify-between items-center cursor-pointer"
                onClick={() => !isLoading && setShowDatePicker(true)}
              >
                <span>
                  {birthdate || 'YYYY-MM-DD'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* 주소 정보 섹션 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">주소 정보 <span className="text-gray-500 text-sm font-normal">(선택사항)</span></h2>
            
            {/* 주소 검색 버튼 */}
            <div className="mb-4">
              <button 
                type="button"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                onClick={() => setShowAddressSearch(true)}
                disabled={isLoading}
              >
                주소 검색
              </button>
            </div>
            
            {/* 권역 표시 (읽기 전용) */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="region">
                권역
              </label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100">
                {region || '주소 검색으로 선택해주세요'}
              </div>
            </div>
            
            {/* 시/군/구 표시 (읽기 전용) */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                시/군/구
              </label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100">
                {city || '주소 검색으로 선택해주세요'}
              </div>
            </div>
            
            {/* 상세주소 입력 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="detailAddress">
                상세주소
              </label>
              <input
                id="detailAddress"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="상세주소를 입력해주세요 (예: 101동 1002호)"
                disabled={isLoading}
              />
            </div>
          </div>
          
          {/* 버튼 그룹 */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <div className="max-w-md mx-auto flex items-center justify-between">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2 mr-2"
                onClick={() => navigate('/settings', { replace: true })}
                disabled={isLoading}
              >
                취소
              </button>
              <button
                type="submit"
                className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2 ml-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                저장
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* 성별 선택 모달 */}
      <GenderSelectionModal />
      
      {/* 생년월일 선택 모달 */}
      <DatePicker 
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={handleBirthdateSelect}
        initialYear={birthParts.year}
        initialMonth={birthParts.month}
        initialDay={birthParts.day}
      />
      
      {/* 주소 검색 모달 */}
      {showAddressSearch && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center" id="daum-postcode-modal">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-4 m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">주소 검색</h3>
              <button 
                onClick={() => setShowAddressSearch(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <div id="postcode-container" style={{ height: '450px', width: '100%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEditPage;