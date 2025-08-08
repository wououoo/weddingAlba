import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyingApi } from '../api/applyingApi';
import { ApplyingRequestDTO } from '../dto/ApplyingRequestDTO';
import { useToast } from '../../common/toast';

interface UseApplyingFormProps {
    postingId?: number;
    applyingId?: number;
    userId?: number;
    initialPrContent?: string;
}

export const useApplyingForm = ({ 
    postingId,
    applyingId,
    userId, 
    initialPrContent = '' 
}: UseApplyingFormProps = {}) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prContent, setPrContent] = useState<string>(initialPrContent);
    const { toastState, showToast, hideToast } = useToast();
    
    // 수정 모드 여부 판단
    const isEditMode = !!applyingId;

    // 수정 모드일 때 기존 데이터 로드
    useEffect(() => {
        if (isEditMode && applyingId) {
            const fetchApplyingDetail = async () => {
                try {
                    setIsLoading(true);
                    const response = await applyingApi.getApplyingDetail(applyingId.toString());
                    
                    if (response.success && response.data) {
                        setPrContent(response.data.prContent || '');
                    } else {
                        showToast('신청 내역을 불러오는데 실패했습니다.');
                    }
                } catch (error) {
                    showToast('신청 내역을 불러오는데 실패했습니다.');
                } finally {
                    setIsLoading(false);
                }
            };
            
            fetchApplyingDetail();
        }
    }, [isEditMode, applyingId, showToast]);

    const handlePrContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrContent(e.target.value);
    };

    const validateForm = (): boolean => {
        if (!prContent.trim()) {
            showToast('자기소개 내용을 입력해주세요.');
            return false;
        }

        if (prContent.length < 50) {
            showToast('자기소개는 최소 50자 이상 입력해주세요.');
            return false;
        }

        return true;
    };

    const applyToPosting = async (applyingData: ApplyingRequestDTO) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await applyingApi.addApplying(applyingData);
            
            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                    message: '신청이 완료되었습니다.'
                };
            } else {
                return {
                    success: false,
                    data: null,
                    message: response.message || '신청에 실패했습니다.'
                };
            }
        } catch (error: any) {
            let errorMessage = '신청 중 오류가 발생했습니다.';
            if(error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            return {
                success: false,
                data: null,
                message: errorMessage
            };
        } finally {
            setIsLoading(false);
        }
    };

    const updateApplying = async (applyingData: ApplyingRequestDTO, applyingId: number) => {
        if (!applyingId) return { success: false, message: '신청 ID가 없습니다.' };
        
        setIsLoading(true);
        setError(null);

        try {
            const response = await applyingApi.updateApplying(applyingData, applyingId);
            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                    message: '신청이 수정되었습니다.'
                };
            }
        } catch (error: any) {
            let errorMessage = '신청 수정 중 오류가 발생했습니다.';
            if(error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            return {
                success: false,
                data: null,
                message: errorMessage
            };
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        // 폼 유효성 검사
        if (!validateForm()) {
            return;
        }

        if (!userId) {
            showToast('사용자 정보가 누락되었습니다.');
            return;
        }

        if (!isEditMode && !postingId) {
            showToast('모집글 정보가 누락되었습니다.');
            return;
        }

        try {       
            const applyingData: ApplyingRequestDTO = {
                postingId: postingId!,
                prContent
            };
            if (isEditMode) {
                // 수정 함수
                const result = await updateApplying(applyingData, applyingId);
                if (result?.success) {
                    showToast('신청이 수정되었습니다.');
                    navigate(`/applying/${applyingId}`);
                } else {
                    showToast(result?.message || '신청 수정에 실패했습니다.');
                }
            } else {
                // 등록 함수

                const result = await applyToPosting(applyingData);
                if (result.success) {
                    showToast('신청이 완료되었습니다.');
                    navigate(`/applying/${result.data}`);
                } else {
                    showToast(result.message);
                }
            }
        } catch (error) {
            showToast('처리 중 오류가 발생했습니다.');
        }
    };

    const handleCancel = () => {
        console.log("신청 취소");
        navigate(-1);
    };

    return {
        // 상태
        isLoading,
        error,
        prContent,
        isEditMode,
        
        // 폼 관련
        handlePrContentChange,
        validateForm,
        
        // 액션
        handleSubmit,
        handleCancel,
        applyToPosting,

        // 토스트
        toastState,
        showToast,
        hideToast
    };
};