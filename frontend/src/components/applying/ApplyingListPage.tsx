import React, { useState } from "react";
import ApplyingCard from "./component/ApplyingCard";
import { sampleApplyingList } from "./dto/ApplyingResponseDTO";

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
        
        return sampleApplyingList.filter(applying => 
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
                    getFilteredApplyings().map((applying) => (
                        <ApplyingCard
                            key={applying.applyId}
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
}

export default ApplyingListPage;
