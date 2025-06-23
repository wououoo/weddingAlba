import React from "react";
import { useNavigate } from "react-router-dom";
import { PostingResponseDTO } from "../dto/PostingResponseDTO";
import { convertDatetime, convertPay, convertTime } from "../../common/base";

const PostingCard: React.FC<PostingResponseDTO> = ({
    postingId,
    title,
    sidoSigungu,
    appointmentDatetime,
    startTime,
    endTime,
    workingHours,
    address,
    buildingName,
    isSelf,
    hasMobileInvitation,
    payAmount,
    payType,
    payTypeStr,
    tags,
    guestMainRole,
    nickname,
}) => {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate(`/posting/${postingId}`)}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            {/* 상단 정보 */}
            <div className="flex items-start space-x-3 mb-3">

                {/* 모집글 정보 */}
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs text-gray-500">
                            {isSelf ? "본인 결혼식" : "지인 결혼식"}
                        </span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{guestMainRole}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                    <div className="flex items-center text-xs text-gray-500">
                        <span>{nickname}</span>
                    </div>
                </div>

                {/* 위치 */}
                <div className="flex items-center text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{sidoSigungu}</span>
                </div>
            </div>

            {/* 결혼식 정보 */}
            <div className="space-y-2 mb-3">
                {/* 예식일시 */}
                <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{convertDatetime(appointmentDatetime || '')}</span>
                </div>

                {/* 예식장 위치 */}
                <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{address} {buildingName}</span>
                </div>

                {/* 근무시간 */}
                <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{convertTime(startTime || '')} ~ {convertTime(endTime || '')}, {Math.floor(Number(workingHours))}시간</span>
                </div>

                {/* 급여 */}
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-blue-600">
                        {payTypeStr} {Number(payAmount).toLocaleString()}원
                        {/* {convertPay(payType || '', payAmount || '', workingHours || '')} */}
                    </span>
                    <div className="ml-auto flex items-center space-x-2">
                        {hasMobileInvitation ? (
                            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                                📱 청첩장 제출
                            </div>
                        ) : ''}
                    </div>
                </div>
            </div>

            {/* 태그들 */}
            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <span 
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostingCard; 