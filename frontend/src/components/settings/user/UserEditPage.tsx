import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // 생년월일 입력 포맷팅
  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    
    if (value.length > 4) {
      value = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6)}`;
    } else if (value.length > 4) {
      value = `${value.slice(0, 4)}-${value.slice(4)}`;
    }
    
    setBirthdate(value);
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
              <div className="flex space-x-4">
                {genderOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      value={option.value}
                      checked={gender === option.value}
                      onChange={() => setGender(option.value)}
                      className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="ml-2">{option.label}</span>
                  </label>
                ))}
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
              <input
                id="birthdate"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={birthdate}
                onChange={handleBirthdateChange}
                placeholder="YYYY-MM-DD"
              />
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
    </div>
  );
};

export default UserEditPage;