// api/bookmarksApi.ts - 북마크 관련 API 호출 함수

import { get, put, post, del, ApiResponse } from '../../../utils/httpClient';

// API 기본 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// 북마크 목록 응답 타입
export interface BookmarkItem {
  bookmarkId: number;
  postingId: number;
  marcDate: string;
  userId: number;
  memo: string | null;
  posting: {
    postingId: number;
    title: string;
    appointmentDatetime: string;
    location: string;
    isSelf: number;
    personName: string;
    personPhoneNumber: string;
    hasMobileInvitation: number;
    registrationDatetime: string;
  };
  isBookmarked: boolean;
}

export interface BookmarkListResponse {
  data: BookmarkItem[];
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
}

export interface BookmarkCreateRequest {
  postingId: number;
  memo?: string | null;
}

export interface BookmarkUpdateMemoRequest {
  memo: string;
}

// 북마크 API 모듈
export const bookmarksApi = {
  // 북마크 목록 조회
  getBookmarks: async (page: number = 1, limit: number = 10): Promise<ApiResponse<BookmarkListResponse>> => {
    try {
      return await get<BookmarkListResponse>(`${API_BASE_URL}/bookmarks?page=${page}&limit=${limit}`);
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '북마크 목록을 불러오는데 실패했습니다.'
      };
    }
  },

  // 북마크 추가
  createBookmark: async (bookmarkData: BookmarkCreateRequest): Promise<ApiResponse<BookmarkItem>> => {
    try {
      return await post<BookmarkItem>(`${API_BASE_URL}/bookmarks`, bookmarkData);
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '북마크 추가에 실패했습니다.'
      };
    }
  },

  // 북마크 삭제
  deleteBookmark: async (bookmarkId: number): Promise<ApiResponse<string>> => {
    try {
      return await del<string>(`${API_BASE_URL}/bookmarks/${bookmarkId}`);
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '북마크 삭제에 실패했습니다.'
      };
    }
  },

  // 북마크 메모 수정
  updateBookmarkMemo: async (bookmarkId: number, memoData: BookmarkUpdateMemoRequest): Promise<ApiResponse<BookmarkItem>> => {
    try {
      return await put<BookmarkItem>(`${API_BASE_URL}/bookmarks/${bookmarkId}/memo`, memoData);
    } catch (error) {
      return {
        success: false,
        data: null,
        message: '북마크 메모 수정에 실패했습니다.'
      };
    }
  }
};