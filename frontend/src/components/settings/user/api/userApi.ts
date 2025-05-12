// userApi.ts - 사용자 정보 API 호출 함수

import { get, put } from '../../../../utils/httpClient';
import { UserResponseDTO, UserUpdateRequestDTO, ApiResponse } from '../dto/UserResponseDTO';

// API 기본 URL
const API_BASE_URL = '';

// 응답 처리 헬퍼 함수
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || '요청 처리 중 오류가 발생했습니다.');
  }
  
  return data as T;
};

// 사용자 정보 API 모듈
export const userApi = {
  // 내 프로필 정보 조회
  getUserInfo: async (): Promise<ApiResponse<UserResponseDTO>> => {
    try {
      const response = await get(`${API_BASE_URL}/user/profile`);
      return handleResponse<ApiResponse<UserResponseDTO>>(response);
    } catch (error) {
      console.error('사용자 정보를 가져오는 중 오류 발생:', error);
      throw error;
    }
  },
  
  // 내 프로필 정보 수정
  updateUserInfo: async (userData: UserUpdateRequestDTO): Promise<ApiResponse<UserResponseDTO>> => {
    try {
      const response = await put(`${API_BASE_URL}/user/profile`, userData);
      return handleResponse<ApiResponse<UserResponseDTO>>(response);
    } catch (error) {
      console.error('사용자 정보를 수정하는 중 오류 발생:', error);
      throw error;
    }
  }
};
