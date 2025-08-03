import { get, post, put, del, ApiResponse } from '../utils/httpClient';

// API 기본 URL (백엔드 컨트롤러 경로와 일치시킴)
const API_BASE_URL = '';

// 사용자 API
export const userApi = {
  // 사용자 프로필 조회
  getProfile: async (): Promise<ApiResponse<any>> => {
    try {
      return await get(`${API_BASE_URL}/user/profile`);
    } catch (error) {
      console.error('프로필 조회 오류:', error);
      return {
        success: false,
        data: null,
        message: '프로필 정보를 불러오는데 실패했습니다.'
      };
    }
  },
  
  // 사용자 프로필 수정
  updateProfile: async (profileData: any): Promise<ApiResponse<any>> => {
    try {
      return await put(`${API_BASE_URL}/user/profile`, profileData);
    } catch (error) {
      console.error('프로필 수정 오류:', error);
      return {
        success: false,
        data: null,
        message: '프로필 정보를 수정하는데 실패했습니다.'
      };
    }
  },
};

// 인증 API
export const authApi = {
  // 로그아웃
  logout: async (): Promise<ApiResponse<any>> => {
    try {
      return await post(`${API_BASE_URL}/auth/logout`, {});
    } catch (error) {
      console.error('로그아웃 오류:', error);
      return {
        success: false,
        data: null,
        message: '로그아웃 처리에 실패했습니다.'
      };
    }
  },
  
  // 토큰 갱신
  refreshToken: async (): Promise<ApiResponse<any>> => {
    try {
      return await post(`${API_BASE_URL}/auth/refresh`, {});
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      return {
        success: false,
        data: null,
        message: '토큰 갱신에 실패했습니다.'
      };
    }
  },
};

// 모집글 API
export const postingApi = {
  // 모집글 목록 조회
  getPostings: async (params?: any): Promise<ApiResponse<any>> => {
    try {
      // 쿼리 파라미터 생성
      const queryParams = params 
        ? `?${Object.entries(params)
            .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
            .join('&')}`
        : '';
      
      return await get(`${API_BASE_URL}/postings${queryParams}`);
    } catch (error) {
      console.error('모집글 목록 조회 오류:', error);
      return {
        success: false,
        data: null,
        message: '모집글 목록을 불러오는데 실패했습니다.'
      };
    }
  },
  
  // 모집글 상세 조회
  getPosting: async (id: number): Promise<ApiResponse<any>> => {
    try {
      return await get(`${API_BASE_URL}/postings/${id}`);
    } catch (error) {
      console.error('모집글 상세 조회 오류:', error);
      return {
        success: false,
        data: null,
        message: '모집글 정보를 불러오는데 실패했습니다.'
      };
    }
  },
  
  // 모집글 등록
  createPosting: async (postingData: any): Promise<ApiResponse<any>> => {
    try {
      return await post(`${API_BASE_URL}/postings`, postingData);
    } catch (error) {
      console.error('모집글 등록 오류:', error);
      return {
        success: false,
        data: null,
        message: '모집글 등록에 실패했습니다.'
      };
    }
  },
  
  // 모집글 수정
  updatePosting: async (id: number, postingData: any): Promise<ApiResponse<any>> => {
    try {
      return await put(`${API_BASE_URL}/postings/${id}`, postingData);
    } catch (error) {
      console.error('모집글 수정 오류:', error);
      return {
        success: false,
        data: null,
        message: '모집글 수정에 실패했습니다.'
      };
    }
  },
  
  // 모집글 삭제
  deletePosting: async (id: number): Promise<ApiResponse<any>> => {
    try {
      return await del(`${API_BASE_URL}/postings/${id}`);
    } catch (error) {
      console.error('모집글 삭제 오류:', error);
      return {
        success: false,
        data: null,
        message: '모집글 삭제에 실패했습니다.'
      };
    }
  },
};

// 신청 API
export const applyApi = {
  // 신청하기
  apply: async (postingId: number, applyData: any): Promise<ApiResponse<any>> => {
    try {
      return await post(`${API_BASE_URL}/postings/${postingId}/apply`, applyData);
    } catch (error) {
      console.error('신청 오류:', error);
      return {
        success: false,
        data: null,
        message: '신청 처리에 실패했습니다.'
      };
    }
  },
  
  // 신청 취소
  cancelApply: async (applyId: number): Promise<ApiResponse<any>> => {
    try {
      return await post(`${API_BASE_URL}/applies/${applyId}/cancel`, {});
    } catch (error) {
      console.error('신청 취소 오류:', error);
      return {
        success: false,
        data: null,
        message: '신청 취소에 실패했습니다.'
      };
    }
  },
  
  // 신청 목록 조회 (내가 신청한)
  getMyApplies: async (): Promise<ApiResponse<any>> => {
    try {
      return await get(`${API_BASE_URL}/applies/my`);
    } catch (error) {
      console.error('신청 목록 조회 오류:', error);
      return {
        success: false,
        data: null,
        message: '신청 목록을 불러오는데 실패했습니다.'
      };
    }
  },
  
  // 특정 모집글에 대한 신청 목록 조회 (내 모집글에 대한 신청)
  getAppliesForPosting: async (postingId: number): Promise<ApiResponse<any>> => {
    try {
      return await get(`${API_BASE_URL}/postings/${postingId}/applies`);
    } catch (error) {
      console.error('모집글 신청 목록 조회 오류:', error);
      return {
        success: false,
        data: null,
        message: '신청 목록을 불러오는데 실패했습니다.'
      };
    }
  },
  
  // 신청 수락/거절
  respondToApply: async (applyId: number, status: 'accept' | 'reject'): Promise<ApiResponse<any>> => {
    try {
      return await post(`${API_BASE_URL}/applies/${applyId}/${status}`, {});
    } catch (error) {
      console.error('신청 응답 오류:', error);
      return {
        success: false,
        data: null,
        message: '신청 응답 처리에 실패했습니다.'
      };
    }
  },
};

// 북마크 API
export const bookmarkApi = {
  // 북마크 추가
  addBookmark: async (postingId: number, memo?: string): Promise<ApiResponse<any>> => {
    try {
      return await post(`${API_BASE_URL}/bookmarks`, { postingId, memo });
    } catch (error) {
      console.error('북마크 추가 오류:', error);
      return {
        success: false,
        data: null,
        message: '북마크 추가에 실패했습니다.'
      };
    }
  },
  
  // 북마크 삭제
  removeBookmark: async (bookmarkId: number): Promise<ApiResponse<any>> => {
    try {
      return await del(`${API_BASE_URL}/bookmarks/${bookmarkId}`);
    } catch (error) {
      console.error('북마크 삭제 오류:', error);
      return {
        success: false,
        data: null,
        message: '북마크 삭제에 실패했습니다.'
      };
    }
  },
  
  // 북마크 목록 조회
  getBookmarks: async (): Promise<ApiResponse<any>> => {
    try {
      return await get(`${API_BASE_URL}/bookmarks`);
    } catch (error) {
      console.error('북마크 목록 조회 오류:', error);
      return {
        success: false,
        data: null,
        message: '북마크 목록을 불러오는데 실패했습니다.'
      };
    }
  },
};