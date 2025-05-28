// profileApi.ts - 프로필 관련 API 호출 함수

import { get, put, post, ApiResponse } from '../../../utils/httpClient';
import { 
  ProfileResponseDTO, 
  ProfileUpdateRequestDTO, 
  UserProfileDTO, 
  ProfileImageUploadRequestDTO,
  ProfileImageUploadResponseDTO 
} from '../dto';

// API 기본 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// 프로필 API 모듈
export const profileApi = {
  // 내 프로필 정보 조회 (User + Profile 정보 통합)
  getMyProfile: async (): Promise<ApiResponse<UserProfileDTO>> => {
    try {
      // 실제 백엔드 API 호출
      return await get<UserProfileDTO>(`${API_BASE_URL}/profile/me`);
    } catch (error) {
      console.error('프로필 정보를 가져오는 중 오류 발생:', error);
      return {
        success: false,
        data: null,
        message: '프로필 정보를 불러오는데 실패했습니다.'
      };
    }
  },
  
  // 프로필 정보 수정
  updateProfile: async (profileData: ProfileUpdateRequestDTO): Promise<ApiResponse<ProfileResponseDTO>> => {
    try {
      // 실제 백엔드 API 호출
      return await put<ProfileResponseDTO>(`${API_BASE_URL}/profile/me`, profileData);
    } catch (error) {
      console.error('프로필 정보를 수정하는 중 오류 발생:', error);
      return {
        success: false,
        data: null,
        message: '프로필 정보 수정에 실패했습니다.'
      };
    }
  },
  
  // 프로필 이미지 업로드 (Base64 JSON 방식)
  uploadProfileImage: async (imageFile: File): Promise<ApiResponse<ProfileImageUploadResponseDTO>> => {
    try {
      // 파일을 Base64로 변환
      const base64Data = await convertFileToBase64(imageFile);
      
      const requestData: ProfileImageUploadRequestDTO = {
        imageData: base64Data,
        fileName: imageFile.name,
        fileSize: imageFile.size,
        mimeType: imageFile.type
      };
      
      // 실제 백엔드 API 호출 (JSON 방식)
      return await post<ProfileImageUploadResponseDTO>(`${API_BASE_URL}/profile/image`, requestData);
    } catch (error) {
      console.error('프로필 이미지 업로드 중 오류 발생:', error);
      return {
        success: false,
        data: null,
        message: '프로필 이미지 업로드에 실패했습니다.'
      };
    }
  }
};

// 파일을 Base64로 변환하는 유틸리티 함수
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // "data:image/jpeg;base64," 등의 접두사 제거
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      } else {
        reject(new Error('파일 읽기에 실패했습니다.'));
      }
    };
    reader.onerror = () => reject(new Error('파일 읽기 중 오류가 발생했습니다.'));
  });
};
