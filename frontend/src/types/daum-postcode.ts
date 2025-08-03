export interface DaumPostcodeData {
  zonecode: string;         // 우편번호
  address: string;          // 기본 주소
  addressType: 'R' | 'J';   // R: 도로명, J: 지번
  roadAddress: string;      // 도로명 주소
  jibunAddress: string;     // 지번 주소
  bname: string;            // 법정동/법정리 이름
  buildingName: string;     // 건물명
  apartment: 'Y' | 'N';     // 아파트 여부
  userSelectedType?: 'R' | 'J'; // 사용자가 선택한 주소 타입
  autoRoadAddress?: string; // 도로명 주소 변환 시 원본 주소
  autoJibunAddress?: string; // 지번 주소 변환 시 원본 주소
  postcode?: string;        // 구 우편번호 (6자리)
  sido?: string;            // 시도 이름
  sigungu?: string;         // 시군구 이름
  sigunguCode?: string;     // 시군구 코드
  roadnameCode?: string;    // 도로명 코드
  query?: string;           // 검색어
  
  // 간혹 추가될 수 있는 필드들
  [key: string]: any;       // 기타 필드에 대한 처리
}