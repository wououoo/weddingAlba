import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 날짜 선택기 Props 타입 정의
interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  initialYear?: number;
  initialMonth?: number;
  initialDay?: number;
}

const UserEditPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [name, setName] = useState('우경주');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');

  // 모달 상태 관리
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // 생년월일 파싱
  const parseBirthDate = (birthString: string) => {
    if (!birthString) return { year: 2000, month: 1, day: 1 };
    const parts = birthString.split('-');
    if (parts.length === 3) {
      return {
        year: parseInt(parts[0]),
        month: parseInt(parts[1]),
        day: parseInt(parts[2])
      };
    }
    return { year: 2000, month: 1, day: 1 };
  };
  
  const birthParts = parseBirthDate(birthdate);

  // 지역 옵션
  const regionOptions = [
    '서울/경기/인천',
    '대전/충청',
    '대구/경북',
    '부산/경남',
    '광주/전라',
    '강원',
    '제주',
  ];

  // 성별 옵션
  const genderOptions = [
    { value: 'M', label: '남성' },
    { value: 'F', label: '여성' },
  ];

  // 전화번호 입력 포맷팅
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    
    if (value.length > 7) {
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    }
    
    setPhone(value);
  };

  // 생년월일 선택 처리
  const handleBirthdateSelect = (date: string) => {
    setBirthdate(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기서 정보 저장 로직 구현
    console.log({
      name,
      region,
      city,
      detailAddress,
      gender,
      phone,
      birthdate
    });
    
    alert('내 정보가 수정되었습니다.');
    navigate('/settings');
  };

  // 성별 선택 모달 컴포넌트
  const GenderSelectionModal: React.FC = () => {
    const handleGenderSelect = (selectedGender: string) => {
      setGender(selectedGender);
      setShowGenderModal(false);
    };
    
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
              onClick={() => handleGenderSelect('M')}
            >
              남자 {gender === 'M' && <span className="text-purple-600 ml-2">✓</span>}
            </div>
            <div 
              className="p-4 text-center hover:bg-gray-100 active:bg-gray-200 border-b"
              onClick={() => handleGenderSelect('F')}
            >
              여자 {gender === 'F' && <span className="text-purple-600 ml-2">✓</span>}
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
    
    const [selectedYear, setSelectedYear] = useState(initialYear);
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const [selectedDay, setSelectedDay] = useState(initialDay);
    
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
      
      {/* 사용자 정보 수정 폼 */}
      <div className="flex-1 overflow-auto p-4 pb-20">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          {/* 기본 정보 섹션 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">기본 정보</h2>
            
            {/* 이름 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                이름
              </label>
              <input
                id="name"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                성별
              </label>
              <div 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex justify-between items-center cursor-pointer"
                onClick={() => setShowGenderModal(true)}
              >
                <span>
                  {gender === 'M' ? '남자' : gender === 'F' ? '여자' : '선택안함'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* 전화번호 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                전화번호
              </label>
              <input
                id="phone"
                type="tel"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={phone}
                onChange={handlePhoneNumberChange}
                placeholder="010-0000-0000"
                required
              />
            </div>
            
            {/* 생년월일 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthdate">
                생년월일
              </label>
              <div 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex justify-between items-center cursor-pointer"
                onClick={() => setShowDatePicker(true)}
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
            <h2 className="text-lg font-semibold mb-3 text-gray-700">주소 정보</h2>
            
            {/* 권역 선택 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="region">
                권역
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">권역을 선택하세요</option>
                {regionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 시/군/구 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                시/군/구
              </label>
              <input
                id="city"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="시/군/구를 입력하세요"
              />
            </div>
            
            {/* 세부주소 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="detailAddress">
                세부주소
              </label>
              <input
                id="detailAddress"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="세부주소를 입력하세요 (선택사항)"
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
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2 ml-2"
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
    </div>
  );
};

export default UserEditPage;