import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, OAuth2RedirectHandler, isAuthenticated } from './OAuth2';

import MainPage from './components/Main/MainPage';
// 컴포넌트 관련 import 수정
import Main from './components/Main';
import Host from './components/Host/Host';
import Post from './components/Post/Post';
import Layout from './components/Common/Layout';
import SettingsPage from './components/Settings/SettingsPage';
import NotificationsPage from './components/Settings/notifications/NotificationsPage';
import { ReportsPage, ReportPostingPage, ReportUserPage, ReportListPage } from './components/Settings/reports';
import { ApplicationListPage } from './components/Settings/applications';
import { RecruitmentListPage } from './components/Settings/recruitments';
import { ReviewListPage } from './components/Settings/reviews';
import { UserEditPage } from './components/Settings/user';
import ProfilePage from './components/Profile/ProfilePage';
import ProfileEditPage from './components/Profile/ProfileEditPage';
import ChatListPage from './components/Chat/ChatListPage';
import GroupChatRoom from './components/Chat/GroupChatRoom';
import PrivateChatRoom from './components/Chat/PrivateChatRoom';

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
        
        {/* 메인 페이지를 기본 경로로 설정 */}
        <Route path="/" element={
          <SimplePrivateRoute>
            <WithLayout>
              <MainPage />
            </WithLayout>
          </SimplePrivateRoute>
        } />

        {/* Host 컴포넌트 라우트 추가 */}
        <Route path="/host" element={
          <SimplePrivateRoute>
            <WithLayout>
              <Host />
            </WithLayout>
          </SimplePrivateRoute>
        } />

        {/* 게시글 목록 페이지 라우트 추가 */}
        <Route path="/posting/list" element={
          <SimplePrivateRoute>
            <WithLayout>
              <Post />
            </WithLayout>
          </SimplePrivateRoute>
        } />
        
        <Route path="/posting/:id" element={
          <SimplePrivateRoute>
            <WithLayout>
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
            </WithLayout>
          </SimplePrivateRoute>
        } />
        
        <Route path="/posting/create" element={
          <SimplePrivateRoute>
            <WithLayout>
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
            </WithLayout>
          </SimplePrivateRoute>
        } />
        
        <Route path="/apply/:id" element={
          <SimplePrivateRoute>
            <WithLayout>
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
            </WithLayout>
          </SimplePrivateRoute>
        } />
        
        {/* 추가 페이지들 */}
        <Route path="/postings" element={
          <SimplePrivateRoute>
            <WithLayout>
              <div className="p-4">
                <h1 className="text-xl font-bold mb-4">예정된 공고</h1>
                <p>현재 구현 중입니다.</p>
              </div>
            </WithLayout>
          </SimplePrivateRoute>
        } />
        
        <Route path="/chat" element={
          <SimplePrivateRoute>
            <ChatListPage />
          </SimplePrivateRoute>
        } />

        <Route path="/chat/group/:roomId" element={
          <SimplePrivateRoute>
            <GroupChatRoom />
          </SimplePrivateRoute>
        } />

        <Route path="/chat/private/:roomId" element={
          <SimplePrivateRoute>
            <PrivateChatRoom />
          </SimplePrivateRoute>
        } />
        
        <Route path="/mypage" element={
          <SimplePrivateRoute>
            <ProfilePage />
          </SimplePrivateRoute>
        } />

        <Route path="/profile/edit" element={
          <SimplePrivateRoute>
            <ProfileEditPage />
          </SimplePrivateRoute>
        } />

        <Route path="/settings" element={
          <SimplePrivateRoute>
            <SettingsPage />
          </SimplePrivateRoute>
        } />

        <Route path="/settings/user/edit" element={
          <SimplePrivateRoute>
            <UserEditPage />
          </SimplePrivateRoute>
        } />

        <Route path="/settings/notifications" element={
          <SimplePrivateRoute>
            <NotificationsPage />
          </SimplePrivateRoute>
        } />

        <Route path="/settings/report/posting" element={
          <SimplePrivateRoute>
            <ReportPostingPage />
          </SimplePrivateRoute>
        } />

        <Route path="/settings/report/user" element={
          <SimplePrivateRoute>
            <ReportUserPage />
          </SimplePrivateRoute>
        } />

        <Route path="/settings/report/list" element={
          <SimplePrivateRoute>
            <ReportListPage />
          </SimplePrivateRoute>
        } />

        <Route path="/settings/applications" element={
          <SimplePrivateRoute>
            <ApplicationListPage />
          </SimplePrivateRoute>
        } />

        <Route path="/settings/recruitments" element={
          <SimplePrivateRoute>
            <RecruitmentListPage />
          </SimplePrivateRoute>
        } />

        <Route path="/settings/reviews" element={
          <SimplePrivateRoute>
            <ReviewListPage />
          </SimplePrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;