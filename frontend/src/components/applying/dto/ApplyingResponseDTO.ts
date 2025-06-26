import { PostingResponseDTO } from "../../posting/dto";

export interface ApplyingResponseDTO {
    applyingId: number;
    userId: number;
    postingId: number;
    posting: PostingResponseDTO;
    status: number; // 0: 대기, 1: 승인, -1: 거절
    applyDatetime: string;
    prContent: string;
    confirmationDatetime: string | null;
}
