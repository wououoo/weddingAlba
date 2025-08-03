import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-center mb-4">로그아웃</h3>
          <p className="text-gray-600 text-center mb-6">로그아웃 하시겠습니까?</p>
          <div className="flex justify-between">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 w-1/2 mr-2"
            >
              취소
            </button>
            <button 
              onClick={onConfirm}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 w-1/2 ml-2"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogoutComponent: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    // 로컬 스토리지의 모든 데이터 삭제
    localStorage.clear();
    
    // 로그인 페이지로 이동
    navigate('/login', { replace: true });
  };

  return (
    <>
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer"
        onClick={openModal}
      >
        <span>로그아웃</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <LogoutModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onConfirm={handleLogout} 
      />
    </>
  );
};

export default LogoutComponent;