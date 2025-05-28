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
    
    try {
      // 시/도를 권역으로 맵핑
      let mappedRegion = '';
      const sido = data.sido || '';
      
      if (sido.includes('서울') || sido.includes('경기') || sido.includes('인천')) {
        mappedRegion = '서울/경기/인천';
      } else if (sido.includes('대전') || sido.includes('충청') || sido.includes('세종')) {
        mappedRegion = '대전/충청';
      } else if (sido.includes('대구') || sido.includes('경북') || sido.includes('경상북도')) {
        mappedRegion = '대구/경북';
      } else if (sido.includes('부산') || sido.includes('경남') || sido.includes('경상남도') || sido.includes('울산')) {
        mappedRegion = '부산/경남';
      } else if (sido.includes('광주') || sido.includes('전라') || sido.includes('전라남도') || sido.includes('전라북도')) {
        mappedRegion = '광주/전라';
      } else if (sido.includes('강원')) {
        mappedRegion = '강원';
      } else if (sido.includes('제주')) {
        mappedRegion = '제주';
      } else {
        // 매칭이 안 되는 경우
        console.warn('매칭되지 않는 시/도:', sido);
        // 기본값으로 첫 번째 권역 사용
        mappedRegion = regionOptions[0];
      }
      
      setRegion(mappedRegion);
      setCity(data.sigungu || data.bname || ''); // 시군구 정보가 없으면 법정동 이름 사용
      
      // 상세주소 구성 개선 - 동/번지 등 상세 정보 추출
      let detailAddressParts = [];
      
      // 1. 도로명 주소에서 상세 정보 추출 (roadAddress)
      if (data.roadAddress) {
        console.log('도로명 주소:', data.roadAddress);
        const roadParts = data.roadAddress.split(' ');
        // 시군구 다음 부분들을 상세주소로 사용
        const sigunguName = data.sigungu || '';
        if (sigunguName) {
          const sigunguIndex = roadParts.findIndex(part => part === sigunguName);
          if (sigunguIndex >= 0 && sigunguIndex < roadParts.length - 1) {
            const remainingParts = roadParts.slice(sigunguIndex + 1);
            detailAddressParts.push(...remainingParts);
          }
        }
      }
      
      // 2. 지번 주소에서 상세 정보 추출 (jibunAddress) - 도로명에서 추출하지 못한 경우
      if (detailAddressParts.length === 0 && data.jibunAddress) {
        console.log('지번 주소:', data.jibunAddress);
        const jibunParts = data.jibunAddress.split(' ');
        const sigunguName = data.sigungu || '';
        if (sigunguName) {
          const sigunguIndex = jibunParts.findIndex(part => part === sigunguName);
          if (sigunguIndex >= 0 && sigunguIndex < jibunParts.length - 1) {
            const remainingParts = jibunParts.slice(sigunguIndex + 1);
            detailAddressParts.push(...remainingParts);
          }
        }
      }
      
      // 3. 법정동명 추가 (기본 주소에 없는 경우)
      if (data.bname && !detailAddressParts.some(part => part.includes(data.bname))) {
        detailAddressParts.unshift(data.bname);
      }
      
      // 4. 건물명 추가
      if (data.buildingName && !detailAddressParts.some(part => part.includes(data.buildingName))) {
        detailAddressParts.push(data.buildingName);
      }
      
      // 5. 상세주소 조합
      const newDetailAddress = detailAddressParts.filter(part => part.trim()).join(' ').trim();
      
      console.log('추출된 상세주소 부분들:', detailAddressParts);
      console.log('최종 상세주소:', newDetailAddress);
      
      if (newDetailAddress) {
        setDetailAddress(newDetailAddress);
      } else {
        // 상세주소를 추출할 수 없는 경우 비우기
        setDetailAddress('');
      }
    } catch (error) {
      console.error('주소 처리 오류:', error);
      setError('주소 정보 처리 중 오류가 발생했습니다.');
    } finally {
      setShowAddressSearch(false);
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      setError('로그인이 필요합니다.');
      return;
    }
    
    // 이름은 필수 입력
    if (!name.trim()) {
      setError('이름은 필수 입력 항목입니다.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 수정할 사용자 정보 (백엔드 필드명에 맞춤)
      // 빈 값이 아닌 필드만 전송
      const userData: UserUpdateRequestDTO = {};
      
      // 이름은 필수
      userData.name = name.trim();
      
      // 선택적 필드들
      if (gender) userData.gender = gender;
      if (phone.trim()) userData.phoneNumber = phone.trim();
      if (birthdate) userData.birth = birthdate;
      if (region.trim()) userData.addressCity = region.trim();
      if (city.trim()) userData.addressDistrict = city.trim();
      if (detailAddress.trim()) userData.addressDetail = detailAddress.trim();
      
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
    error, setError,
    
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