// UserResponseDTO.ts - 사용자 정보 응답 데이터 타입 정의

// 사용자 기본 정보 인터페이스
export interface UserResponseDTO {
  userId: number;       // 사용자 ID
  name: string;         // 이름
  email: string;        // 이메일
  phoneNumber: string;  // 전화번호 (백엔드의 필드명에 맞춤)
  gender: string;       // 성별 ('MALE', 'FEMALE')
  birth: string | null; // 생년월일 (YYYY-MM-DD 형식, null일 수 있음)
  addressCity: string;  // 권역/시 (백엔드의 필드명에 맞춤)
  addressDistrict: string; // 구/군 (백엔드의 필드명에 맞춤)
  addressDetail: string;   // 세부주소 (백엔드의 필드명에 맞춤)
  createdAt: string;    // 가입일
}

// API 응답 공통 형식
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

// 다른 사용자 관련 응답 DTO들 (필요시)
// export interface UserSummaryResponseDTO { ... }
