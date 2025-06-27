import React, { useState } from "react";
import ApplyingCard from "./component/ApplyingCard";
import { ApplyingResponseDTO } from "./dto/ApplyingResponseDTO";

// 샘플 신청 리스트 데이터
const sampleApplyingList: ApplyingResponseDTO[] = [
    {
        applyingId: 1,
        userId: 100,
        postingId: 1,
        posting: {
            postingId: 1,
            userId: 101,
            title: "친구 결혼식 도우미 모집",
            sidoSigungu: "서울 강남구",
            appointmentDatetime: "2025년 06월 20일 15시",
            registrationDatetime: "2025년 05월 18일 10시 30분",
            workingHours: "3시간",
            address: "서울시 강남구 예식홀 1층",
            buildingName: "강남 웨딩홀",
            isSelf: 0,
            personName: "이민수",
            personPhoneNumber: "010-1234-5678",
            hasMobileInvitation: 1,
            startTime: "15:00",
            endTime: "18:00",
            payType: "DAILY",
            payTypeStr: "일급",
            payAmount: "50000",
            tags: ["친구대행", "당일지급", "식비지급"],
            guestMainRole: "고등학교 동창",
            detailContent: "90년대 초반 여성, MBTI가 E였으면 좋겠습니다.",
            nickname: "포효하는 고라니123",
            targetPersonnel: 2
        },
        status: 0, // 대기
        statusText: "대기",
        applyDatetime: "2025년 05월 19일 14시 30분",
        prContent: "안녕하세요! 결혼식 도우미 경험이 있고, 밝고 적극적인 성격입니다. 꼼꼼하게 도와드리겠습니다.",
        confirmationDatetime: null
    },
    {
        applyingId: 2,
        userId: 100,
        postingId: 2,
        posting: {
            postingId: 2,
            userId: 102,
            title: "사촌 결혼식 도와주실 분 구합니다",
            sidoSigungu: "부산 해운대구",
            appointmentDatetime: "2025년 07월 10일 11시",
            registrationDatetime: "2025년 05월 17일 14시 20분",
            workingHours: "4시간",
            address: "부산 해운대 더베이 101",
            buildingName: "해운대 웨딩홀",
            isSelf: 0,
            personName: "정윤아",
            personPhoneNumber: "010-9876-5432",
            hasMobileInvitation: 0,
            startTime: "11:00",
            endTime: "15:00",
            payType: "DAILY",
            payTypeStr: "일급",
            payAmount: "60000",
            tags: ["급구", "교통비지원"],
            guestMainRole: "직장동료",
            detailContent: "조용하고 차분한 성격의 분을 선호합니다.",
            nickname: "부산토박이",
            targetPersonnel: 1
        },
        status: 1, // 승인
        statusText: "승인",
        applyDatetime: "2025년 05월 18일 11시 45분",
        prContent: "부산 거주자로 직장동료 역할 경험 있습니다. 성실하게 참여하겠습니다.",
        confirmationDatetime: "2025년 05월 19일 09시 15분"
    },
    {
        applyingId: 3,
        userId: 100,
        postingId: 3,
        posting: {
            postingId: 3,
            userId: 103,
            title: "동생 결혼식 하객 대행 구해요",
            sidoSigungu: "인천 연수구",
            appointmentDatetime: "2025년 08월 15일 12시",
            registrationDatetime: "2025년 05월 16일 16시 10분",
            workingHours: "2시간",
            address: "인천 연수구 송도 컨벤시아",
            buildingName: "송도 컨벤시아",
            isSelf: 0,
            personName: "김철수",
            personPhoneNumber: "010-5555-7777",
            hasMobileInvitation: 1,
            startTime: "12:00",
            endTime: "14:00",
            payType: "HOURLY",
            payTypeStr: "시급",
            payAmount: "15000",
            tags: ["대학동기", "식사제공"],
            guestMainRole: "대학교 동기",
            detailContent: "20대 후반~30대 초반, 대학교 동기 역할로 참석해주세요.",
            nickname: "송도거주자",
            targetPersonnel: 3
        },
        status: -1, // 거절
        statusText: "거절",
        applyDatetime: "2025년 05월 17일 20시 30분",
        prContent: "대학교 동기 역할 경험이 많습니다. 자연스럽게 참여할 수 있어요.",
        confirmationDatetime: "2025년 05월 18일 10시 00분"
    }
];

const ApplyingListPage: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState("전체");

    // 상태별 필터링
    const getFilteredApplyings = () => {
        if (selectedStatus === "전체") {
            return sampleApplyingList;
        }
        
        const statusMap: { [key: string]: number } = {
            "대기": 0,
            "승인": 1,
            "거절": -1
        };
        
        return sampleApplyingList.filter((applying: ApplyingResponseDTO) => 
            applying.status === statusMap[selectedStatus]
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* 헤더 */}
            <div className="bg-white px-4 py-6">
                <h1 className="text-center text-xl font-bold text-gray-900 mb-4">
                    내 신청 현황을 확인하세요.
                </h1>
                
                {/* 상태 필터 */}
                <div className="flex justify-center">
                    <div className="relative w-48">
                        <select 
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                            <option value="전체">전체 상태</option>
                            <option value="대기">대기</option>
                            <option value="승인">승인</option>
                            <option value="거절">거절</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* 신청 리스트 */}
            <div className="px-4 py-2">
                {getFilteredApplyings().length > 0 ? (
                    getFilteredApplyings().map((applying: ApplyingResponseDTO) => (
                        <ApplyingCard
                            key={applying.applyingId}
                            {...applying}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-2">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <p className="text-gray-500">해당 상태의 신청이 없습니다.</p>
                    </div>
                )}
            </div>

            {/* 하단 여백 */}
            <div className="h-20"></div>
        </div>
    );
};

export default ApplyingListPage;
