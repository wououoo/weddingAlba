// useUserEdit.ts - 사용자 정보 편집 관련 로직을 담당하는 커스텀 훅

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/userApi';
import { UserUpdateRequestDTO } from '../dto/UserRequestDTO';
import { isAuthenticated } from '../../../../OAuth2/authUtils';
import { BirthDateParts, GenderOption } from '../types/types';
import { DaumPostcodeData } from '../../../../types/daum-postcode';

export function useUserEdit() {
  const navigate = useNavigate();
  
  // 상태 관리
  const [name, setName] = useState('');
  const [region, setRegion] = useState(''); // addressCity에 매핑
  const [city, setCity] = useState('');     // addressDistrict에 매핑
  const [detailAddress, setDetailAddress] = useState(''); // addressDetail에 매핑
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');   // phoneNumber에 매핑
  const [birthdate, setBirthdate] = useState(''); // birth에 매핑
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddressSearch, setShowAddressSearch] = useState(false);

  // 모달 상태 관리
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // 컴포넌트 마운트 시 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      // 로그인 여부 확인
      if (!isAuthenticated()) {
        setError('로그인이 필요합니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await userApi.getUserInfo();
        
        if (response.success && response.data) {
          const userData = response.data;
          
          // 사용자 정보 설정 (백엔드 필드명에 맞게 매핑)
          setName(userData.name || '');
          setRegion(userData.addressCity || '');
          setCity(userData.addressDistrict || '');
          setDetailAddress(userData.addressDetail || '');
          setGender(userData.gender || '');
          setPhone(userData.phoneNumber || '');
          setBirthdate(userData.birth || '');
          
          setError(null);
        } else {
          setError('사용자 정보를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
        console.error('사용자 정보 로딩 오류:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  // 생년월일 파싱
  const parseBirthDate = (birthString: string): BirthDateParts => {
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
  const genderOptions: GenderOption[] = [
    { value: 'MALE', label: '남성' },  // 백엔드 성별 값에 맞춤
    { value: 'FEMALE', label: '여성' }, // 백엔드 성별 값에 맞춤
  ];

  // 전화번호 입력 포맷팅
  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  // 성별 선택 처리
  const handleGenderSelect = (selectedGender: string) => {
    setGender(selectedGender);
    setShowGenderModal(false);
  };

  // 주소 검색 완료 처리
  const handleAddressComplete = (data: DaumPostcodeData) => {
    console.log("주소 검색 결과:", data); // 디버깅용
    
    // 시/도를 권역으로 매핑
    let mappedRegion = '';
    const sido = data.sido;
    
    if (sido === '서울' || sido === '경기' || sido === '인천') {
      mappedRegion = '서울/경기/인천';
    } else if (sido === '대전' || sido === '충청북도' || sido === '충청남도' || sido === '세종') {
      mappedRegion = '대전/충청';
    } else if (sido === '대구' || sido === '경상북도') {
      mappedRegion = '대구/경북';
    } else if (sido === '부산' || sido === '경상남도' || sido === '울산') {
      mappedRegion = '부산/경남';
    } else if (sido === '광주' || sido === '전라북도' || sido === '전라남도') {
      mappedRegion = '광주/전라';
    } else if (sido === '강원' || sido === '강원도') {
      mappedRegion = '강원';
    } else if (sido === '제주' || sido === '제주도' || sido === '제주특별자치도') {
      mappedRegion = '제주';
    }
    
    setRegion(mappedRegion);
    setCity(data.sigungu || data.bname); // 시군구 정보가 없으면 법정동 이름 사용
    
    // 주소 정보 처리 (도로명 주소나 지번 주소 중 선택)
    let fullAddress = '';
    if (data.userSelectedType === 'R') {
      // 도로명 주소
      fullAddress = data.roadAddress;
    } else {
      // 지번 주소
      fullAddress = data.jibunAddress;
    }
    
    // 건물명이 있으면 추가 (상세 주소용)
    if (data.buildingName) {
      setDetailAddress(data.buildingName);
    } else {
      // 상세 주소 필드는 사용자가 직접 입력할 수 있도록 비워둠
      setDetailAddress('');
    }
    
    setShowAddressSearch(false);
  };

  // 폼 제출 처리
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      setError('로그인이 필요합니다.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 수정할 사용자 정보 (백엔드 필드명에 맞춤)
      const userData: UserUpdateRequestDTO = {
        name,
        addressCity: region,
        addressDistrict: city,
        addressDetail: detailAddress,
        gender,
        phoneNumber: phone,
        birth: birthdate || null
      };
      
      // API 호출
      const response = await userApi.updateUserInfo(userData);
      
      if (response.success) {
        alert('내 정보가 수정되었습니다.');
        navigate('/settings');
      } else {
        setError(response.message || '정보 수정에 실패했습니다.');
      }
    } catch (err) {
      setError('정보 수정 중 오류가 발생했습니다.');
      console.error('사용자 정보 수정 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 훅에서 모든 필요한 값과 함수를 반환
  return {
    // 상태
    name, setName,
    region, setRegion,
    city, setCity,
    detailAddress, setDetailAddress,
    gender,
    phone,
    birthdate,
    isLoading,
    error,
    
    // 모달 상태
    showGenderModal, setShowGenderModal,
    showDatePicker, setShowDatePicker,
    showAddressSearch, setShowAddressSearch,
    
    // 옵션 데이터
    birthParts,
    regionOptions,
    genderOptions,
    
    // 이벤트 핸들러
    handlePhoneNumberChange,
    handleBirthdateSelect,
    handleSubmit,
    handleGenderSelect,
    handleAddressComplete,
    
    // 네비게이션
    navigate
  };
}
