import { post, get, put } from "../../../utils/httpClient";
import { ApplyingResponseDTO } from "../dto/ApplyingResponseDTO";
import { ApplyingRequestDTO } from "../dto/ApplyingRequestDTO";

// API 기본 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const applyingApi = {
    addApplying: async (applyingData: ApplyingRequestDTO) => {
        try {
            return await post<ApplyingResponseDTO>(`${API_BASE_URL}/applying/create`, applyingData);
        } catch (error) {
            return {
                success: false,
                data: null,
                message: '신청에 실패했습니다.'
            };
        }
    },

    updateApplying: async (applyingData: ApplyingRequestDTO, applyingId: number) => {
        try {
            return await put<ApplyingResponseDTO>(`${API_BASE_URL}/applying/update/${applyingId}`, applyingData);
        } catch (error) {
            return {
                success: false,
                data: null,
                message: '신청 수정에 실패했습니다.'
            };
        }
    },

    getApplyingDetail: async (id: string) => {
        try {
            return await get<ApplyingResponseDTO>(`${API_BASE_URL}/applying/detail/${id}`);
        } catch (error) {
            return {
                success: false,
                data: null,
                message: '신청글 조회에 실패했습니다.'
            };
        }
    },

    // 사용자가 특정 모집글에 신청했는지 확인하고 신청글 ID 반환
    checkUserApplying: async (postingId: number, userId: number) => {
        try {
            return await get<{ applyingId: number | null; hasApplied: boolean }>(`${API_BASE_URL}/applying/check/${postingId}/${userId}`);
        } catch (error) {
            return {
                success: false,
                data: { applyingId: null, hasApplied: false },
                message: '신청 상태 확인에 실패했습니다.'
            };
        }
    },

}

