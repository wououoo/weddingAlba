import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, OAuth2RedirectHandler, isAuthenticated } from './OAuth2';

import Host from './components/host/Host';
import Layout from './components/common/Layout';
import SettingsPage from './components/settings/SettingsPage';
import NotificationsPage from './components/settings/notifications/NotificationsPage';
import { ReportsPage, ReportPostingPage, ReportUserPage, ReportListPage } from './components/settings/reports';
import { ApplicationListPage } from './components/settings/applications';
import { RecruitmentListPage } from './components/settings/recruitments';
import { ReviewListPage } from './components/settings/reviews';
import { UserEditPage } from './components/settings/user';
import ProfilePage from './components/profile/ProfilePage';
import ProfileEditPage from './components/profile/ProfileEditPage';
import ChatListPage from './components/chat/ChatListPage';
import GroupChatRoom from './components/chat/GroupChatRoom';
import PrivateChatRoom from './components/chat/PrivateChatRoom';
import { ApplyingListPage, ApplyingFormPage } from './components/applying';
import ApplyingViewPage from './components/applying/ApplyingViewPage';
import { PostingFormPage,  MyPostingListPage,  PostingListPage,  PostingViewPage} from './components/posting';
import ApplicantManagePage from './components/posting/ApplicantManagePage';
import MainPage from './components/main/MainPage';
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
        {/* 전체 모집글 */}
        <Route path="/posting/list" element={
          <SimplePrivateRoute>
            <WithLayout>
              <PostingListPage />
            </WithLayout>
          </SimplePrivateRoute>
        } />

        {/* 모집현황 : 내가 작성한 모집글의 신청글 리스트 */}
        <Route path="/posting/list/:hostId" element={
          <SimplePrivateRoute>
            <WithLayout>
              <MyPostingListPage />
            </WithLayout>
          </SimplePrivateRoute>
        } />

      {/* 모집글 상세보기 */}
        <Route path="/posting/:id" element={
          <SimplePrivateRoute>
            <WithLayout>
              <PostingViewPage />
            </WithLayout>
          </SimplePrivateRoute>
        } />

        {/* 모집 이력 상세보기 */}
        <Route path="/post/history/:id" element={
          <SimplePrivateRoute>
            <WithLayout>
              <PostingViewPage />
            </WithLayout>
          </SimplePrivateRoute>
        } />

        {/* 모집 중 : 신청자 관리 페이지 */}
        <Route path="/posting/:id/applicants" element={
          <SimplePrivateRoute>
            <WithLayout>
              <ApplicantManagePage />
            </WithLayout>
          </SimplePrivateRoute>
        } />

        {/* 이력 : 신청자 관리 페이지 */}
        <Route path="/post/history/:id/applicants" element={
          <SimplePrivateRoute>
            <WithLayout>
              <ApplicantManagePage />
            </WithLayout>
          </SimplePrivateRoute>
        } />

        {/* 모집글 작성 */}
        <Route path="/posting/create" element={
          <SimplePrivateRoute>
            <WithLayout>
              <PostingFormPage />
            </WithLayout>
          </SimplePrivateRoute>
        } />

        
        {/* 모집글 수정 */}
        <Route path="/posting/edit/:postingId" element={
          <SimplePrivateRoute>
            <WithLayout>
              <PostingFormPage />
            </WithLayout>
          </SimplePrivateRoute>
        } />

        {/* 신청글 리스트 : default가 본인 작성 */}
        <Route path="/applying/list" element={
          <SimplePrivateRoute>
            <WithLayout>
              <ApplyingListPage />
            </WithLayout>
          </SimplePrivateRoute>
        } />

        {/*  신청글 상세보기 */}
        <Route path="/applying/:applyingId" element={
          <SimplePrivateRoute>
          <WithLayout>
            <ApplyingViewPage />
          </WithLayout>
        </SimplePrivateRoute>
        } />
        
        {/*  신청이력 상세보기 */}
        <Route path="/apply/history/:applyHistoryId" element={
          <SimplePrivateRoute>
          <WithLayout>
            <ApplyingViewPage />
          </WithLayout>
        </SimplePrivateRoute>
        } />

        {/* 신청글 작성하기 */}
        <Route path="/applying/create/:postingId" element={
          <SimplePrivateRoute>
          <WithLayout>
            <ApplyingFormPage />
          </WithLayout>
        </SimplePrivateRoute>
        } />

        {/* 신청글 작성하기 */}
        <Route path="/applying/edit/:applyingId" element={
          <SimplePrivateRoute>
          <WithLayout>
            <ApplyingFormPage />
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