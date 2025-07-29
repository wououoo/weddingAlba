/**
 * 내 모집글 응답 DTO
 * 활성 모집글과 히스토리 모집글을 통합하여 처리하는 DTO
 */

// PayType enum 정의
export type PayType = 'HOURLY' | 'DAILY';

export interface MyPostingResponseDTO {
    // === 공통 필드들 ===
    postingId?: number;
    userId?: number;
    nickname?: string;
    title?: string;
    
    appointmentDatetime?: string; // ISO format (yyyy-MM-dd'T'HH:mm:ss)
    
    isSelf?: number;
    personName?: string;
    personPhoneNumber?: string;
    
    address?: string;
    buildingName?: string;
    sidoSigungu?: string;
    hasMobileInvitation?: number;
    workingHours?: string;
    
    startTime?: string; // HH:mm:ss format
    endTime?: string; // HH:mm:ss format
    
    payAmount?: string;
    targetPersonnel?: number;
    guestMainRole?: string;
    detailContent?: string;
    tags?: string[];
    
    registrationDatetime?: string; // ISO format (yyyy-MM-dd'T'HH:mm:ss)
    updateDatetime?: string; // ISO format (yyyy-MM-dd'T'HH:mm:ss)
    
    // 공통 계산 필드
    payType?: PayType;
    payTypeText?: string;
    
    // === 구분 필드 ===
    dataType?: string; // "ACTIVE" 또는 "HISTORY"

    // === PostHistoryDTO 전용 필드들 (히스토리) ===
    postHistoryId?: number; // nullable, HISTORY일 때만 사용

    // === MyPosting 관련 필드들 ===
    applyCount?: number;
    confirmationCount?: number;
    status?: number; // 모집중(0), 모집 취소(-1), 모집 확정(1) 상태확인용
    
    // === 편의 메서드들 ===
    isActive?: () => boolean;
    isHistory?: () => boolean;
}

/**
 * 편의 함수들 - 인터페이스 외부에서 사용
 */
export const MyPostingResponseDTOUtils = {
    isActive: (dto: MyPostingResponseDTO): boolean => {
        return dto.dataType === "ACTIVE";
    },
    
    isHistory: (dto: MyPostingResponseDTO): boolean => {
        return dto.dataType === "HISTORY";
    }
}; 