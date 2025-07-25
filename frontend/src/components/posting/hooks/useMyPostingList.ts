import { useState, useEffect } from 'react';
import { postingApi } from '../api/postingApi';

// 내 모집글과 신청자 정보를 포함한 DTO (백엔드 MyPostingReponseDTO와 일치)
interface MyPostingReponseDTO {
    posting: {
        postingId: number;
        userId: number;
        title: string;
        sidoSigungu: string;
        appointmentDatetime: string;
        registrationDatetime: string;
        workingHours: string;
        address: string;
        isSelf: number;
        personName: string;
        personPhoneNumber: string;
        hasMobileInvitation: number;
        payTypeStr: string;
        payAmount: string;
        tags: string[];
        guestMainRole: string;
        detailContent: string;
        nickname: string;
        targetPersonnel: number;
    };
    applyCount: number;
    confirmationCount: number;
}

interface UseMyPostingListReturn {
    postings: MyPostingReponseDTO[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useMyPostingList = (): UseMyPostingListReturn => {
    const [postings, setPostings] = useState<MyPostingReponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(() => {
        fetchMyPostings();
    }, []);

    return {
        postings,
        loading,
        error,
        refetch: fetchMyPostings
    };
};
