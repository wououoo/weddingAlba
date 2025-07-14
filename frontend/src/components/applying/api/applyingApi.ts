import { post, get, put } from "../../../utils/httpClient";
import { ApplyingResponseDTO } from "../dto/ApplyingResponseDTO";
import { ApplyingRequestDTO } from "../dto/ApplyingRequestDTO";

// API 기본 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const applyingApi = {
    // 신청글 추가
    addApplying: async (applyingData: ApplyingRequestDTO) => {
        try {
            return await post<ApplyingResponseDTO>(`${API_BASE_URL}/applying`, applyingData);
        } catch (error) {
            return {
                success: false,
                data: null,
                message: '신청에 실패했습니다.'
            };
        }
    },

    // 신청글 수정
    updateApplying: async (applyingData: ApplyingRequestDTO, applyingId: number) => {
        try {
            return await put<ApplyingResponseDTO>(`${API_BASE_URL}/applying/${applyingId}`, applyingData);
        } catch (error) {
            return {
                success: false,
                data: null,
                message: '신청 수정에 실패했습니다.'
            };
        }
    },

    // 신청글 상세 조회
    getApplyingDetail: async (applyingId: string) => {
        try {
            return await get<ApplyingResponseDTO>(`${API_BASE_URL}/applying/detail/${applyingId}`);
        } catch (error) {
            return {
                success: false,
                data: null,
                message: '신청글 조회에 실패했습니다.'
            };
        }
    },

    // 내가 신청한글 리스트 조회
    getMyApplyingList: async (page: number, size: number, status?: string) => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('page', page.toString());
            queryParams.append('size', size.toString());
            if (status && status !== "전체") {
                queryParams.append('status', status);
            }
            return await get<{ content: ApplyingResponseDTO[], last: boolean }>(`${API_BASE_URL}/applying/my/page?${queryParams.toString()}`);
        } catch (error) {
            return {
                success: false,
                data: { content: [], last: true },
                message: '내 신청 목록 조회에 실패했습니다.'
            };
        }
    },

    // 사용자가 특정 모집글에 신청했는지 확인하고 신청글 ID 반환
    checkUserApplying: async (postingId: number) => {
        try {
            return await get<{ applyingId: number | null; hasApplied: boolean }>(`${API_BASE_URL}/applying/check/${postingId}`);
        } catch (error) {
            return {
                success: false,
                data: { applyingId: null, hasApplied: false },
                message: '신청 상태 확인에 실패했습니다.'
            };
        }
    },

    getApplyingListByPostingId: async (postingId: number) => {
        try {
            return await get<ApplyingResponseDTO[]>(`${API_BASE_URL}/applying/list/${postingId}`);
        } catch (error) {
            return {
                success: false,
                data: [],   
            }
        }
    }


}

