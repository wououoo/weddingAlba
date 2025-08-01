import React from 'react';

interface LoadingStateProps {
    message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
    message = "내 모집글을 불러오는 중..." 
}) => {
    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );
};

export default LoadingState;