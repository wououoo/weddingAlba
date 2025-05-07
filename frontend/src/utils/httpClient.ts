import { getAccessToken, setAccessToken, refreshAccessToken, removeTokens } from '../OAuth2/authUtils';

// 토큰 만료 오류가 발생했는지 확인하는 함수
const isTokenExpiredError = (error: any): boolean => {
  // 서버 응답에서 토큰 만료 확인 (서버 응답 형식에 맞게 수정 필요)
  return error?.response?.status === 401 && 
         error?.response?.data?.message?.includes('만료된 토큰') || 
         error?.response?.data?.message?.includes('expired token');
};

// API 요청을 위한 기본 fetch 함수 (토큰 갱신 로직 포함)
export const fetchWithAuth = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  // 요청에 Authorization 헤더 추가
  const token = getAccessToken();
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  // 첫 번째 요청 시도
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // 쿠키 포함 (리프레시 토큰)
    });

    // 401 Unauthorized 응답인 경우 (토큰 만료)
    if (response.status === 401) {
      const responseData = await response.json().catch(() => ({}));
      
      // 토큰 만료 메시지 확인 (서버 응답 형식에 맞게 수정 필요)
      if (responseData.message?.includes('만료된 토큰') || 
          responseData.message?.includes('expired token')) {
        
        // 토큰 갱신 시도
        const newToken = await refreshAccessToken();
        
        // 토큰 갱신 성공 시 요청 재시도
        if (newToken) {
          const newHeaders = {
            ...options.headers,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`
          };
          
          // 갱신된 토큰으로 요청 재시도
          return fetch(url, {
            ...options,
            headers: newHeaders,
            credentials: 'include',
          });
        } else {
          // 토큰 갱신 실패 시 로그아웃 처리 (이미 refreshAccessToken 내부에서 처리됨)
          throw new Error('토큰 갱신 실패');
        }
      }
    }
    
    return response;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};

// GET 요청
export const get = (url: string, options: RequestInit = {}): Promise<Response> => {
  return fetchWithAuth(url, {
    ...options,
    method: 'GET',
  });
};

// POST 요청
export const post = (url: string, data: any, options: RequestInit = {}): Promise<Response> => {
  return fetchWithAuth(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// PUT 요청
export const put = (url: string, data: any, options: RequestInit = {}): Promise<Response> => {
  return fetchWithAuth(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// DELETE 요청
export const del = (url: string, options: RequestInit = {}): Promise<Response> => {
  return fetchWithAuth(url, {
    ...options,
    method: 'DELETE',
  });
};
