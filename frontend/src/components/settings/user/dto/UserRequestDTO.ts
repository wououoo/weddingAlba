// UserRequestDTO.ts - 사용자 정보 요청 데이터 타입 정의

// 사용자 정보 업데이트 요청 인터페이스
export interface UserUpdateRequestDTO {
  name?: string;           // 이름
  phoneNumber?: string;    // 전화번호 (백엔드 필드명에 맞춤)
  gender?: string;         // 성별 ('MALE', 'FEMALE')
  birth?: string | null;   // 생년월일 (백엔드 필드명에 맞춤)
  addressCity?: string;    // 권역 (백엔드 필드명에 맞춤)
  addressDistrict?: string; // 시/군/구 (백엔드 필드명에 맞춤)
  addressDetail?: string;   // 세부주소 (백엔드 필드명에 맞춤)
}

// 나중에 추가될 수 있는 다른 요청 DTO들
// export interface UserCreateRequestDTO { ... }
// export interface UserPasswordChangeRequestDTO { ... }
