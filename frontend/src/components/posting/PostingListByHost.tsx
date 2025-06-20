import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostingResponseDTO } from "./dto/PostingResponseDTO";

// 신청자 정보 DTO
interface ApplicantDTO {
    applicantId: number;
    userId: number;
    nickname: string;
    appliedDatetime: string;
    status: 'pending' | 'approved' | 'rejected';
    phoneNumber?: string;
    age?: number;
    gender?: '남성' | '여성';
    introduction?: string;
}

// 내 모집글과 신청자 정보를 포함한 DTO
interface PostingWithApplicantsDTO extends PostingResponseDTO {
    applicants: ApplicantDTO[];
    applicantCount: number;
}

const PostingListByHost: React.FC = () => {
    const navigate = useNavigate();
    const [selectedStatus, setSelectedStatus] = useState("전체");
    const [expandedPostings, setExpandedPostings] = useState<Set<number>>(new Set());

    // 내가 작성한 모집글과 신청자 데이터 (샘플)
    const myPostings: PostingWithApplicantsDTO[] = [
        {
            postingId: 1,
            userId: 101,
            title: '친구 결혼식 도우미 모집',
            sidoSigungu: '서울 강남',
            appointmentDatetime: '2025년 06월 20일 15시',
            registrationDatetime: '2025년 05월 18일 10시 30분',
            workingHours: '최소 2시간 이상',
            address: '서울시 강남구 예식홀 1층',
            isSelf: 0,
            personName: '이민수',
            personPhoneNumber: '010-1234-5678',
            hasMobileInvitation: 1,
            payTypeStr: '일급',
            payAmount: '50,000원',
            tags: ['친구대행', '당일지급', '식비지급'],
            guestMainRole: '고등학교 동창',
            detailContent: '90년대 초반 여성, MBTI가 E였으면 좋겠습니다.',
            nickname: '포효하는 고라니123',
            applicantCount: 3,
            applicants: [
                {
                    applicantId: 1,
                    userId: 201,
                    nickname: '활발한민지',
                    appliedDatetime: '2025년 05월 19일 14시 20분',
                    status: 'pending',
                    phoneNumber: '010-1111-2222',
                    age: 28,
                    gender: '여성',
                    introduction: '결혼식 하객 경험이 많아요! 밝고 활발한 성격입니다.'
                },
                {
                    applicantId: 2,
                    userId: 202,
                    nickname: '친절한수영',
                    appliedDatetime: '2025년 05월 20일 09시 15분',
                    status: 'approved',
                    phoneNumber: '010-3333-4444',
                    age: 26,
                    gender: '여성',
                    introduction: '고등학교 동창 역할 잘 할 수 있어요.'
                },
                {
                    applicantId: 3,
                    userId: 203,
                    nickname: '차분한영희',
                    appliedDatetime: '2025년 05월 21일 16시 30분',
                    status: 'rejected',
                    phoneNumber: '010-5555-6666',
                    age: 32,
                    gender: '여성',
                    introduction: '조용한 성격이지만 성실하게 임하겠습니다.'
                }
            ]
        },
        {
            postingId: 2,
            userId: 101,
            title: '사촌 결혼식 도와주실 분 구합니다',
            sidoSigungu: '부산 해운대',
            appointmentDatetime: '2025년 07월 10일 11시',
            registrationDatetime: '2025년 05월 17일 14시 20분',
            workingHours: '3시간 정도',
            address: '부산 해운대 더베이 101',
            isSelf: 0,
            personName: '정윤아',
            personPhoneNumber: '010-9876-5432',
            hasMobileInvitation: 0,
            payTypeStr: '일급',
            payAmount: '60,000원',
            tags: ['급구', '교통비지원'],
            guestMainRole: '직장동료',
            detailContent: '조용하고 차분한 성격의 분을 선호합니다.',
            nickname: '포효하는 고라니123',
            applicantCount: 1,
            applicants: [
                {
                    applicantId: 4,
                    userId: 204,
                    nickname: '부산토박이',
                    appliedDatetime: '2025년 05월 18일 11시 45분',
                    status: 'pending',
                    phoneNumber: '010-7777-8888',
                    age: 30,
                    gender: '남성',
                    introduction: '부산 거주자로 직장동료 역할 경험 있습니다.'
                }
            ]
        }
    ];

    // 상태별 필터링
    const getFilteredPostings = () => {
        if (selectedStatus === "전체") return myPostings;
        return myPostings.filter(posting => 
            posting.applicants.some(applicant => applicant.status === selectedStatus)
        );
    };

    // 모집글 상세 토글
    const togglePostingExpansion = (postingId: number) => {
        const newExpanded = new Set(expandedPostings);
        if (newExpanded.has(postingId)) {
            newExpanded.delete(postingId);
        } else {
            newExpanded.add(postingId);
        }
        setExpandedPostings(newExpanded);
    };

    // 신청자 상태 변경
    const handleStatusChange = (postingId: number, applicantId: number, newStatus: 'pending' | 'approved' | 'rejected') => {
        // TODO: API 호출로 상태 변경
        console.log(`Posting ${postingId}, Applicant ${applicantId} status changed to ${newStatus}`);
    };

    // 상태별 한글 표시
    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return '대기중';
            case 'approved': return '승인됨';
            case 'rejected': return '거절됨';
            default: return status;
        }
    };

    // 상태별 색상
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* 헤더 */}
            <div className="bg-white px-4 py-6">
                <h1 className="text-center text-xl font-bold text-gray-900 mb-4">
                    내 모집글 신청 현황
                </h1>
                
                {/* 상태 필터 */}
                <div className="flex justify-center">
                    <div className="relative">
                        <select 
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="전체">전체 상태</option>
                            <option value="pending">대기중</option>
                            <option value="approved">승인됨</option>
                            <option value="rejected">거절됨</option>
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
                {getFilteredPostings().map((posting) => (
                    <div key={posting.postingId} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                        {/* 모집글 기본 정보 */}
                        <div 
                            className="p-4 cursor-pointer hover:bg-gray-50"
                            onClick={() => posting.postingId && navigate(`/posting/${posting.postingId}`)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-900 pr-2">
                                    {posting.title}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500">
                                    <span className="mr-2">신청자 {posting.applicantCount}명</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            posting.postingId && togglePostingExpansion(posting.postingId);
                                        }}
                                        className="p-1 hover:bg-gray-200 rounded"
                                    >
                                        <svg 
                                            className={`w-4 h-4 transition-transform ${
                                                posting.postingId && expandedPostings.has(posting.postingId) ? 'rotate-180' : ''
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
                                <span>{posting.sidoSigungu}</span>
                                <span className="mx-2">•</span>
                                <span>{posting.appointmentDatetime}</span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-2">
                                {posting.tags?.map((tag, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="text-sm text-gray-600 mb-3">
                                <span className="font-medium text-blue-600">{posting.payAmount}</span>
                                <span className="mx-2">•</span>
                                <span>{posting.workingHours}</span>
                            </div>

                            {/* 모집글 관리 버튼들 */}
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                {/* 모집취소 버튼 */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log(`모집글 ${posting.postingId} 취소`);
                                        // TODO: 모집취소 API 호출
                                    }}
                                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                >
                                    모집취소
                                </button>

                                {/* 확정 버튼 (모집인원과 확정인원이 같을 때) */}
                                {(() => {
                                    const approvedCount = posting.applicants.filter(applicant => applicant.status === 'approved').length;
                                    const targetCount = posting.targetPersonnel || 0;
                                    
                                    return approvedCount === targetCount && targetCount > 0 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log(`모집글 ${posting.postingId} 확정 완료`);
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
                                        확정 {posting.applicants.filter(applicant => applicant.status === 'approved').length}명 / 
                                        목표 {posting.targetPersonnel || 0}명
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 신청자 리스트 (확장 시 표시) */}
                        {posting.postingId && expandedPostings.has(posting.postingId) && (
                            <div className="border-t bg-gray-50">
                                {posting.applicants.length > 0 ? (
                                    posting.applicants.map((applicant) => (
                                        <div 
                                            key={applicant.applicantId} 
                                            className="p-4 border-b last:border-b-0 bg-white mx-2 my-2 rounded-lg cursor-pointer hover:bg-gray-50"
                                            onClick={() => navigate(`/applying/${applicant.applicantId}`)}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center mb-2">
                                                        <span className="font-medium text-gray-900 mr-2">
                                                            {applicant.nickname}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                                                            {getStatusText(applicant.status)}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 mb-2">
                                                        <span>{applicant.age}세 • {applicant.gender}</span>
                                                        <span className="mx-2">•</span>
                                                        <span>{applicant.appliedDatetime}</span>
                                                    </div>
                                                    {applicant.introduction && (
                                                        <p className="text-sm text-gray-700 mb-3">
                                                            {applicant.introduction}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                {/* 상태별 버튼 */}
                                                <div className="flex gap-2 mt-2">
                                                    {applicant.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleStatusChange(posting.postingId!, applicant.applicantId, 'approved');
                                                                }}
                                                                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                                                            >
                                                                확정
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleStatusChange(posting.postingId!, applicant.applicantId, 'rejected');
                                                                }}
                                                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                                            >
                                                                거절
                                                            </button>
                                                        </>
                                                    )}
                                                    {applicant.status === 'approved' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusChange(posting.postingId!, applicant.applicantId, 'pending');
                                                            }}
                                                            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                                                        >
                                                            취소
                                                        </button>
                                                    )}
                                                    {applicant.status === 'rejected' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusChange(posting.postingId!, applicant.applicantId, 'pending');
                                                            }}
                                                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                                        >
                                                            거절취소
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-gray-500">
                                        아직 신청자가 없습니다.
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
                        작성한 모집글이 없습니다
                    </h3>
                    <p className="text-gray-500 text-center mb-6">
                        새로운 모집글을 작성해보세요
                    </p>
                    <button
                        onClick={() => navigate('/posting/create')}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        모집글 작성하기
                    </button>
                </div>
            )}

            {/* 하단 여백 */}
            <div className="h-20"></div>
        </div>
    );
};

export default PostingListByHost; 