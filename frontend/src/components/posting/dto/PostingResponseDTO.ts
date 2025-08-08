/**
 * 모집글 관련 DTO 통합 파일
 * 활성 모집글과 히스토리 모집글을 통합하여 처리하는 DTO들
 */

// === 공통 타입 정의 ===
export type PayType = 'HOURLY' | 'DAILY';

// === Base 인터페이스 ===
export interface BasePostingDTO {
    // 기본정보
    postingId?: number;                 // 모집글 ID
    title?: string;                     // 모집글 제목
    isSelf?: number | null;             // 본인 결혼식 여부
    personName?: string;                // 결혼식 당사자 이름
    personPhoneNumber?: string;         // 결혼식 당사자 번호
    registrationDatetime?: string;      // 모집글 등록일시 (ISO format)
    updateDatetime?: string;            // 모집글 수정일시 (ISO format)

    // 예식 정보
    appointmentDatetime?: string;       // 결혼식 예정일시 (ISO format)
    hasMobileInvitation?: number | null; // 모바일 청첩장 제출 여부
    address?: string;
    buildingName?: string;
    sidoSigungu?: string;

    // 알바 정보
    workingHours?: string;              // 근무시간 
    startTime?: string;                 // HH:mm:ss format
    endTime?: string;                   // HH:mm:ss format
    payType?: PayType;                  // 급여 타입
    payTypeText?: string;               // 일급 인지 시급인지
    payAmount?: string;                 // 임금
    guestMainRole?: string;             // 주 하객 업무내용
    targetPersonnel?: number;           // 모집인원
    detailContent?: string;             // 상세 내용
    tags?: string[];                    // 태그

    // 모집자 정보
    userId?: number;                    // 모집자 ID
    nickname?: string;                  // 모집자 닉네임

    // 공통 계산 필드
    applyCount?: number;                // 지원자 수
    confirmationCount?: number;         // 확정자 수
    status?: number;                    // 0: 모집중, 1: 모집확정, -1: 모집취소
}

// === 일반 모집글 응답 DTO ===
export interface PostingResponseDTO extends BasePostingDTO {
    // 일반 모집글 조회/상세보기용
    // 추가 필요한 필드가 있으면 여기에 정의
}

// === 내 모집글 응답 DTO ===
export interface MyPostingResponseDTO extends BasePostingDTO {
    // === 구분 필드 ===
    dataType?: string;                  // "ACTIVE" 또는 "HISTORY"

    // === PostHistoryDTO 전용 필드들 (히스토리) ===
    postHistoryId?: number;             // nullable, HISTORY일 때만 사용

    // === 편의 메서드들 ===
    isActive?: () => boolean;
    isHistory?: () => boolean;
}

// === 유틸리티 함수들 ===
export const PostingDTOUtils = {
    isActive: (dto: MyPostingResponseDTO): boolean => {
        return dto.dataType === "ACTIVE";
    },
    
    isHistory: (dto: MyPostingResponseDTO): boolean => {
        return dto.dataType === "HISTORY";
    },

    // ID 헬퍼 함수 - dataType에 따라 적절한 ID 반환
    getPostingId: (posting: MyPostingResponseDTO): number | undefined => {
        if (posting.dataType === "HISTORY") {
            return posting.postHistoryId;
        }
        return posting.postingId;
    },

    // 상태에 따른 배경색 결정
    getBackgroundColor: (posting: MyPostingResponseDTO): string => {
        if (posting.status === 1) {
            return 'bg-green-50 border border-green-200';
        } else if (posting.status === -1) {
            return 'bg-red-50 border border-red-200';
        }
        return 'bg-white border border-gray-200';
    }
};


