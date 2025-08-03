import React from "react";
import { ApplyingResponseDTO } from "../dto/ApplyingResponseDTO";
import { useNavigate } from "react-router-dom";

const ApplyingCard: React.FC<ApplyingResponseDTO> = ({
    applyId,
    status,
    applyDatetime,
    prContent,
}) => {
    const navigate = useNavigate();

    const getStatusInfo = (statusCode: number) => {
        switch (statusCode) {
            case 0:
                return { text: "대기", color: "text-yellow-600 bg-yellow-100" };
            case 1:
                return { text: "승인", color: "text-green-600 bg-green-100" };
            case -1:
                return { text: "거절", color: "text-red-600 bg-red-100" };
            default:
                return { text: "알 수 없음", color: "text-gray-600 bg-gray-100" };
        }
    };

    const statusInfo = getStatusInfo(status);

    return (
        <div 
            onClick={() => navigate(`/applying/${applyId}`)}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
            {/* 상단 정보 */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs text-gray-500">신청 ID: {applyId}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">하객 신청서</h3>
                </div>

                {/* 상태 배지 */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.text}
                </div>
            </div>

            {/* 신청 정보 */}
            <div className="space-y-2 mb-3">
                {/* 신청 일시 */}
                <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">신청일: {applyDatetime}</span>
                </div>

                {/* PR 내용 */}
                <div className="flex items-start text-gray-600">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                        <span className="text-sm text-gray-500 block mb-1">PR 내용:</span>
                        <p className="text-sm text-gray-700 line-clamp-3">{prContent}</p>
                    </div>
                </div>
            </div>

            {/* 하단 액션 힌트 */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">탭하여 상세보기</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    );
}

export default ApplyingCard; 