// ProfileUpdateRequestDTO.ts - 프로필 수정 요청 데이터 타입 정의

export interface ProfileUpdateRequestDTO {
  nickname: string;            // 닉네임 (필수)
  selfIntroduction?: string;   // 자기소개 (선택)
  activityArea?: string;       // 활동 지역 (선택)
  profileImageUrl?: string;    // 프로필 이미지 URL (선택)
}
