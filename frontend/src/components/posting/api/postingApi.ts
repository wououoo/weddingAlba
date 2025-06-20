import { get, put, post, del, ApiResponse } from '../../../utils/httpClient';
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

    // 모집글 수정
    updatePosting: async (postingId: string, postingData: PostingRequestDTO) => {
        try {
            return await put<PostingResponseDTO>(`${API_BASE_URL}/posting/update/${postingId}`, postingData);
        } catch (error) {
            return {
                success: false,
                data: null,
                message: '모집글 수정에 실패했습니다.'
            };
        }
    },

    // 모집글 삭제
    deletePosting: async (id: number) => {
        try {
            return await del<void>(`${API_BASE_URL}/posting/delete/${id}`);
        } catch (error) {
            return {
                success: false,
                data: null,
                message: '모집글 삭제에 실패했습니다.'
            };
        }
    },

    // 모집글 상세조회
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

    getAllPostingList: async (page: number = 0, size: number = 10, address: string = '', guestMainRole: string = '') => {
        try {
            return await get<{
                content: PostingResponseDTO[];
                totalElements: number;
                totalPages: number;
                last: boolean;
                first: boolean;
                number: number;
                size: number;
            }>(`${API_BASE_URL}/posting/list/paged?page=${page}&size=${size}&address=${address}&guestMainRole=${guestMainRole}`);
        } catch(error) {
            return {
                success: false,
                data: null,
                message: '모집글 조회에 실패했습니다.'
            };
        }
    }
}