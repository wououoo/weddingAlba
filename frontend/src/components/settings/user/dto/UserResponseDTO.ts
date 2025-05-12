// UserResponseDTO.ts - 사용자 정보 응답 데이터 타입 정의

// 사용자 기본 정보 인터페이스
export interface UserResponseDTO {
  id: number;          // 사용자 ID
  name: string;        // 이름
  email: string;       // 이메일
  phone: string;       // 전화번호
  gender: string;      // 성별 ('M', 'F', '')
  birthdate: string;   // 생년월일 (YYYY-MM-DD 형식)
  profileImage: string | null; // 프로필 이미지 URL
  region: string;      // 권역 (서울/경기/인천, 대전/충청 등)
  city: string;        // 시/군/구
  detailAddress: string; // 세부주소
  createdAt: string;   // 가입일
  updatedAt: string;   // 정보 수정일
}

// 사용자 정보 업데이트 요청 인터페이스
export interface UserUpdateRequestDTO {
  name?: string;       // 이름
  phone?: string;      // 전화번호
  gender?: string;     // 성별
  birthdate?: string;  // 생년월일
  region?: string;     // 권역
  city?: string;       // 시/군/구
  detailAddress?: string; // 세부주소
}

// API 응답 공통 형식
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}
