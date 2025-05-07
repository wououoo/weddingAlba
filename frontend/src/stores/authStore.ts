import { create } from 'zustand';
import { getAccessToken, setAccessToken, removeTokens, refreshAccessToken } from '../OAuth2/authUtils';
import { userApi, authApi } from '../services/api';

// 사용자 타입 정의
interface User {
  userId: number;
  name: string;
  email: string;
  // 추가 필요한 사용자 속성
}

// 인증 스토어 상태 타입
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  
  // 액션
  initialize: () => Promise<void>;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
}

// 인증 스토어 생성
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: !!getAccessToken(), // 초기값은 토큰 존재 여부로 설정
  loading: true,
  error: null,
  
  // 앱 초기화 시 호출할 함수
  initialize: async () => {
    try {
      set({ loading: true });
      const token = getAccessToken();
      
      if (token) {
        try {
          // 토큰이 있으면 사용자 정보 로드
          const response = await userApi.getProfile();
          set({ 
            user: response.data,
            isLoggedIn: true,
            error: null
          });
        } catch (error) {
          // 오류 발생 시 토큰 갱신 시도
          const refreshed = await get().refreshToken();
          
          if (refreshed) {
            // 토큰 갱신 성공 시 다시 시도
            const retryResponse = await userApi.getProfile();
            set({ 
              user: retryResponse.data,
              isLoggedIn: true,
              error: null
            });
          } else {
            // 갱신 실패 시 로그아웃
            await removeTokens();
            set({ 
              user: null,
              isLoggedIn: false,
              error: "세션이 만료되었습니다. 다시 로그인해주세요."
            });
          }
        }
      } else {
        set({ 
          user: null,
          isLoggedIn: false,
          error: null
        });
      }
    } catch (error) {
      set({ 
        error: "인증 상태 초기화 중 오류가 발생했습니다."
      });
    } finally {
      set({ loading: false });
    }
  },
  
  // 로그인 함수 (OAuth 로그인 성공 후 호출)
  login: async (token: string) => {
    try {
      set({ loading: true });
      
      // 토큰 저장
      setAccessToken(token);
      
      // 사용자 정보 로드
      const response = await userApi.getProfile();
      
      set({ 
        user: response.data,
        isLoggedIn: true,
        error: null
      });
    } catch (error) {
      set({ 
        user: null,
        isLoggedIn: false,
        error: "로그인 중 오류가 발생했습니다."
      });
    } finally {
      set({ loading: false });
    }
  },
  
  // 로그아웃 함수
  logout: async () => {
    try {
      set({ loading: true });
      
      // 서버에 로그아웃 요청
      await authApi.logout();
      
      // 토큰 삭제
      await removeTokens();
      
      set({ 
        user: null,
        isLoggedIn: false,
        error: null
      });
    } catch (error) {
      // 로그아웃 실패 시에도 클라이언트 측에서는 로그아웃 처리
      await removeTokens();
      set({ 
        user: null,
        isLoggedIn: false,
        error: "로그아웃 중 오류가 발생했습니다."
      });
    } finally {
      set({ loading: false });
    }
  },
  
  // 토큰 갱신 함수
  refreshToken: async () => {
    try {
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      return false;
    }
  },
  
  // 사용자 정보 업데이트
  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user;
    
    if (currentUser) {
      set({ 
        user: { ...currentUser, ...userData }
      });
    }
  }
}));
