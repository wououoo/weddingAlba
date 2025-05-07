import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, OAuth2RedirectHandler, isAuthenticated } from './OAuth2';
import Main from './components/Main';
// import { useAuthStore } from './stores/authStore'; // 주석 처리

// 간단한 인증 확인 함수 (authUtils의 isAuthenticated 사용)
const SimplePrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  // useAuthStore 관련 코드 제거

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/" element={
          <SimplePrivateRoute>
            <Main />
          </SimplePrivateRoute>
        } />
        <Route path="/posting/:id" element={
          <SimplePrivateRoute>
            <div className="p-4">
              <h1 className="text-xl font-bold mb-4">게시글 상세 페이지</h1>
              <p>현재 구현 중입니다.</p>
              <button 
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
                onClick={() => window.history.back()}
              >
                뒤로가기
              </button>
            </div>
          </SimplePrivateRoute>
        } />
        <Route path="/posting/create" element={
          <SimplePrivateRoute>
            <div className="p-4">
              <h1 className="text-xl font-bold mb-4">게시글 작성</h1>
              <p>현재 구현 중입니다.</p>
              <button 
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
                onClick={() => window.history.back()}
              >
                뒤로가기
              </button>
            </div>
          </SimplePrivateRoute>
        } />
        <Route path="/apply/:id" element={
          <SimplePrivateRoute>
            <div className="p-4">
              <h1 className="text-xl font-bold mb-4">하객 신청</h1>
              <p>현재 구현 중입니다.</p>
              <button 
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
                onClick={() => window.history.back()}
              >
                뒤로가기
              </button>
            </div>
          </SimplePrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;