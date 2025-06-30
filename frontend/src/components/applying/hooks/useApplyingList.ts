import { useState, useEffect, useCallback } from 'react';
import { applyingApi } from '../api/applyingApi';
import { ApplyingResponseDTO } from '../dto/ApplyingResponseDTO';
import { useInfiniteScroll } from '../../common/infiniteScroll/useInfiniteScroll';

export const useApplyingList = () => {
    const [applyings, setApplyings] = useState<ApplyingResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("전체");

    const fetchApplyings = useCallback(async (pageNumber: number, status: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await applyingApi.getMyApplyingList(pageNumber, 10, status === "전체" ? undefined : status);
            if (response.success) {
                if (response.data) {
                    const { content, last } = response.data;
                    setApplyings(prev => pageNumber === 0 ? content : [...prev, ...content]);
                    setHasMore(!last);
                    setPage(pageNumber);
                } else {
                    setError(response.message || "신청 목록을 불러오는데 실패했습니다. (데이터 없음)");
                    setHasMore(false);
                }
            } else {
                setError(response.message || "신청 목록을 불러오는데 실패했습니다.");
                setHasMore(false);
            }
        } catch (err) {
            setError("신청 목록을 불러오는 중 오류가 발생했습니다.");
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setApplyings([]); // 상태 변경 시 목록 초기화
        setPage(0);
        setHasMore(true);
        fetchApplyings(0, selectedStatus);
    }, [selectedStatus]);

    const loadMore = useCallback(() => {
        if (hasMore && !isLoading) {
            fetchApplyings(page + 1, selectedStatus);
        }
    }, [hasMore, isLoading, page, selectedStatus, fetchApplyings]);

    useInfiniteScroll({ hasMore, loading: isLoading, loadMore });

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
    };

    return {
        applyings,
        isLoading,
        error,
        selectedStatus,
        handleStatusChange,
        hasMore
    };
};
