export interface ApplyingResponseDTO {
    applyId: number;
    userId: number;
    postingId: number;
    status: number; // 0: 대기, 1: 승인, -1: 거절
    applyDatetime: string;
    prContent: string;
    confirmationDatetime: string | null;
}

export const sampleApplyingList: ApplyingResponseDTO[] = [
    {
        applyId: 1,
        userId: 101,
        postingId: 1001,
        status: 0,
        applyDatetime: "2025-05-20 10:00:00",
        prContent: "안녕하세요! 결혼식 도우미 경험이 많습니다.",
        confirmationDatetime: null
    },
    {
        applyId: 2,
        userId: 101,
        postingId: 1002,
        status: 1,
        applyDatetime: "2025-05-19 14:30:00",
        prContent: "성실하게 도와드리겠습니다.",
        confirmationDatetime: "2025-05-20 11:00:00"
    },
    {
        applyId: 3,
        userId: 102,
        postingId: 1003,
        status: -1,
        applyDatetime: "2025-05-18 09:00:00",
        prContent: "책임감 있게 참여하겠습니다.",
        confirmationDatetime: "2025-05-19 16:00:00"
    }
];

export const sampleApplyingData: ApplyingResponseDTO = {
    applyId: 1,
    userId: 101,
    postingId: 1001,
    status: 0, // 0: 대기, 1: 승인, -1: 거절
    applyDatetime: "2025-05-20 10:00:00",
    prContent: "안녕하세요! 결혼식 도우미 경험이 많습니다. 성실하고 책임감 있게 일합니다. 이전에도 비슷한 경험이 있어 빠르게 적응할 수 있습니다. 연락 기다리겠습니다!",
    confirmationDatetime: null
}; 