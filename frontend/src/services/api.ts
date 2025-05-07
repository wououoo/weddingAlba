import { get, post, put, del } from '../utils/httpClient';

// API 기본 URL (백엔드 컨트롤러 경로와 일치시킴)
const API_BASE_URL = '';

// API 응답 타입 정의
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  [key: string]: any;
}

// 응답 처리 헬퍼 함수
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || '요청 처리 중 오류가 발생했습니다.');
  }
  
  return data as T;
};

// 사용자 API
export const userApi = {
  // 사용자 프로필 조회
  getProfile: async (): Promise<ApiResponse<any>> => {
    const response = await get(`${API_BASE_URL}/user/profile`);
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // 사용자 프로필 수정
  updateProfile: async (profileData: any): Promise<ApiResponse<any>> => {
    const response = await put(`${API_BASE_URL}/user/profile`, profileData);
    return handleResponse<ApiResponse<any>>(response);
  },
};

// 인증 API
export const authApi = {
  // 로그아웃
  logout: async (): Promise<ApiResponse<any>> => {
    const response = await post(`${API_BASE_URL}/auth/logout`, {});
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // 토큰 갱신
  refreshToken: async (): Promise<ApiResponse<any>> => {
    const response = await post(`${API_BASE_URL}/auth/refresh`, {});
    return handleResponse<ApiResponse<any>>(response);
  },
};

// 모집글 API
export const postingApi = {
  // 모집글 목록 조회
  getPostings: async (params?: any): Promise<ApiResponse<any>> => {
    // 쿼리 파라미터 생성
    const queryParams = params 
      ? `?${Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join('&')}`
      : '';
    
    const response = await get(`${API_BASE_URL}/postings${queryParams}`);
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // 모집글 상세 조회
  getPosting: async (id: number): Promise<ApiResponse<any>> => {
    const response = await get(`${API_BASE_URL}/postings/${id}`);
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // 모집글 등록
  createPosting: async (postingData: any): Promise<ApiResponse<any>> => {
    const response = await post(`${API_BASE_URL}/postings`, postingData);
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // 모집글 수정
  updatePosting: async (id: number, postingData: any): Promise<ApiResponse<any>> => {
    const response = await put(`${API_BASE_URL}/postings/${id}`, postingData);
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // 모집글 삭제
  deletePosting: async (id: number): Promise<ApiResponse<any>> => {
    const response = await del(`${API_BASE_URL}/postings/${id}`);
    return handleResponse<ApiResponse<any>>(response);
  },
};

// 신청 API
export const applyApi = {
  // 신청하기
  apply: async (postingId: number, applyData: any): Promise<ApiResponse<any>> => {
    const response = await post(`${API_BASE_URL}/postings/${postingId}/apply`, applyData);
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // 신청 취소
  cancelApply: async (applyId: number): Promise<ApiResponse<any>> => {
    const response = await post(`${API_BASE_URL}/applies/${applyId}/cancel`, {});
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // 신청 목록 조회 (내가 신청한)
  getMyApplies: async (): Promise<ApiResponse<any>> => {
    const response = await get(`${API_BASE_URL}/applies/my`);
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // 특정 모집글에 대한 신청 목록 조회 (내 모집글에 대한 신청)
  getAppliesForPosting: async (postingId: number): Promise<ApiResponse<any>> => {
    const response = await get(`${API_BASE_URL}/postings/${postingId}/applies`);
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // 신청 수락/거절
  respondToApply: async (applyId: number, status: 'accept' | 'reject'): Promise<ApiResponse<any>> => {
    const response = await post(`${API_BASE_URL}/applies/${applyId}/${status}`, {});
    return handleResponse<ApiResponse<any>>(response);
  },
};

// 북마크 API
export const bookmarkApi = {
  // 북마크 추가
  addBookmark: async (postingId: number, memo?: string): Promise<ApiResponse<any>> => {
    const response = await post(`${API_BASE_URL}/bookmarks`, { postingId, memo });
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // 북마크 삭제
  removeBookmark: async (bookmarkId: number): Promise<ApiResponse<any>> => {
    const response = await del(`${API_BASE_URL}/bookmarks/${bookmarkId}`);
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // 북마크 목록 조회
  getBookmarks: async (): Promise<ApiResponse<any>> => {
    const response = await get(`${API_BASE_URL}/bookmarks`);
    return handleResponse<ApiResponse<any>>(response);
  },
};
