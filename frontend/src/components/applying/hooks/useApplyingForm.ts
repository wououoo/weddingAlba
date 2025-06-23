import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyingApi } from '../api/applyingApi';
import { ApplyingRequestDTO } from '../dto/ApplyinhRequestDTO';

interface UseApplyingFormProps {
    isEditMode?: boolean;
    postingId?: number;
    userId?: number;
    initialPrContent?: string;
}

export const useApplyingForm = ({ 
    isEditMode = false, 
    postingId, 
    userId, 
    initialPrContent = '' 
}: UseApplyingFormProps = {}) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prContent, setPrContent] = useState<string>(initialPrContent);

    const handlePrContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrContent(e.target.value);
    };

    const validateForm = (): boolean => {
        if (!prContent.trim()) {
            alert('자기소개 내용을 입력해주세요.');
            return false;
        }

        if (prContent.length < 50) {
            alert('자기소개는 최소 50자 이상 입력해주세요.');
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
                setError(response.message || '신청에 실패했습니다.');
                return {
                    success: false,
                    data: null,
                    message: response.message || '신청에 실패했습니다.'
                };
            }
        } catch (error) {
            const errorMessage = '신청 중 오류가 발생했습니다.';
            setError(errorMessage);
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

        if (!postingId || !userId) {
            alert('필수 정보가 누락되었습니다.');
            return;
        }

        try {
            if (isEditMode) {
                // 수정 함수 (나중에 구현)
                console.log("신청 수정: ", prContent);
                // TODO: 수정 API 호출
                navigate(-1);
            } else {
                // 등록 함수
                const applyingData: ApplyingRequestDTO = {
                    postingId,
                    userId,
                    prContent
                };

                const result = await applyToPosting(applyingData);
                
                if (result.success) {
                    alert('신청이 완료되었습니다.');
                    navigate(-1);
                } else {
                    alert(result.message);
                }
            }
        } catch (error) {
            alert('처리 중 오류가 발생했습니다.');
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
        applyToPosting
    };
};