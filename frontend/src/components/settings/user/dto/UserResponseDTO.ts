// UserResponseDTO.ts - 사용자 정보 응답 데이터 타입 정의

// 사용자 기본 정보 인터페이스
export interface UserResponseDTO {
  id?: number;          // 사용자 ID
  username?: string;    // 사용자 아이디
  name: string;         // 이름
  email?: string;       // 이메일
  profileImage?: string | null; // 프로필 이미지 URL
  phoneNumber: string;  // 전화번호 (백엔드의 필드명에 맞춤)
  gender: string;       // 성별 ('MALE', 'FEMALE')
  birth: string | null; // 생년월일 (YYYY-MM-DD 형식, null일 수 있음)
  addressCity: string;  // 권역/시 (백엔드의 필드명에 맞춤)
  addressDistrict: string; // 구/군 (백엔드의 필드명에 맞춤)
  addressDetail: string;   // 세부주소 (백엔드의 필드명에 맞춤)
  role?: string;        // 역할 ('USER', 'ADMIN' 등)
  createdAt?: string;   // 가입일
  updatedAt?: string;   // 수정일
}