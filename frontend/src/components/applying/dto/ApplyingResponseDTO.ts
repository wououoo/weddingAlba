import { PostingResponseDTO } from "../../posting/dto";
import { ProfileResponseDTO } from "../../profile";

export interface ApplyingResponseDTO {
    applyingId: number;
    userId: number;
    postingId: number;
    posting: PostingResponseDTO;
    profile: ProfileResponseDTO;
    status: number; // 0: 대기, 1: 승인, -1: 거절
    statusText: string;
    applyDatetime: string;
    prContent: string;
    confirmationDatetime: string | null;
}
