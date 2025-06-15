// ProfileResponseDTO.ts - 프로필 정보 응답 데이터 타입 정의

export interface ProfileResponseDTO {
  userId: number;
  nickname: string;            // 닉네임 (필수)
  selfIntroduction?: string;   // 자기소개 (선택)
  activityArea?: string;       // 활동 지역 (선택)
  guestPower?: number;         // 하객력 (선택)
  participationCount?: number; // 참여 횟수 (선택)
  profileImageUrl?: string;    // 프로필 이미지 URL (선택)
}
