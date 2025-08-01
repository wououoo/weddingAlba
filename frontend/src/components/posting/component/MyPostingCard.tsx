import React from 'react';
import { MyPostingResponseDTO, PostingDTOUtils } from '../dto';
import { convertDatetime } from '../../common/base';
import PostingStatusBadge from './PostingStatusBadge';
import PostingActionButtons from './PostingActionButtons';

interface MyPostingCardProps {
    posting: MyPostingResponseDTO;
    cancelLoading: boolean;
    onCardClick: (postingId: number, dataType: string) => void;
    onApplicantManage: (postingId: number, dataType: string) => void;
    onCancel: (postingId: number) => void;
    onEdit: (postingId: number) => void;
}

const MyPostingCard: React.FC<MyPostingCardProps> = ({
    posting,
    cancelLoading,
    onCardClick,
    onApplicantManage,
    onCancel,
    onEdit
}) => {
    const postingId = PostingDTOUtils.getPostingId(posting);
    const backgroundColor = PostingDTOUtils.getBackgroundColor(posting);

    const handleCardClick = () => {
        if (postingId !== undefined && postingId !== null) {
            onCardClick(postingId, posting.dataType || "");
        }
    };

    return (
        <div className={`rounded-lg shadow-sm mb-4 overflow-hidden transition-colors ${backgroundColor}`}>
            {/* 모집글 기본 정보 */}
            <div 
                className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleCardClick}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 pr-2">
                        {posting.title}
                    </h3>
                    
                    {/* 상태 배지 */}
                    <div className="flex-shrink-0">
                        <PostingStatusBadge status={posting.status || 0} />
                    </div>
                </div>
            
                <div className="flex items-center text-sm text-gray-600 mb-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>{posting.sidoSigungu}</span>
                    <span className="mx-2">•</span>
                    <span>{convertDatetime(posting.appointmentDatetime || '')}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                    {posting.tags?.map((tag: string, index: number) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium text-blue-600">{posting.payTypeText} {Number(posting.payAmount).toLocaleString()}원</span>
                    <span className="mx-2">•</span>
                    <span>{Math.floor(Number(posting.workingHours))}시간</span>
                    <span className="mx-2">•</span>
                    <span>신청자 {posting.applyCount || 0}명</span>
                </div>
            </div>

            {/* 관리 버튼들 */}
            <PostingActionButtons
                posting={posting}
                postingId={postingId}
                cancelLoading={cancelLoading}
                onApplicantManage={onApplicantManage}
                onCancel={onCancel}
                onEdit={onEdit}
            />
        </div>
    );
};

export default MyPostingCard;