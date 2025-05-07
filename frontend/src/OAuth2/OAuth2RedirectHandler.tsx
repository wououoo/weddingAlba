import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAccessToken } from './authUtils';
// import { useAuthStore } from '../stores/authStore'; // 주석 처리

const OAuth2RedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { login } = useAuthStore(); // 주석 처리
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(true);

  useEffect(() => {
    // URL에서 토큰 파라미터 가져오기
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    const handleAuth = async () => {
      if (token) {
        try {
          // 토큰을 로컬 스토리지에 저장하기만 하고 상태 관리는 주석 처리
          setAccessToken(token);
          // await login(token); // 주석 처리
          
          console.log('토큰 저장 성공:', token);
          
          // 홈 페이지로 리다이렉트
          navigate('/', { replace: true });
        } catch (error) {
          console.error('로그인 처리 중 오류:', error);
          setErrorMessage('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
          setIsProcessing(false);
          
          // 자동 리다이렉트 제거 - 사용자가 버튼을 클릭해야 이동
          // navigate('/login', { 
          //   replace: true,
          //   state: { error: '로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.' }
          // });
        }
      } else if (error) {
        // 에러 발생 시 처리
        console.error('OAuth 로그인 에러:', error);
        
        if (error === 'rate_limit_exceeded') {
          setErrorMessage('카카오 API 요청 제한에 걸렸습니다. 잠시 후(약 1시간) 다시 시도해주세요.');
        } else {
          setErrorMessage('소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
        
        setIsProcessing(false);
        
        // 자동 리다이렉트 제거 - 사용자가 버튼을 클릭해야 이동
        // navigate('/login', { 
        //   replace: true,
        //   state: { error: '소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.' }
        // });
      } else {
        // 토큰과 에러 모두 없는 경우
        setErrorMessage('로그인 정보가 없습니다. 다시 로그인해주세요.');
        setIsProcessing(false);
        
        // 자동 리다이렉트 제거 - 사용자가 버튼을 클릭해야 이동
        // navigate('/login', { replace: true });
      }
    };

    handleAuth();
  // }, [location, navigate, login]); // 의존성 배열에서 login 제거
  }, [location, navigate]); // 수정된 의존성 배열

  // 로그인 페이지로 이동하는 핸들러
  const handleGoToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        {isProcessing ? (
          <>
            <h2 className="text-xl font-semibold mb-4">로그인 처리 중...</h2>
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-red-500">로그인 실패</h2>
            <p className="mb-6 text-gray-700">{errorMessage}</p>
            <button
              onClick={handleGoToLogin}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              로그인 페이지로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;