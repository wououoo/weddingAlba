import React from 'react';

/**
 * SockJS iframe 컴포넌트
 * SockJS가 폴백 모드에서 생성하는 iframe 경로들을 처리
 */
const SockJSIframe: React.FC = () => {
  return (
    <div style={{ display: 'none' }}>
      {/* SockJS iframe - 실제로는 보이지 않음 */}
      <p>SockJS iframe fallback</p>
    </div>
  );
};

export default SockJSIframe;
