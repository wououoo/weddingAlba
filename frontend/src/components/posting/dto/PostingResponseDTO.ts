// 기본 DTO
export interface PostingResponseDTO {
    postingId?: number;                 // 모집글 ID
    title?: string;                     // 모집글 제목
    simplyLocation?: string;            // 간략한 위치
    appointmentDatetime?: string;       // 약속일시
    registrationDatetime?: string;      // 모집글 등록일시
    workingHours?: string;              // 근무시간 
    location?: string;                  // 결혼식 우치
    isSelf?: boolean;                   // 본인 결혼식 여부
    personName?: string;                // 결혼식 당사자 이름
    personPhoneNumber?: string;         // 결혼식 당사자 번호
    hasMobileInvitation?: boolean;      // 모바일 청첩장 제출 여부
    wages?: string;                     // 임금
    perPay?: string;                    // 일급 인지 시급인지
    tags?: string[] | [];               // 태그
    guestMainRole?: string;             // 주 하객 업무내용
    taskDescription?: string;           //상세 내용

    // 모집자 정보
    userId?: number;                    // 모집자 ID
    nickname?: string;                  // 모집자 닉네임
    postingHistoryCount?: number;       // 누적 모집횟수
}

// 더미데이터
export const sampleData: PostingResponseDTO = {
    postingId: 1,
    title: '친구 결혼식 도우미 모집',
    simplyLocation: '서울 강남',
    appointmentDatetime: '2025년 06월 20일 15시',
    registrationDatetime: '2025년 05월 18일 10시 30분',
    workingHours: '최소 2시간 이상',
    location: '서울시 강남구 예식홀 1층',
    isSelf: false,
    personName: '이민수',
    personPhoneNumber: '010-1234-5678',
    hasMobileInvitation: true,
    wages: '50,000원',
    perPay: '일급',
    tags: [
        '친구대행',
        '당일지급',
        '식비지급'
    ],
    guestMainRole: '고등학교 동창',
    taskDescription: '90년대 초반 여성, MBTI가 E였으면 좋겠습니다.',

    userId: 101,
    nickname : '포효하는 고라니123',
    postingHistoryCount: 3
};


export const sampleDataList: PostingResponseDTO[] = [
    {
        postingId: 1,
        userId: 101,
        title: '친구 결혼식 도우미 모집',
        simplyLocation:'서울 강남',
        appointmentDatetime: '2025년 06월 20일 15시',
        registrationDatetime: '2025년 05월 18일 10시 30분',
        location: '서울시 강남구 예식홀 1층',
        isSelf: false,
        personName: '이민수',
        personPhoneNumber: '010-1234-5678',
        hasMobileInvitation: true,
        perPay : '일급',
        wages: '50,000원',
        tags: [
            '친구대행',
            '당일지급',
            '식비지급'
        ]
    },
    {
        postingId: 2,
        userId: 102,
        title: '내 결혼식 도와주실 분 구해요!',
        simplyLocation:'부산 해운대',
        appointmentDatetime: '2025년 07월 10일 11시',
        registrationDatetime: '2025년 05월 17일 14시 20분',
        location: '부산 해운대 더베이 101',
        isSelf: true,
        personName: '정윤아',
        personPhoneNumber: '010-9876-5432',
        hasMobileInvitation: false,
        perPay : '시급',
        wages: '15,000원',
        tags: [
            '급구',
            '당일지급',
            '친구대행'
        ]
    },
    {
        postingId: 3,
        userId: 103,
        title: '사촌 결혼식 도와주실 분 구합니다',
        simplyLocation:'대전 중구',
        appointmentDatetime: '2025년 08월 05일 13시 30분',
        registrationDatetime: '2025년 05월 15일 09시 00분',
        location: '대전 중구 사랑웨딩홀',
        isSelf: false,
        personName: '최현우',
        personPhoneNumber: '010-5555-6666',
        hasMobileInvitation: true,
        perPay : '일급',
        wages: '60,000원',
        tags: [
            '급구',
            '교통비지원'
        ]
    }
]
