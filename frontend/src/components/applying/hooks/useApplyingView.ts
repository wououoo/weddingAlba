import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { applyingApi } from '../api/applyingApi';
import { ApplyingResponseDTO } from '../dto/ApplyingResponseDTO';
import { getUserIdFromToken } from '../../../OAuth2/authUtils';

export const useApplyingView = () => {
    const navigate = useNavigate();
    const { applyingId } = useParams<{ applyingId: string }>();
    
    // 상태 관리
    const [applyingData, setApplyingData] = useState<ApplyingResponseDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    // 현재 사용자 ID 추출
    useEffect(() => {
        const userId = getUserIdFromToken();
        setCurrentUserId(userId);
    }, []);

    // 신청 데이터 가져오기
    useEffect(() => {
        if (applyingId) {
            const fetchApplying = async () => {
                try {
                    setIsLoading(true);
                    const response = await applyingApi.getApplyingDetail(applyingId);

                    if (response.success && response.data) {
                        setApplyingData(response.data);
                    } else {
                        console.error("Failed to fetch applying detail:", response.message);
                        setApplyingData(null);
                    }
                } catch (error) {
                    console.error("Error fetching applying data:", error);
                    setApplyingData(null);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchApplying();
        }
    }, [applyingId]);

    // 상태 색상 변환
    const getStatusColor = (statusCode: number) => {
        switch (statusCode) {
            case 0:
                return "text-yellow-600 bg-yellow-100";
            case 1:
                return "text-green-600 bg-green-100";
            case -1:
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    // 뒤로가기
    const goBack = () => {
        navigate(-1);
    };

    // 모집글 상세 페이지로 이동
    const goToPosting = (postingId: number) => {
        navigate(`/posting/${postingId}`);
    };

    // 신청 수정 페이지로 이동
    const goToEditApplying = () => {
        if (applyingId) {
            navigate(`/applying/edit/${applyingId}`);
        }
    };

    return {
        // 상태
        applyingData,
        isLoading,
        currentUserId,
        
        getStatusColor,
        goBack,
        goToPosting,
        goToEditApplying
    };
};
