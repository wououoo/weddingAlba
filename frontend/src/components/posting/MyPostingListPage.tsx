import React from "react";
import { useNavigate } from "react-router-dom";
import { useMyPostingList } from "./hooks/useMyPostingList";
import { Toast, useToast } from "../common/toast";
import { 
    SearchAndFilter, 
    MyPostingCard, 
    EmptyState, 
    LoadingState, 
    ErrorState 
} from "./component";

const MyPostingListPage: React.FC = () => {
    const navigate = useNavigate();
    
    // Toast hook
    const { toastState, showToast, hideToast } = useToast();
    
    // 모집글 관리 hook (필터링, 취소 기능 포함)
    const { 
        postings: myPostings, 
        loading, 
        error, 
        refetch,
        searchKeyword,
        setSearchKeyword,
        selectedStatus,
        setSelectedStatus,
        filteredPostings,
        cancelLoading,
        handleCancelPosting
    } = useMyPostingList();


    // 로딩 상태
    if (loading) {
        return <LoadingState />;
    }

    // 에러 상태
    if (error) {
        return <ErrorState error={error} onRetry={refetch} />;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* 검색 및 필터 헤더 */}
            <SearchAndFilter
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                resultCount={filteredPostings.length}
            />

            {/* 모집글 리스트 */}
            <div className="px-4 py-2">
                {filteredPostings.map((posting) => (
                    <MyPostingCard
                        key={posting.postingId || posting.postHistoryId || Math.random()}
                        posting={posting}
                        cancelLoading={cancelLoading}
                        onCardClick={(postingId, dataType) => {
                            if (dataType === "HISTORY") {
                                navigate(`/posting/history/${postingId}`);
                            } else {
                                navigate(`/posting/${postingId}`);
                            }
                        }}
                        onApplicantManage={(postingId) => navigate(`/posting/${postingId}/applicants`)}
                        onCancel={(postingId) => handleCancelPosting(postingId, showToast)}
                        onEdit={(postingId) => navigate(`/posting/edit/${postingId}`)}
                    />
                ))}
            </div>

            {/* 빈 상태 */}
            {filteredPostings.length === 0 && (
                <EmptyState 
                    searchKeyword={searchKeyword}
                    onCreatePosting={() => navigate('/posting/create')}
                />
            )}

            {/* 하단 여백 */}
            <div className="h-20"></div>

            {/* Toast 컴포넌트 */}
            <Toast
                isVisible={toastState.isVisible}
                message={toastState.message}
                actionText={toastState.actionText}
                onAction={toastState.onAction}
                onClose={hideToast}
            />
        </div>
    );
};

export default MyPostingListPage; 