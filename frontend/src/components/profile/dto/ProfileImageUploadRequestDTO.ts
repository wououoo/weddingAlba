// ProfileImageUploadRequestDTO.ts - 프로필 이미지 업로드 요청 데이터 타입 정의

export interface ProfileImageUploadRequestDTO {
  imageData: string;  // Base64 인코딩된 이미지 데이터
  fileName: string;   // 파일명
  fileSize: number;   // 파일 크기 (bytes)
  mimeType: string;   // MIME 타입 (image/jpeg, image/png 등)
}
