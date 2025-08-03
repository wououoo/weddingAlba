import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KakaoLoginButton from './KakaoLoginButton';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 폼 상태
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('회원가입:', { name, email, password });
    // 회원가입 API 호출 로직 추가 예정
  };

  const handleKakaoLogin = () => {
    // 백엔드 서버로 OAuth2 요청
    window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E1E8EE] font-['Fira_Sans',Helvetica,Arial,sans-serif]">
      <div className="rounded-[32px] h-[690px] w-[375px] overflow-hidden shadow-lg">
        {/* 메인 카드 섹션 */}
        <div className="h-[570px] w-full bg-[#6B92A4] relative">
          {/* 배경 이미지 (의자 이미지) */}
          <div 
            className="absolute inset-0 bg-cover bg-bottom z-0"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=bf884ad570b50659c5fa2dc2cfb20ecf&auto=format&fit=crop&w=1000&q=100')", 
              opacity: 0.7 
            }}
          ></div>
          
          <div className="flex flex-col items-center pt-16 relative z-10">
            <h2 className="text-center text-3xl font-bold mb-2 text-white">
              Sign up
            </h2>
            <p className="text-center text-white text-sm mb-6">
              새 계정을 만들어 서비스를 이용하세요
            </p>
            
            <div className="rounded-xl bg-white w-[75%] overflow-hidden shadow-md">
              <form onSubmit={handleSignup}>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border-b border-gray-200 focus:outline-none text-gray-700" 
                  placeholder="Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border-b border-gray-200 focus:outline-none text-gray-700" 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                  type="password" 
                  className="w-full px-4 py-3 focus:outline-none text-gray-700" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </form>
            </div>
            
            <button
              type="submit"
              className="mt-4 w-[75%] bg-gray-700 hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition-colors duration-300"
              onClick={handleSignup}
            >
              Sign up
            </button>
          </div>
        </div>
        
        {/* Bottom white section with login link */}
        <div className="h-[100px] bg-white w-full flex flex-col items-center justify-center py-3">
          <p className="text-gray-500 text-sm mb-2">
            이미 계정이 있으신가요? 카카오로 간편하게 로그인하세요.
          </p>
          <div className="w-[75%]">
            <KakaoLoginButton onClick={handleKakaoLogin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;