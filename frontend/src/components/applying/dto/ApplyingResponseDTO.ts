import { PostingResponseDTO } from "../../posting/dto";

export interface BaseApplyingDTO {
    applyingId?: number;
    postingId?: number;
    userId: number;
    nickname: string;
    prContent: string;
    status: number; // 0: 대기, 1: 승인, -1: 거절
    statusText: string;
    applyDatetime: string;
    confirmationDatetime: string | null;
    posting?: PostingResponseDTO;
    
    // CommonApplyResponseDTO와 동일하게 추가
    applyHistoryId?: number;
    postHistoryId?: number;
}

export interface ApplyingResponseDTO extends BaseApplyingDTO {
}

export interface MyApplyingResponseDTO extends BaseApplyingDTO {
    // BaseApplyingDTO에 이미 포함되어 있음
}
