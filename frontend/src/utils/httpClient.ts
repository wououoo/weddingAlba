// httpClient.ts - API 응답 타입 및 HTTP 클라이언트 유틸리티

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// API 응답 인터페이스
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message?: string;
}

// HTTP 클라이언트 클래스
class HttpClient {
  private instance: AxiosInstance;
  
  constructor(baseURL: string = '') {
    this.instance = axios.create({
      baseURL,
      timeout: 10000, // 10초
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // 요청 인터셉터
    this.instance.interceptors.request.use(
      (config) => {
        // 토큰이 있으면 헤더에 추가
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // 디버깅을 위한 로그
        console.log('Request:', {
          url: config.url,
          method: config.method,
          headers: config.headers,
          token: token ? 'EXISTS' : 'NOT_FOUND'
        });
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // 응답 인터셉터
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        // 401 에러 처리 (인증 만료)
        if (error.response && error.response.status === 401) {
          try {
            // 리프레시 토큰으로 새 액세스 토큰 요청
            const refreshResponse = await fetch('/auth/refresh', {
              method: 'POST',
              credentials: 'include',  // 쿠키 포함
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (refreshResponse.ok) {
              const data = await refreshResponse.json();
              if (data.success && data.token) {
                // 새 토큰 저장
                localStorage.setItem('accessToken', data.token);
                // 원래 요청을 새 토큰으로 재시도
                error.config.headers['Authorization'] = `Bearer ${data.token}`;
                return this.instance.request(error.config);
              }
            }
          } catch (refreshError) {
            console.error('토큰 갱신 실패:', refreshError);
          }
          
          // 리프레시 실패 시 로그아웃 처리
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
      
        // 디버깅을 위한 로그 추가
        console.error('HTTP Error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        });
        return Promise.reject(error);
      }
    );
  }
  
  // HTTP GET 요청
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      console.error('GET 요청 오류:', error);
      
      // 서버에서 응답이 있는 경우 해당 메시지 사용
      if (error.response?.data?.message) {
        return {
          success: false,
          data: null,
          message: error.response.data.message
        };
      }
      
      return {
        success: false,
        data: null,
        message: '요청 처리 중 오류가 발생했습니다.'
      };
    }
  }
  
  // HTTP POST 요청
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      console.error('POST 요청 오류:', error);
      
      // 서버에서 응답이 있는 경우 해당 메시지 사용
      if (error.response?.data?.message) {
        return {
          success: false,
          data: null,
          message: error.response.data.message
        };
      }
      
      return {
        success: false,
        data: null,
        message: '요청 처리 중 오류가 발생했습니다.'
      };
    }
  }
  
  // HTTP PUT 요청
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      console.error('PUT 요청 오류:', error);
      
      // 서버에서 응답이 있는 경우 해당 메시지 사용
      if (error.response?.data?.message) {
        return {
          success: false,
          data: null,
          message: error.response.data.message
        };
      }
      
      return {
        success: false,
        data: null,
        message: '요청 처리 중 오류가 발생했습니다.'
      };
    }
  }
  
  // HTTP DELETE 요청
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      console.error('DELETE 요청 오류:', error);
      
      // 서버에서 응답이 있는 경우 해당 메시지 사용
      if (error.response?.data?.message) {
        return {
          success: false,
          data: null,
          message: error.response.data.message
        };
      }
      
      return {
        success: false,
        data: null,
        message: '요청 처리 중 오류가 발생했습니다.'
      };
    }
  }
}

// 기본 HTTP 클라이언트 인스턴스 생성
export const httpClient = new HttpClient('/api');

// 개별 함수 내보내기
export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return httpClient.get<T>(url, config);
};

export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return httpClient.post<T>(url, data, config);
};

export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return httpClient.put<T>(url, data, config);
};

export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return httpClient.delete<T>(url, config);
};

export default httpClient;