import React from 'react';

interface EmptyStateProps {
    searchKeyword?: string;
    onCreatePosting?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
    searchKeyword, 
    onCreatePosting 
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchKeyword ? '검색 결과가 없습니다' : '작성한 모집글이 없습니다'}
            </h3>
            <p className="text-gray-500 text-center mb-6">
                {searchKeyword ? '다른 검색어를 시도해보세요' : '새로운 모집글을 작성해보세요'}
            </p>
            {!searchKeyword && onCreatePosting && (
                <button
                    onClick={onCreatePosting}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    모집글 작성하기
                </button>
            )}
        </div>
    );
};

export default EmptyState;