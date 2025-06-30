import { useEffect, useCallback } from 'react';

interface UseInfiniteScrollProps {
    hasMore: boolean;
    loading: boolean;
    loadMore: () => void;
    threshold?: number;
}

export const useInfiniteScroll = ({
    hasMore,
    loading,
    loadMore,
    threshold = 200
}: UseInfiniteScrollProps) => {
    
    const handleScroll = useCallback(() => {
        // 스크롤이 하단에 가까워졌는지 확인
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        
        // 하단에서 threshold px 이내에 도달했을 때 로드
        if (scrollTop + clientHeight >= scrollHeight - threshold) {
            if (hasMore && !loading) {
                loadMore();
            }
        }
    }, [hasMore, loading, loadMore, threshold]);

    useEffect(() => {
        // 스크롤 이벤트 등록
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            // 컴포넌트 언마운트 시 이벤트 제거
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return null; // 이 훅은 UI를 렌더링하지 않음
}; 