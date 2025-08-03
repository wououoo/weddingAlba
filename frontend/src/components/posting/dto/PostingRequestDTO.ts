export interface PostingRequestDTO {
    // 기본정보
    title?: string;                     // 모집글 제목
    isSelf?: number;                   // 본인 결혼식 여부
    personName?: string;                // 결혼식 당사자 이름
    personPhoneNumber?: string;         // 결혼식 당사자 번호
    registrationDatetime?: string;      // 모집글 등록일시

    // 예식 정보
    appointmentDatetime?: string;       // 결혼식 예정일시
    address?: string;                   // 결혼식 장소 주소 추가
    buildingName?: string;              // 건물명 추가
    sidoSigungu?: string;               // 시도 + 시군구 추가
    hasMobileInvitation?: number;      // 모바일 청첩장 제출 여부

    // 알바 정보
    workingHours?: string;              // 근무시간 
    payType?: 'hourly' | 'daily';      // 일급 인지 시급인지
    payAmount?: string;                     // 임금
    guestMainRole?: string;             // 주 하객 업무내용
    detailContent?: string;           //상세 내용
    tags?: string[] | [];               // 태그

    // 모집자 정보
    userId?: number;                    // 모집자 ID
}