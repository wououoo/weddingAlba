// 토큰 관련 유틸리티 함수

// 로컬 스토리지에서 토큰 가져오기
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// 로컬 스토리지에 토큰 저장
export const setAccessToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

// 토큰 새로고침 (리프레시 토큰을 사용하여 새 액세스 토큰 받기)
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    // 리프레시 토큰은 HTTP-Only 쿠키로 자동 전송되므로 별도로 보내지 않아도 됨
    const response = await fetch('/auth/refresh', {
      method: 'POST',
      credentials: 'include',  // 쿠키 자동 포함
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    
    if (data.success) {
      setAccessToken(data.token);
      return data.token;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // 실패 시 자동 로그아웃
    removeTokens();
    return null;
  }
};

// 토큰 삭제 (로그아웃)
export const removeTokens = async (): Promise<boolean> => {
  try {
    // 로컬 스토리지의 액세스 토큰 삭제
    localStorage.removeItem('accessToken');
    
    // 서버에 로그아웃 요청 (리프레시 토큰 쿠키 삭제 및 Redis에서 토큰 제거)
    const response = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include',  // 쿠키 포함
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Logout failed:', error);
    // 클라이언트 측에서만이라도 일단 로그아웃 처리
    localStorage.removeItem('accessToken');
    return false;
  }
};

// 로그인 여부 확인
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// HTTP 요청 헤더에 토큰 추가
export const getAuthHeader = (): Record<string, string> => {
  const token = getAccessToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
