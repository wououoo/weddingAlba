import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationSettings: React.FC = () => {
  const navigate = useNavigate();
  const [chatNotifications, setChatNotifications] = useState(true);
  const [recruitmentNotifications, setRecruitmentNotifications] = useState(true);
  const [applicationNotifications, setApplicationNotifications] = useState(true);
  const [allNotifications, setAllNotifications] = useState(true);

  const handleAllNotificationsToggle = (newValue: boolean) => {
    setAllNotifications(newValue);
    if (!newValue) {
      setChatNotifications(false);
      setRecruitmentNotifications(false);
      setApplicationNotifications(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <button onClick={() => navigate('/settings')} className="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">알람 설정</h1>
      </div>
      
      {/* 알람 설정 컨텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="mt-4 px-4 text-gray-500">알림 설정</div>
        
        <div className="bg-white">
          {/* 채팅 알림 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <p className="font-medium">채팅 알림</p>
              <p className="text-sm text-gray-500">새로운 채팅 메시지가 오면 알려드립니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={chatNotifications} 
                onChange={() => setChatNotifications(!chatNotifications)}
                disabled={!allNotifications}
              />
              <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 
              ${chatNotifications && allNotifications ? 'peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-purple-600' : ''}
              after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
            </label>
          </div>
          
          {/* 모집 알림 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <p className="font-medium">모집 알림</p>
              <p className="text-sm text-gray-500">내가 올린 모집글에 신청이 들어왔을 때 알려드립니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={recruitmentNotifications} 
                onChange={() => setRecruitmentNotifications(!recruitmentNotifications)}
                disabled={!allNotifications}
              />
              <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 
              ${recruitmentNotifications && allNotifications ? 'peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-purple-600' : ''}
              after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
            </label>
          </div>
          
          {/* 신청 알림 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <p className="font-medium">신청 알림</p>
              <p className="text-sm text-gray-500">새로운 하객 모집 공고가 올라왔을 때 알려드립니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={applicationNotifications} 
                onChange={() => setApplicationNotifications(!applicationNotifications)}
                disabled={!allNotifications}
              />
              <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 
              ${applicationNotifications && allNotifications ? 'peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-purple-600' : ''}
              after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
            </label>
          </div>
          
          {/* 모든 알림 */}
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">모든 알림</p>
              <p className="text-sm text-gray-500">앱의 모든 알림을 켜거나 끕니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={allNotifications} 
                onChange={() => handleAllNotificationsToggle(!allNotifications)}
              />
              <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 
              ${allNotifications ? 'peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-purple-600' : ''}
              after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
            </label>
          </div>
        </div>
        
        {/* 추가 정보 섹션 */}
        <div className="mt-6 px-4">
          <p className="text-sm text-gray-500 mb-4">
            알림은 앱이 실행 중이거나 백그라운드에서 실행 중일 때만 작동합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;