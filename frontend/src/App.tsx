import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, OAuth2RedirectHandler, isAuthenticated } from './OAuth2';
import MainPage from './components/main/MainPage';
import Layout from './components/common/Layout';
import PostingListPage from "./components/posting";
// import { useAuthStore } from './stores/authStore'; // 주석 처리

// 간단한 인증 확인 함수 (authUtils의 isAuthenticated 사용)
const SimplePrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

// Layout을 적용한 컴포넌트 래퍼
const WithLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

const App: React.FC = () => {
  // useAuthStore 관련 코드 제거

  return (
    <Router>
      <Routes>
        {/* 로그인 화면에는 Layout 적용 안함 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        
        {/* 로그인 후 페이지들에 Layout 적용 */}
        <Route path="/" element={
          <SimplePrivateRoute>
            <WithLayout>
              <MainPage />
            </WithLayout>
          </SimplePrivateRoute>
        } />

        <Route path="/posting/list"
        element={
          <SimplePrivateRoute>
            <WithLayout>
              <PostingListPage/>
            </WithLayout>
          </SimplePrivateRoute>
        }>
        </Route>

        {/*<Route path="/posting/:id" element={*/}
        {/*  <SimplePrivateRoute>*/}
        {/*    <WithLayout>*/}
        {/*      <div className="p-4">*/}
        {/*        <h1 className="text-xl font-bold mb-4">게시글 상세 페이지</h1>*/}
        {/*        <p>현재 구현 중입니다.</p>*/}
        {/*        <button */}
        {/*          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"*/}
        {/*          onClick={() => window.history.back()}*/}
        {/*        >*/}
        {/*          뒤로가기*/}
        {/*        </button>*/}
        {/*      </div>*/}
        {/*    </WithLayout>*/}
        {/*  </SimplePrivateRoute>*/}
        {/*} />*/}

        {/*<Route path="/posting/create" element={*/}
        {/*  <SimplePrivateRoute>*/}
        {/*    <WithLayout>*/}
        {/*      <div className="p-4">*/}
        {/*        <h1 className="text-xl font-bold mb-4">게시글 작성</h1>*/}
        {/*        <p>현재 구현 중입니다.</p>*/}
        {/*        <button */}
        {/*          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"*/}
        {/*          onClick={() => window.history.back()}*/}
        {/*        >*/}
        {/*          뒤로가기*/}
        {/*        </button>*/}
        {/*      </div>*/}
        {/*    </WithLayout>*/}
        {/*  </SimplePrivateRoute>*/}
        {/*} />*/}

        {/*<Route path="/apply/:id" element={*/}
        {/*  <SimplePrivateRoute>*/}
        {/*    <WithLayout>*/}
        {/*      <div className="p-4">*/}
        {/*        <h1 className="text-xl font-bold mb-4">하객 신청</h1>*/}
        {/*        <p>현재 구현 중입니다.</p>*/}
        {/*        <button*/}
        {/*          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"*/}
        {/*          onClick={() => window.history.back()}*/}
        {/*        >*/}
        {/*          뒤로가기*/}
        {/*        </button>*/}
        {/*      </div>*/}
        {/*    </WithLayout>*/}
        {/*  </SimplePrivateRoute>*/}
        {/*} />*/}

        {/* 추가 페이지들 */}
        {/*<Route path="/postings" element={*/}
        {/*  <SimplePrivateRoute>*/}
        {/*    <WithLayout>*/}
        {/*      <div className="p-4">*/}
        {/*        <h1 className="text-xl font-bold mb-4">예정된 공고</h1>*/}
        {/*        <p>현재 구현 중입니다.</p>*/}
        {/*      </div>*/}
        {/*    </WithLayout>*/}
        {/*  </SimplePrivateRoute>*/}
        {/*} />*/}

        {/*<Route path="/chat" element={*/}
        {/*  <SimplePrivateRoute>*/}
        {/*    <WithLayout>*/}
        {/*      <div className="p-4">*/}
        {/*        <h1 className="text-xl font-bold mb-4">채팅</h1>*/}
        {/*        <p>현재 구현 중입니다.</p>*/}
        {/*      </div>*/}
        {/*    </WithLayout>*/}
        {/*  </SimplePrivateRoute>*/}
        {/*} />*/}

        {/*<Route path="/mypage" element={*/}
        {/*  <SimplePrivateRoute>*/}
        {/*    <WithLayout>*/}
        {/*      <div className="p-4">*/}
        {/*        <h1 className="text-xl font-bold mb-4">마이페이지</h1>*/}
        {/*        <p>현재 구현 중입니다.</p>*/}
        {/*      </div>*/}
        {/*    </WithLayout>*/}
        {/*  </SimplePrivateRoute>*/}
        {/*} />*/}
      </Routes>
    </Router>
  );
};

export default App;