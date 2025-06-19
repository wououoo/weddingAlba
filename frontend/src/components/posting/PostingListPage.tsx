import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostingCard from "./component/PostingCard";
import { PostingResponseDTO } from "./dto/PostingResponseDTO";
import { usePostingList } from "./hooks/usePostingList";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";

const PostingListPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState("전체");
    const [selectedDistrict, setSelectedDistrict] = useState("전체");
    const [selectedRole, setSelectedRole] = useState("전체");

    const { 
        postingList, 
        loading, 
        hasMore, 
        error, 
        loadMorePostings, 
        loadFirstPage,
        setAddress,
        setGuestMainRole
    } = usePostingList();

    // 무한스크롤 훅 사용
    useInfiniteScroll({
        hasMore,
        loading,
        loadMore: loadMorePostings,
        threshold: 200
    });

    // 선택된 지역이나 역할이 변경될 때마다 게시글 다시 불러오기
    useEffect(() => {
        // '전체'가 아닌 경우에만 address 설정 (구/군이 선택된 경우 우선)
        let fullAddress = '';
        if (selectedDistrict !== "전체" && selectedDistrict !== "시/도 먼저 선택") {
            fullAddress = selectedDistrict;
        } else if (selectedCity !== "전체") {
            fullAddress = selectedCity;
        }

        setAddress(fullAddress);
        setGuestMainRole(selectedRole === "전체" ? '' : selectedRole);
        
        // 필터 변경 시 첫 페이지부터 다시 로드
        loadFirstPage();
    }, [selectedCity, selectedDistrict, selectedRole, setAddress, setGuestMainRole, loadFirstPage]);

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

            {/* 에러 메시지 */}
            {error && (
                <div className="px-4 py-2">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            )}

            {/* 모집글 리스트 */}
            <div className="px-4 py-2">
                {postingList.map((posting: PostingResponseDTO) => (
                    <PostingCard
                        key={posting.postingId}
                        {...posting}
                    />
                ))}
                
                {/* 로딩 인디케이터 */}
                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-600">게시글을 불러오는 중...</span>
                    </div>
                )}
                
                {/* 더 이상 데이터가 없을 때 */}
                {!hasMore && postingList.length > 0 && (
                    <div className="text-center py-8 text-gray-500">
                        모든 게시글을 불러왔습니다.
                    </div>
                )}
                
                {/* 게시글이 없을 때 */}
                {!loading && postingList.length === 0 && !error && (
                    <div className="text-center py-8 text-gray-500">
                        등록된 게시글이 없습니다.
                    </div>
                )}
            </div>

            {/* 하단 여백 */}
            <div className="h-20"></div>
        </div>
    );
};

export default PostingListPage; 