// CommonApplyResponseDTO 에 맞춘 타입
export interface ApplyResponseDTO {
    // == 공통 필드 ==
    userId: number;
    nickname: string;
    prContent: string;
    status: number; // 0: 대기, 1: 승인, -1: 거절
    statusText: string;
    applyDatetime: string;
    confirmationDatetime: string | null;

    // == Applying ==
    applyingId?: number;
    postingId?: number;

    // == ApplyHistory ==
    applyHistoryId?: number;
    postHistoryId?: number;
}
