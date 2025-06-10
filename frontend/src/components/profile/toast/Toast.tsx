import React, { useEffect } from 'react';

interface ToastProps {
  isVisible: boolean;
  message: string;
  actionText?: string;
  onAction?: () => void;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  isVisible,
  message,
  actionText = '되돌리기',
  onAction,
  onClose,
  duration = 4000
}) => {
  
  // 디버깅을 위한 로그
  useEffect(() => {
    console.log('Toast Props:', { isVisible, message, actionText, onAction: !!onAction });
  }, [isVisible, message, actionText, onAction]);

  useEffect(() => {
    if (isVisible) {
      console.log('Toast 타이머 시작:', duration + 'ms');
      const timer = setTimeout(() => {
        console.log('Toast 타이머 만료 - 자동 닫기');
        onClose();
      }, duration);

      return () => {
        console.log('Toast 타이머 정리');
        clearTimeout(timer);
      };
    }
  }, [isVisible, duration, onClose]);

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onAction) {
      onAction();
    }
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 flex items-center justify-between animate-slide-up">
        <span className="text-sm">{message}</span>
        <div className="flex items-center space-x-2">
          {onAction && (
            <button
              onClick={handleActionClick}
              className="ml-4 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors px-2 py-1 rounded"
              type="button"
            >
              {actionText}
            </button>
          )}
          <button
            onClick={handleCloseClick}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;