import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, isAuthenticated, removeTokens } from '../OAuth2/authUtils';
import { userApi } from '../services/api';

// 사용자 타입 정의
interface User {
  userId: number;
  name: string;
  email: string;
  // 필요한 사용자 속성 추가
}

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

// 기본값으로 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  logout: async () => {},
});

// 인증 컨텍스트 제공자 컴포넌트
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // 로그인 상태 확인 및 사용자 정보 로드
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated()) {
        try {
          // 현재 인증 토큰으로 사용자 프로필 조회
          const response = await userApi.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('사용자 정보 로드 실패:', error);
          // 토큰은 존재하지만 API 호출 실패 시 로그아웃 처리
          await removeTokens();
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // 로그아웃 함수
  const logout = async (): Promise<void> => {
    try {
      await removeTokens();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    }
  };

  // 인증 상태 값
  const value = {
    user,
    isLoggedIn: !!user,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 인증 컨텍스트 사용을 위한 훅
export const useAuth = () => useContext(AuthContext);
