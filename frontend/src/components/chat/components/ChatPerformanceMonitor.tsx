import React from 'react';

// 성능 모니터링 컴포넌트
const ChatPerformanceMonitor: React.FC<{ 
  messageCount: number;
  isConnected?: boolean;
  typingUsers?: number;
}> = ({ messageCount, isConnected = false, typingUsers = 0 }) => {
  const [renderCount, setRenderCount] = React.useState(0);
  const [lastRenderTime, setLastRenderTime] = React.useState(Date.now());
  const [fps, setFps] = React.useState(0);
  const fpsRef = React.useRef<number[]>([]);
  
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
    const now = Date.now();
    setLastRenderTime(now);
    
    // FPS 계산
    fpsRef.current.push(now);
    fpsRef.current = fpsRef.current.filter(time => now - time < 1000);
    setFps(fpsRef.current.length);
  }, [messageCount, isConnected, typingUsers]); // 의존성 배열 추가
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs z-50 font-mono">
      <div className="mb-1">💬 메시지: <span className="text-green-400">{messageCount}</span></div>
      <div className="mb-1">🔄 렌더링: <span className="text-blue-400">{renderCount}</span></div>
      <div className="mb-1">렼 FPS: <span className="text-yellow-400">{fps}</span></div>
      <div className="mb-1">🔗 연결: <span className={isConnected ? 'text-green-400' : 'text-red-400'}>{isConnected ? 'ON' : 'OFF'}</span></div>
      <div className="mb-1">✍️ 타이핑: <span className="text-purple-400">{typingUsers}</span></div>
      <div className="text-gray-400">{new Date(lastRenderTime).toLocaleTimeString()}</div>
    </div>
  );
};

export default ChatPerformanceMonitor;