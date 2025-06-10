import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostingCard from "./component/PostingCard";
import { PostingResponseDTO } from "./dto/PostingResponseDTO";

const PostingListPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState("전체");
    const [selectedDistrict, setSelectedDistrict] = useState("전체");
    const [selectedRole, setSelectedRole] = useState("전체");

    // 지역 데이터
    const districtData: { [key: string]: string[] } = {
        "서울": ["강남구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
        "경기": ["수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시", "남양주시", "화성시", "평택시", "의정부시", "시흥시", "파주시", "김포시", "광명시", "군포시", "하남시", "오산시", "이천시", "안성시", "의왕시", "양평군", "과천시", "구리시", "동두천시", "여주시", "연천군", "포천시", "가평군", "양주시"],
        "인천": ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
        "부산": ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구", "기장군"],
        "대전": ["동구", "중구", "서구", "유성구", "대덕구"]
    };

    // 선택된 시/도에 따른 구/군 목록
    const getDistrictOptions = () => {
        if (selectedCity === "전체") return [];
        return districtData[selectedCity] || [];
    };

    // 시/도 변경 시 구/군 초기화
    const handleCityChange = (city: string) => {
        setSelectedCity(city);
        setSelectedDistrict("전체");
    };

    // 하객알바 모집글 샘플 데이터
    const postings: PostingResponseDTO[] = [
        {
            postingId: 1,
            userId: 101,
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
            payType: '일급',
            payAmount: '50,000원',
            tags: [
                '친구대행',
                '당일지급',
                '식비지급'
            ],
            guestMainRole: '고등학교 동창',
            detailContent: '90년대 초반 여성, MBTI가 E였으면 좋겠습니다.',
            nickname: '포효하는 고라니123',
            postingHistoryCount: 3
        },
        {
            postingId: 2,
            userId: 102,
            title: '내 결혼식 도와주실 분 구해요!',
            simplyLocation: '부산 해운대',
            appointmentDatetime: '2025년 07월 10일 11시',
            registrationDatetime: '2025년 05월 17일 14시 20분',
            workingHours: '3시간 정도',
            location: '부산 해운대 더베이 101',
            isSelf: true,
            personName: '정윤아',
            personPhoneNumber: '010-9876-5432',
            hasMobileInvitation: false,
            payType: '시급',
            payAmount: '15,000원',
            tags: [
                '급구',
                '당일지급',
                '친구대행'
            ],
            guestMainRole: '대학교 친구',
            detailContent: '밝고 활발한 성격이신 분을 찾습니다.',
            nickname: '행복한신부',
            postingHistoryCount: 1
        },
        {
            postingId: 3,
            userId: 103,
            title: '사촌 결혼식 도와주실 분 구합니다',
            simplyLocation: '대전 중구',
            appointmentDatetime: '2025년 08월 05일 13시 30분',
            registrationDatetime: '2025년 05월 15일 09시 00분',
            workingHours: '4시간 이상',
            location: '대전 중구 사랑웨딩홀',
            isSelf: false,
            personName: '최현우',
            personPhoneNumber: '010-5555-6666',
            hasMobileInvitation: true,
            payType: '일급',
            payAmount: '60,000원',
            tags: [
                '급구',
                '교통비지원'
            ],
            guestMainRole: '직장동료',
            detailContent: '조용하고 차분한 성격의 분을 선호합니다.',
            nickname: '대전거주자',
            postingHistoryCount: 5
        },
        {
            postingId: 4,
            userId: 104,
            title: '동생 결혼식 축하해주실 분',
            simplyLocation: '인천 연수구',
            appointmentDatetime: '2025년 09월 15일 14시',
            registrationDatetime: '2025년 05월 20일 16시 45분',
            workingHours: '2시간 반',
            location: '인천 연수구 그랜드웨딩홀',
            isSelf: false,
            personName: '김서연',
            personPhoneNumber: '010-7777-8888',
            hasMobileInvitation: true,
            payType: '일급',
            payAmount: '45,000원',
            tags: [
                '친구대행',
                '식비지급',
                '주차지원'
            ],
            guestMainRole: '회사 후배',
            detailContent: '20대 후반~30대 초반 여성분을 찾고 있습니다.',
            nickname: '착한언니',
            postingHistoryCount: 2
        },
        {
            postingId: 5,
            userId: 105,
            title: '지인 결혼식 참석 도우미',
            simplyLocation: '경기 수원',
            appointmentDatetime: '2025년 10월 01일 12시',
            registrationDatetime: '2025년 05월 22일 11시 15분',
            workingHours: '최소 3시간',
            location: '경기도 수원시 팔달구 로얄웨딩홀',
            isSelf: false,
            personName: '박지민',
            personPhoneNumber: '010-2222-3333',
            hasMobileInvitation: false,
            payType: '시급',
            payAmount: '18,000원',
            tags: [
                '당일지급',
                '교통비지원',
                '선물준비'
            ],
            guestMainRole: '동네친구',
            detailContent: '밝고 사교적인 성격의 분이면 좋겠어요.',
            nickname: '수원토박이',
            postingHistoryCount: 7
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
                        {/* 헤더 */}
            <div className="bg-white px-4 py-6">
                <h1 className="text-center text-xl font-bold text-gray-900 mb-4">
                    원하는 지역과 역할 선택해보세요.
                </h1>
                
                {/* 드롭다운 필터들 */}
                <div className="grid grid-cols-3 gap-3">
                    {/* 시/도 선택 */}
                    <div className="relative">
                        <select 
                            value={selectedCity}
                            onChange={(e) => handleCityChange(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                            <option value="전체">전체</option>
                            <option value="서울">서울</option>
                            <option value="경기">경기</option>
                            <option value="인천">인천</option>
                            <option value="부산">부산</option>
                            <option value="대전">대전</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>

                    {/* 구/군 선택 */}
                    <div className="relative">
                        <select 
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            disabled={selectedCity === "전체"}
                            className={`appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                                selectedCity === "전체" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
                            }`}
                        >
                            <option value="전체">
                                {selectedCity === "전체" ? "시/도 먼저 선택" : "전체"}
                            </option>
                            {getDistrictOptions().map((district) => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>

                    {/* 하객 역할 카테고리 */}
                    <div className="relative">
                        <select 
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                            <option value="전체">전체 역할</option>
                            <option value="친구대행">친구대행</option>
                            <option value="동창">동창</option>
                            <option value="직장동료">직장동료</option>
                            <option value="가족/친척">가족/친척</option>
                            <option value="동네친구">동네친구</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* 모집글 리스트 */}
            <div className="px-4 py-2">
                {postings.map((posting) => (
                    <PostingCard
                        key={posting.postingId}
                        {...posting}
                    />
                ))}
            </div>

            {/* 하단 여백 */}
            <div className="h-20"></div>
        </div>
    );
};

export default PostingListPage; 