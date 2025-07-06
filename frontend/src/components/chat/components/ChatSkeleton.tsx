import React from 'react';

export const ChatRoomSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white animate-pulse">
      {/* 헤더 스켈레톤 */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>

      {/* 메시지 영역 스켈레톤 */}
      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        {/* 받은 메시지 스켈레톤 */}
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-300 rounded w-16 mb-2"></div>
            <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
              <div className="h-4 bg-gray-300 rounded w-40 mb-1"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>

        {/* 보낸 메시지 스켈레톤 */}
        <div className="flex items-start justify-end space-x-3">
          <div className="flex-1 flex justify-end">
            <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
              <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        </div>

        {/* 추가 메시지들 */}
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-300 rounded w-16 mb-2"></div>
            <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
              <div className="h-4 bg-gray-300 rounded w-36"></div>
            </div>
          </div>
        </div>

        <div className="flex items-start justify-end space-x-3">
          <div className="flex-1 flex justify-end">
            <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
              <div className="h-4 bg-gray-300 rounded w-28 mb-1"></div>
              <div className="h-4 bg-gray-300 rounded w-44"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 입력창 스켈레톤 */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export const ChatListSkeleton: React.FC = () => {
  return (
    <div className="space-y-1 animate-pulse">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center p-3 space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-40"></div>
          </div>
          <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomSkeleton;
