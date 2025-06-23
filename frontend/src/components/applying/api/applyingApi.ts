import { post, get } from "../../../utils/httpClient";
import { ApplyingResponseDTO } from "../dto/ApplyingResponseDTO";
import { ApplyingRequestDTO } from "../dto/ApplyinhRequestDTO";

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

}

