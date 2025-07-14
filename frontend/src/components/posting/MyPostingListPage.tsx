import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyPostingList } from "./hooks/useMyPostingList";
import { convertDatetime, convertPay } from "../common/base";
import { applyingApi } from "../applying/api/applyingApi";
import { ApplyingResponseDTO } from "../applying/dto/ApplyingResponseDTO";

const MyPostingListPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedStatus, setSelectedStatus] = useState("전체");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [expandedPostings, setExpandedPostings] = useState<Set<number>>(new Set());
    const [applicantsByPosting, setApplicantsByPosting] = useState<Record<number, ApplyingResponseDTO[]>>({});
    const [loadingApplicants, setLoadingApplicants] = useState<Set<number>>(new Set());
    
    // 실제 API 호출
    const { postings: myPostings, loading, error, refetch } = useMyPostingList();

    // 신청자 정보 가져오기
    const fetchApplicants = async (postingId: number) => {
        if (loadingApplicants.has(postingId)) return;
        
        setLoadingApplicants(prev => new Set(prev).add(postingId));
        
        try {
            const response = await applyingApi.getApplyingListByPostingId(postingId);
            if (response.success && response.data) {
                setApplicantsByPosting(prev => ({
                    ...prev,
                    [postingId]: response.data || []
                }));
            }
        } catch (error) {
            console.error('신청자 정보 조회 실패:', error);
        } finally {
            setLoadingApplicants(prev => {
                const newSet = new Set(prev);
                newSet.delete(postingId);
                return newSet;
            });
        }
    };

    // 검색어와 상태별 필터링
    const getFilteredPostings = () => {
        let filtered = myPostings;

        // 검색어 필터링
        if (searchKeyword.trim()) {
            filtered = filtered.filter(posting => 
                posting.posting.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                posting.posting.sidoSigungu.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        }

        // 상태별 필터링
        if (selectedStatus !== "전체") {
            filtered = filtered.filter(posting => {
                const applicants = applicantsByPosting[posting.posting.postingId] || [];
                return applicants.some(applicant => {
                    switch (selectedStatus) {
                        case 'pending': return applicant.status === 0;
                        case 'approved': return applicant.status === 1;
                        case 'rejected': return applicant.status === -1;
                        default: return true;
                    }
                });
            });
        }

        return filtered;
    };

    // 모집글 상세 토글
    const togglePostingExpansion = (postingId: number) => {
        const newExpanded = new Set(expandedPostings);
        if (newExpanded.has(postingId)) {
            newExpanded.delete(postingId);
        } else {
            newExpanded.add(postingId);
            // 신청자 정보가 없으면 가져오기
            if (!applicantsByPosting[postingId]) {
                fetchApplicants(postingId);
            }
        }
        setExpandedPostings(newExpanded);
    };

    // 신청자 상태 변경
    const handleStatusChange = (postingId: number, applicantId: number, newStatus: 'pending' | 'approved' | 'rejected') => {
        // TODO: API 호출로 상태 변경
        console.log(`Posting ${postingId}, Applicant ${applicantId} status changed to ${newStatus}`);
    };

    // 상태별 한글 표시
    const getStatusText = (status: number) => {
        switch (status) {
            case 0: return '대기중';
            case 1: return '승인됨';
            case -1: return '거절됨';
            default: return '알 수 없음';
        }
    };

    // 상태별 색상
    const getStatusColor = (status: number) => {
        switch (status) {
            case 0: return 'bg-yellow-100 text-yellow-800';
            case 1: return 'bg-green-100 text-green-800';
            case -1: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // 로딩 상태
    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">내 모집글을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">오류가 발생했습니다</h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={refetch}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* 헤더 */}
            <div className="bg-white px-4 py-6">
                <h1 className="text-center text-xl font-bold text-gray-900 mb-4">
                    내 모집글 신청 현황
                </h1>
                
                {/* 검색 및 필터 */}
                <div className="flex flex-row gap-4 justify-center items-center max-w-4xl mx-auto">
                    {/* 검색 입력창 */}
                    <div className="relative w-full max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="모집글 제목 또는 지역으로 검색..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="block w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                        {searchKeyword && (
                            <button
                                onClick={() => setSearchKeyword("")}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200"
                            >
                                <svg className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* 상태 필터 */}
                    <div className="relative group">
                        <select 
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-6 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 min-w-[140px]"
                        >
                            <option value="전체">전체 상태</option>
                            <option value="pending">모집중</option>
                            <option value="approved">모집확정</option>
                            <option value="rejected">모집취소</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 검색 결과 개수 표시 */}
                {searchKeyword && (
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full inline-block shadow-sm">
                            <span className="font-medium text-blue-600">"{searchKeyword}"</span> 검색 결과: <span className="font-semibold">{getFilteredPostings().length}개</span>
                        </p>
                    </div>
                )}
            </div>

            {/* 모집글 리스트 */}
            <div className="px-4 py-2">
                {getFilteredPostings().map((posting) => (
                    <div key={posting.posting.postingId} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                        {/* 모집글 기본 정보 */}
                        <div 
                            className="p-4 cursor-pointer hover:bg-gray-50"
                            onClick={() => posting.posting.postingId && navigate(`/posting/${posting.posting.postingId}`)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-900 pr-2">
                                    {posting.posting.title}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500">
                                    <span className="mr-2">신청자 {posting.applyCount}명</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            posting.posting.postingId && togglePostingExpansion(posting.posting.postingId);
                                        }}
                                        className="p-1 hover:bg-gray-200 rounded"
                                    >
                                        <svg 
                                            className={`w-4 h-4 transition-transform ${
                                                posting.posting.postingId && expandedPostings.has(posting.posting.postingId) ? 'rotate-180' : ''
                                            }`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <span>{posting.posting.sidoSigungu}</span>
                                <span className="mx-2">•</span>
                                <span>{convertDatetime(posting.posting.appointmentDatetime)}</span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-2">
                                {posting.posting.tags?.map((tag, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="text-sm text-gray-600 mb-3">
                                <span className="font-medium text-blue-600">{posting.posting.payTypeStr} {Number(posting.posting.payAmount).toLocaleString()}원</span>
                                <span className="mx-2">•</span>
                                <span>{Math.floor(Number(posting.posting.workingHours))}시간</span>
                            </div>

                            {/* 모집글 관리 버튼들 */}
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                {/* 모집취소 버튼 */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log(`모집글 ${posting.posting.postingId} 취소`);
                                        // TODO: 모집취소 API 호출
                                    }}
                                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                >
                                    모집취소
                                </button>

                                {/* 확정 버튼 (모집인원과 확정인원이 같을 때) */}
                                {(() => {
                                    const approvedCount = posting.confirmationCount;
                                    const targetCount = posting.posting.targetPersonnel || 0;
                                    
                                    return approvedCount === targetCount && targetCount > 0 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log(`모집글 ${posting.posting.postingId} 확정 완료`);
                                                // TODO: 모집확정 API 호출
                                            }}
                                            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                                        >
                                            확정완료
                                        </button>
                                    );
                                })()}

                                {/* 모집 현황 표시 */}
                                <div className="flex items-center text-xs text-gray-500 ml-auto">
                                    <span>
                                        확정 {posting.confirmationCount}명 / 
                                        목표 {posting.posting.targetPersonnel || 0}명
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 신청자 리스트 (확장 시 표시) */}
                        {posting.posting.postingId && expandedPostings.has(posting.posting.postingId) && (
                            <div className="border-t bg-gray-50">
                                {loadingApplicants.has(posting.posting.postingId) ? (
                                    <div className="p-6 text-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                        <p className="text-gray-500 text-sm">신청자 정보를 불러오는 중...</p>
                                    </div>
                                ) : (
                                    <div className="p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">신청자 목록</h4>
                                        {(() => {
                                            const applicants = applicantsByPosting[posting.posting.postingId] || [];
                                            if (applicants.length === 0) {
                                                return (
                                                    <div className="text-center text-gray-500 py-4">
                                                        신청자가 없습니다.
                                                    </div>
                                                );
                                            }
                                            
                                            return (
                                                <div className="space-y-3">
                                                    {applicants.map((applicant) => (
                                                        <div 
                                                            key={applicant.applyingId} 
                                                            className="bg-white rounded-lg p-4 border cursor-pointer hover:bg-gray-50 transition-colors"
                                                            onClick={() => navigate(`/applying/${applicant.applyingId}`)}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <h5 className="font-medium text-gray-900">
                                                                        {applicant.posting.nickname || '알 수 없음'}
                                                                    </h5>
                                                                    <p className="text-sm text-gray-500">
                                                                        신청일: {convertDatetime(applicant.applyDatetime)}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(applicant.status)}`}>
                                                                        {getStatusText(applicant.status)}
                                                                    </span>
                                                                    <select
                                                                        value={applicant.status === 0 ? 'pending' : applicant.status === 1 ? 'approved' : 'rejected'}
                                                                        onChange={(e) => {
                                                                            e.stopPropagation();
                                                                            handleStatusChange(
                                                                                posting.posting.postingId, 
                                                                                applicant.applyingId, 
                                                                                e.target.value as 'pending' | 'approved' | 'rejected'
                                                                            );
                                                                        }}
                                                                        className="text-xs border border-gray-300 rounded px-2 py-1"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <option value="pending">대기중</option>
                                                                        <option value="approved">승인</option>
                                                                        <option value="rejected">거절</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            
                                                            {applicant.prContent && (
                                                                <div className="mt-2">
                                                                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                                                        {applicant.prContent}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 빈 상태 */}
            {getFilteredPostings().length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchKeyword ? '검색 결과가 없습니다' : '작성한 모집글이 없습니다'}
                    </h3>
                    <p className="text-gray-500 text-center mb-6">
                        {searchKeyword ? '다른 검색어를 시도해보세요' : '새로운 모집글을 작성해보세요'}
                    </p>
                    {!searchKeyword && (
                        <button
                            onClick={() => navigate('/posting/create')}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            모집글 작성하기
                        </button>
                    )}
                </div>
            )}

            {/* 하단 여백 */}
            <div className="h-20"></div>
        </div>
    );
};

export default MyPostingListPage; 