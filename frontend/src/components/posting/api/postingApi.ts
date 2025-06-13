import { get, put, post, ApiResponse } from '../../../utils/httpClient';
import { PostingRequestDTO, PostingResponseDTO } from '../dto';

// API 기본 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const postingApi = {
    // 모집글 등록
    addPosting: async (postingData: PostingRequestDTO) => {
        try {
            return await post<PostingResponseDTO>(`${API_BASE_URL}/posting/create`, postingData);
        } catch (error) {
            return {
                success: false,
                data: null,
                message: '모집글 등록에 실패했습니다.'
            };
        }
    },

    getPostingDetail: async (id: string) => {
        try {
            return await get<PostingResponseDTO>(`${API_BASE_URL}/posting/detail/${id}`);
        } catch(error) {
            return {
                success: false,
                data: null,
                message: '모집글 상세 조회에 실패했습니다.'
            };
        }
    },
}