// UserProfileDTO.ts - 사용자 기본 정보 포함 프로필 데이터 타입 정의

export interface UserProfileDTO {
  // User 기본 정보
  userId: number;
  name?: string;
  email?: string;
  gender?: string;
  phoneNumber?: string;
  birth?: string;
  addressCity?: string;
  addressDistrict?: string;
  addressDetail?: string;
  
  // Profile 정보 (없을 수 있음)
  nickname?: string;           // 닉네임 (프로필이 있을 때만 필수)
  selfIntroduction?: string;   // 자기소개
  activityArea?: string;       // 활동 지역
  guestPower?: number;         // 하객력
  participationCount?: number; // 참여 횟수
  profileImageUrl?: string;    // 프로필 이미지 URL
}
