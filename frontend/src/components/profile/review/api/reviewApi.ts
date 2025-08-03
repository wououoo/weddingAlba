// api/reviewApi.ts - 리뷰 관련 API 호출 함수

import { get, post, ApiResponse } from '../../../../utils/httpClient';

// API 기본 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// 게스트 리뷰 타입
export interface GuestReview {
  guestReviewId: number;
  applyId: number;
  postingId: number;
  userId: number;
  content: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  guestInfo: {
    nickname: string;
    profileImageUrl?: string;
    guestPower: number;
  };
  postingInfo: {
    title: string;
    appointmentDatetime: string;
    location: string;
  };
}

// 호스트 리뷰 타입
export interface HostReview {
  hostReviewId: number;
  applyId: number;
  postingId: number;
  userId: number;
  content: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  hostInfo: {
    nickname: string;
    profileImageUrl?: string;
    hostPower: number;
  };
  postingInfo: {
    title: string;
    appointmentDatetime: string;
    location: string;
  };
}

// 리뷰 목록 응답 타입
export interface ReviewListResponse {
  data: (GuestReview | HostReview)[];
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
  success: boolean;
  message: string;
}

// 리뷰 카운트 응답 타입
export interface ReviewCountResponse {
  count: number;
  success: boolean;
  message: string;
}

// 리뷰 생성 요청 타입
export interface ReviewCreateRequest {
  applyId: number;
  postingId: number;
  userId: number;
  content: string;
  score: number;
}

// 리뷰 API 모듈
export const reviewApi = {
  // 게스트 리뷰 목록 조회
  getGuestReviews: async (page: number = 1, limit: number = 10): Promise<ApiResponse<ReviewListResponse>> => {
    try {
      return await get<ReviewListResponse>(`${API_BASE_URL}/review/guest-reviews?page=${page}&limit=${limit}`);
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '게스트 리뷰 목록을 불러오는데 실패했습니다.'
      };
    }
  },

  // 호스트 리뷰 목록 조회
  getHostReviews: async (page: number = 1, limit: number = 10): Promise<ApiResponse<ReviewListResponse>> => {
    try {
      return await get<ReviewListResponse>(`${API_BASE_URL}/review/host-reviews?page=${page}&limit=${limit}`);
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '호스트 리뷰 목록을 불러오는데 실패했습니다.'
      };
    }
  },

  // 특정 사용자의 게스트 리뷰 목록 조회
  getGuestReviewsByUserId: async (userId: number, page: number = 1, limit: number = 10): Promise<ApiResponse<ReviewListResponse>> => {
    try {
      return await get<ReviewListResponse>(`${API_BASE_URL}/review/guest-reviews/${userId}?page=${page}&limit=${limit}`);
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '게스트 리뷰 목록을 불러오는데 실패했습니다.'
      };
    }
  },

  // 특정 사용자의 호스트 리뷰 목록 조회
  getHostReviewsByUserId: async (userId: number, page: number = 1, limit: number = 10): Promise<ApiResponse<ReviewListResponse>> => {
    try {
      return await get<ReviewListResponse>(`${API_BASE_URL}/review/host-reviews/${userId}?page=${page}&limit=${limit}`);
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '호스트 리뷰 목록을 불러오는데 실패했습니다.'
      };
    }
  },

  // 게스트 리뷰 카운트 조회
  getGuestReviewCount: async (): Promise<ApiResponse<ReviewCountResponse>> => {
    try {
      return await get<ReviewCountResponse>(`${API_BASE_URL}/review/guest-reviews/count`);
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '게스트 리뷰 카운트를 불러오는데 실패했습니다.'
      };
    }
  },

  // 호스트 리뷰 카운트 조회
  getHostReviewCount: async (): Promise<ApiResponse<ReviewCountResponse>> => {
    try {
      return await get<ReviewCountResponse>(`${API_BASE_URL}/review/host-reviews/count`);
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '호스트 리뷰 카운트를 불러오는데 실패했습니다.'
      };
    }
  },

  // 리뷰 작성 가능 여부 확인
  checkReviewWritable: async (applyId: number, reviewType: 'guest' | 'host'): Promise<ApiResponse<boolean>> => {
    try {
      return await get<boolean>(`${API_BASE_URL}/review/reviews/check-writable?applyId=${applyId}&reviewType=${reviewType}`);
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '리뷰 작성 가능 여부 확인에 실패했습니다.'
      };
    }
  },

  // 게스트 리뷰 생성
  createGuestReview: async (reviewData: ReviewCreateRequest): Promise<ApiResponse<GuestReview>> => {
    try {
      return await post<GuestReview>(`${API_BASE_URL}/review/guest-reviews`, reviewData);
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '게스트 리뷰 생성에 실패했습니다.'
      };
    }
  },

  // 호스트 리뷰 생성
  createHostReview: async (reviewData: ReviewCreateRequest): Promise<ApiResponse<HostReview>> => {
    try {
      return await post<HostReview>(`${API_BASE_URL}/review/host-reviews`, reviewData);
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '호스트 리뷰 생성에 실패했습니다.'
      };
    }
  }
};
