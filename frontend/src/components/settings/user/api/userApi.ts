// userApi.ts - 사용자 정보 API 호출 함수

import { get, put, ApiResponse } from '../../../../utils/httpClient';
import { UserResponseDTO } from '../dto/UserResponseDTO';
import { UserUpdateRequestDTO } from '../dto/UserRequestDTO';

// API 기본 URL - 백엔드 서버 URL로 설정 (필요시 환경 변수에서 가져오기)
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// 사용자 정보 API 모듈
export const userApi = {
  // 내 프로필 정보 조회
  getUserInfo: async (): Promise<ApiResponse<UserResponseDTO>> => {
    try {
      // 백엔드 API 호출
      return await get<UserResponseDTO>(`${API_BASE_URL}/user/edit`);
    } catch (error) {
      console.error('사용자 정보를 가져오는 중 오류 발생:', error);
      return {
        success: false,
        data: null,
        message: '사용자 정보를 불러오는데 실패했습니다.'
      };
    }
  },
  
  // 내 프로필 정보 수정
  updateUserInfo: async (userData: UserUpdateRequestDTO): Promise<ApiResponse<UserResponseDTO>> => {
    try {
      // 백엔드 API 호출
      return await put<UserResponseDTO>(`${API_BASE_URL}/user/edit`, userData);
    } catch (error) {
      console.error('사용자 정보를 수정하는 중 오류 발생:', error);
      return {
        success: false,
        data: null,
        message: '사용자 정보 수정에 실패했습니다.'
      };
    }
  }
};