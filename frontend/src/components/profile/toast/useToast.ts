import { useState, useCallback } from 'react';

interface ToastState {
  isVisible: boolean;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

interface UseToastReturn {
  toastState: ToastState;
  showToast: (message: string, actionText?: string, onAction?: () => void) => void;
  hideToast: () => void;
}

export const useToast = (): UseToastReturn => {
  const [toastState, setToastState] = useState<ToastState>({
    isVisible: false,
    message: '',
    actionText: '되돌리기',
    onAction: undefined
  });

  const showToast = useCallback((message: string, actionText?: string, onAction?: () => void) => {

    
    setToastState({
      isVisible: true,
      message,
      actionText: actionText || '되돌리기',
      onAction
    });
  }, []);

  const hideToast = useCallback(() => {

    
    setToastState(prev => ({
      ...prev,
      isVisible: false,
      onAction: undefined // 숥길 때 onAction도 초기화
    }));
  }, []);

  return {
    toastState,
    showToast,
    hideToast
  };
};