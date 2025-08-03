import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isError, setIsError] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmText === '회원탈퇴') {
      onConfirm();
    } else {
      setIsError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-center mb-4">회원 탈퇴</h3>
          <div className="mb-6">
            <p className="text-gray-600 mb-2">회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다. 정말 탈퇴하시겠습니까?</p>
            <p className="text-gray-600 mb-4">확인을 위해 아래에 <span className="font-bold">'회원탈퇴'</span>를 입력해주세요.</p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setIsError(false);
              }}
              className={`w-full p-2 border ${isError ? 'border-red-500' : 'border-gray-300'} rounded`}
              placeholder="'회원탈퇴'를 입력하세요"
            />
            {isError && <p className="text-red-500 text-sm mt-1">정확히 '회원탈퇴'를 입력해주세요.</p>}
          </div>
          <div className="flex justify-between">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 w-1/2 mr-2"
            >
              취소
            </button>
            <button 
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-1/2 ml-2"
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WithdrawComponent: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleWithdraw = () => {
    // 로컬 스토리지의 모든 데이터 삭제
    localStorage.clear();
    
    // 회원 탈퇴 API 호출 로직 추가 (실제 구현 시)
    // API 호출 로직...
    
    // 로그인 페이지로 이동
    navigate('/login', { replace: true });
  };

  return (
    <>
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer text-red-500"
        onClick={openModal}
      >
        <span>회원 탈퇴</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <WithdrawModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onConfirm={handleWithdraw} 
      />
    </>
  );
};

export default WithdrawComponent;