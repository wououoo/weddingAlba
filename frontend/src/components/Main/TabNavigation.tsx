// TabNavigation.tsx - 상단 탭 네비게이션 컴포넌트

import React from 'react';
import { TabType } from './types/types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white shadow-md mb-4">
      <div className="container mx-auto">
        <div className="flex text-sm overflow-x-auto">
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'all' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => onTabChange('all')}
          >
            전체보기
          </button>
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'recommended' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => onTabChange('recommended')}
          >
            내 주변
          </button>
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'recent' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => onTabChange('recent')}
          >
            주말
          </button>
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'popular' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => onTabChange('popular')}
          >
            높은 보수
          </button>
          <button className="px-4 py-3 font-medium text-gray-500">
            급구
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;