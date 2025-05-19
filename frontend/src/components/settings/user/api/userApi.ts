// userApi.ts - 사용자 정보 API 호출 함수

import { get, put, ApiResponse } from '../../../../utils/httpClient';
import { UserResponseDTO } from '../dto/UserResponseDTO';
import { UserUpdateRequestDTO } from '../dto/UserRequestDTO';

// API 기본 URL
const API_BASE_URL = '';

// 사용자 정보 API 모듈
export const userApi = {
  // 내 프로필 정보 조회
  getUserInfo: async (): Promise<ApiResponse<UserResponseDTO>> => {
    try {
      // 실제 API 연동 시 아래 주석 해제
      // return await get<UserResponseDTO>(`${API_BASE_URL}/user/profile`);
      
      // 더미 데이터 반환
      return {
        success: true,
        data: {
          id: 1,
          username: 'user123',
          name: '홍길동',
          profileImage: null,
          gender: 'MALE',
          phoneNumber: '010-1234-5678',
          birth: '1990-01-01',
          addressCity: '서울/경기/인천',
          addressDistrict: '강남구',
          addressDetail: '',
          role: 'USER',
          createdAt: '2023-01-01T00:00:00',
          updatedAt: '2023-01-01T00:00:00'
        },
        message: '사용자 정보를 성공적으로 불러왔습니다.'
      };
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
      // 실제 API 연동 시 아래 주석 해제
      // return await put<UserResponseDTO>(`${API_BASE_URL}/user/profile`, userData);
      
      // 더미 응답 반환
      return {
        success: true,
        data: {
          id: 1,
          username: 'user123',
          name: userData.name || '홍길동',
          profileImage: null,
          gender: userData.gender || 'MALE',
          phoneNumber: userData.phoneNumber || '010-1234-5678',
          birth: userData.birth || '1990-01-01',
          addressCity: userData.addressCity || '서울/경기/인천',
          addressDistrict: userData.addressDistrict || '강남구',
          addressDetail: userData.addressDetail || '',
          role: 'USER',
          createdAt: '2023-01-01T00:00:00',
          updatedAt: new Date().toISOString()
        },
        message: '사용자 정보가 성공적으로 수정되었습니다.'
      };
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