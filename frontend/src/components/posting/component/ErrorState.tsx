import React from 'react';

interface ErrorStateProps {
    error: string;
    onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">오류가 발생했습니다</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        다시 시도
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorState;