import React from 'react';
import { MyPostingResponseDTO } from '../dto';

interface PostingActionButtonsProps {
    posting: MyPostingResponseDTO;
    postingId: number | undefined;
    cancelLoading: boolean;
    onApplicantManage: (postingId: number, dataType: string) => void;
    onCancel: (postingId: number) => void;
    onEdit: (postingId: number) => void;
}

const PostingActionButtons: React.FC<PostingActionButtonsProps> = ({
    posting,
    postingId,
    cancelLoading,
    onApplicantManage,
    onCancel,
    onEdit
}) => {
    const handleClick = (callback: (id: number) => void) => (e: React.MouseEvent) => {
        e.stopPropagation();
        if (postingId !== undefined && postingId !== null) {
            callback(postingId);
        }
    };

    return (
        <div className="border-t bg-white/50 p-4">
            <div className="flex gap-2 justify-between items-center">
                <div className="flex gap-2">
                    {/* 신청자 관리 버튼 - 신청자가 있으면 무조건 표시 */}
                    {(posting.applyCount || 0) > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (postingId !== undefined && postingId !== null) {
                                    onApplicantManage(postingId, posting.dataType || "ACTIVE");
                                }
                            }}
                            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                            👥 신청자 관리 ({posting.applyCount || 0}명)
                        </button>
                    )}
                    
                    {/* 모집취소 버튼 - ACTIVE 타입이고 모집중일 때만 */}
                    {posting.dataType !== "HISTORY" && posting.status === 0 && (
                        <button
                            onClick={handleClick(onCancel)}
                            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors font-medium"
                            disabled={cancelLoading}
                        >
                            {cancelLoading ? '처리중...' : '❌ 모집취소'}
                        </button>
                    )}
                </div>

                {/* 수정하기 버튼 - ACTIVE 타입이고 모집중일 때만 */}
                {posting.dataType !== "HISTORY" && posting.status === 0 && (
                    <button
                        onClick={handleClick(onEdit)}
                        className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                        ✏️ 수정하기
                    </button>
                )}
            </div>
        </div>
    );
};

export default PostingActionButtons;