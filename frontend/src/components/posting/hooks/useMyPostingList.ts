import { useState, useEffect, useMemo, useCallback } from 'react';
import { postingApi } from '../api/postingApi';
import { MyPostingResponseDTO } from '../dto';

interface UseMyPostingListReturn {
    postings: MyPostingResponseDTO[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    
    // 필터링 관련
    searchKeyword: string;
    setSearchKeyword: (keyword: string) => void;
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
    filteredPostings: MyPostingResponseDTO[];
    
    // 취소 관련
    cancelLoading: boolean;
    handleCancelPosting: (postingId: number, showToast: (message: string, actionText?: string, onAction?: () => void) => void) => void;
}

export const useMyPostingList = (): UseMyPostingListReturn => {
    const [postings, setPostings] = useState<MyPostingResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    
    // 필터링 상태
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("전체");

    const fetchMyPostings = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await postingApi.getMyPostingList(0, 10); // 페이지 0, 크기 20
            if (response.success && response.data) {
                setPostings(response.data.content || []);
            } else {
                setError(response.message || '내 모집글을 불러오는데 실패했습니다.');
            }
        } catch (err) {
            console.error('내 모집글 조회 실패:', err);
            setError('내 모집글을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 필터링된 모집글 목록
    const filteredPostings = useMemo(() => {
        let filtered = postings;

        // 검색어 필터링
        if (searchKeyword.trim()) {
            filtered = filtered.filter(posting => 
                posting.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                posting.sidoSigungu?.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        }

        // 상태별 필터링
        if (selectedStatus !== "전체") {
            filtered = filtered.filter(posting => {
                const postingStatus = posting.status;
                
                switch (selectedStatus) {
                    case 'pending': // 모집중
                        return postingStatus === 0;
                    case 'approved': // 모집확정  
                        return postingStatus === 1;
                    case 'rejected': // 모집취소
                        return postingStatus === -1;
                    default: 
                        return true;
                }
            });
        }

        return filtered;
    }, [postings, searchKeyword, selectedStatus]);

    // 모집글 취소 핸들러
    const handleCancelPosting = useCallback((
        postingId: number, 
        showToast: (message: string, actionText?: string, onAction?: () => void) => void
    ) => {
        showToast(
            '정말로 이 모집글을 취소하시겠습니까?',
            '확인',
            () => executeCancelPosting(postingId, showToast)
        );
    }, []);

    // 실제 취소 실행
    const executeCancelPosting = async (
        postingId: number, 
        showToast: (message: string) => void
    ) => {
        try {
            setCancelLoading(true);
            const response = await postingApi.cancelPosting(postingId);
            if (response.success) {
                await fetchMyPostings(); // 목록 새로고침
                showToast('모집글이 성공적으로 취소되었습니다.');
            } else {
                showToast(response.message || '모집글 취소에 실패했습니다.');
            }
        } catch (error) {
            console.error('모집글 삭제 실패:', error);
            showToast('모집글 취소 중 오류가 발생했습니다.');
        } finally {
            setCancelLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPostings();
    }, []);

    return {
        postings,
        loading,
        error,
        refetch: fetchMyPostings,
        
        // 필터링 관련
        searchKeyword,
        setSearchKeyword,
        selectedStatus,
        setSelectedStatus,
        filteredPostings,
        
        // 취소 관련
        cancelLoading,
        handleCancelPosting
    };
};
