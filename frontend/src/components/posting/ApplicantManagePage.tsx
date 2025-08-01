import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { convertDatetime } from "../common/base";
import { applyingApi } from "../applying/api/applyingApi";
import { postingApi } from "./api/postingApi";
import { Toast, useToast } from "../common/toast";
import { ApplyResponseDTO } from "../applying/dto/ApplyResponseDTO";
import { PostingResponseDTO } from "./dto/PostingResponseDTO";

const ApplicantManagePage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { toastState, showToast, hideToast } = useToast();
    
    // 상태 관리
    const [postingData, setPostingData] = useState<PostingResponseDTO | null>(null);
    const [applicants, setApplicants] = useState<ApplyResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [applicantsLoading, setApplicantsLoading] = useState(false);
    const [postingStatus, setPostingStatus] = useState<number>(0);
    const [isHistory, setIsHistory] = useState<boolean>(false);

    // 데이터 로드
    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        if (!id) return;
        
        setLoading(true);
        let isHistoryData = false;
        
        try {
            // 먼저 일반 모집글 정보 가져오기 시도
            let postingResponse = await postingApi.getPostingDetail(id);
            
            // 일반 모집글 조회 실패시 모집이력에서 조회
            if (!postingResponse.success || !postingResponse.data) {
                console.log('일반 모집글 조회 실패, 모집이력에서 조회 시도...');
                postingResponse = await postingApi.getPostingHistoryDetail(id);
                
                // 모집이력에서 성공적으로 조회된 경우
                if (postingResponse.success && postingResponse.data) {
                    isHistoryData = true;
                    setIsHistory(true);
                }
            }
            
            if (postingResponse.success && postingResponse.data) {
                const currentStatus = postingResponse.data.status || 0;
                setPostingData(postingResponse.data);
                setPostingStatus(currentStatus);
                
                // 신청자 목록 가져오기 - 상태값들을 직접 전달
                await loadApplicants(Number(id), isHistoryData, currentStatus);
            } else {
                showToast('모집글을 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            showToast('데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const loadApplicants = async (postingId: number, isHistoryData: boolean = false, currentStatus: number = 0) => {
        setApplicantsLoading(true);
        try {
            // 데이터 타입 결정 로직:
            // 1. 모집이력에서 온 경우 (isHistoryData) -> "HISTORY"
            // 2. 모집이 확정되거나 취소된 경우 (status === 1 또는 -1) -> "HISTORY"  
            // 3. 그 외 (모집중, status === 0) -> "ACTIVE"
            const dataType = (isHistoryData || currentStatus === 1 || currentStatus === -1) ? "HISTORY" : "ACTIVE";
            
            console.log('🔍 신청자 목록 조회 시작:', { 
                postingId, 
                dataType, 
                currentStatus, 
                isHistoryData,
                postingStatus,
                isHistory,
                '판정기준': {
                    'isHistoryData': isHistoryData,
                    'currentStatus === 1': currentStatus === 1,
                    'currentStatus === -1': currentStatus === -1,
                    '최종결과': (isHistoryData || currentStatus === 1 || currentStatus === -1)
                }
            });
            
            const response = await applyingApi.getApplyingListByPostingId(postingId, dataType);
            
            console.log('📡 API 응답:', {
                success: response.success,
                dataLength: response.data?.length || 0,
                data: response.data,
                message: response.message
            });
            
            if (response.success && response.data) {
                setApplicants(response.data || []);
                console.log('✅ 신청자 설정 완료:', response.data.length + '명');
            } else {
                console.log('❌ 응답 실패 또는 데이터 없음:', response);
                setApplicants([]);
                if (response.message) {
                    showToast(response.message);
                }
            }
        } catch (error) {
            console.error('🚨 신청자 목록 조회 실패:', error);
            showToast('신청자 목록을 불러오는데 실패했습니다.');
            setApplicants([]);
        } finally {
            setApplicantsLoading(false);
        }
    };

    // 신청자 상태 변경
    const handleStatusChange = (applicantId: number, newStatus: 'pending' | 'approved' | 'rejected') => {
        const statusText = newStatus === 'approved' ? '승인' : newStatus === 'rejected' ? '거절' : '대기';
        const warningMessage = newStatus !== 'pending' 
            ? `정말로 이 신청을 ${statusText}으로 변경하시겠습니까?\n\n⚠️ 한 번 승인/거절하면 다시 변경할 수 없습니다.`
            : `정말로 이 신청을 ${statusText}으로 변경하시겠습니까?`;
            
        showToast(
            warningMessage,
            '확인',
            () => executeStatusChange(applicantId, newStatus)
        );
    };

    const executeStatusChange = async (applicantId: number, newStatus: 'pending' | 'approved' | 'rejected') => {
        let status = 0;
        if(newStatus === 'pending') status = 0;
        if(newStatus === 'approved') status = 1;
        if(newStatus === 'rejected') status = -1;

        try {
            const response = await applyingApi.changeApplyingStatus(applicantId, status);
            if (response.success) {
                // 신청자 목록에서 해당 신청자만 업데이트
                setApplicants(prev => prev.map(applicant => 
                    applicant.applyingId === applicantId 
                        ? { ...applicant, status: status }
                        : applicant
                ));

                showToast(`신청이 ${newStatus === 'approved' ? '승인' : newStatus === 'rejected' ? '거절' : '대기'}로 변경되었습니다.`);
            } else {
                showToast('상태 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('상태 변경 실패:', error);
            showToast('상태 변경 중 오류가 발생했습니다.');
        }
    };

    // 모집 확정
    const handleConfirmPosting = () => {
        const approvedCount = applicants.filter(applicant => applicant.status === 1).length;
        if (approvedCount === 0) {
            showToast('승인된 신청자가 없습니다.');
            return;
        }

        showToast(
            `정말로 이 모집글을 확정하시겠습니까?\n\n✅ 승인된 신청자: ${approvedCount}명\n⚠️ 확정 후에는 취소할 수 없습니다.`,
            '확인',
            executeConfirmPosting
        );
    };

    const executeConfirmPosting = async () => {
        if (!id) return;

        try {
            const response = await postingApi.confirmationPosting(Number(id));
            if (response.success) {
                setPostingStatus(1);
                showToast('🎉 모집이 확정되었습니다!');
                
                // 모집 확정 후 신청자 목록을 ApplyHistory에서 다시 로드
                await loadApplicants(Number(id), isHistory, 1);
            } else {
                showToast(response.message || '모집글 확정에 실패했습니다.');
            }
        } catch (error) {
            console.error('모집글 확정 실패:', error);
            showToast('모집글 확정 중 오류가 발생했습니다.');
        }
    };

    // 모집 취소
    const handleCancelPosting = () => {
        showToast(
            '정말로 이 모집글을 취소하시겠습니까?',
            '확인',
            executeCancelPosting
        );
    };

    const executeCancelPosting = async () => {
        if (!id) return;

        try {
            const response = await postingApi.cancelPosting(Number(id));
            if (response.success) {
                setPostingStatus(-1);
                showToast('모집글이 성공적으로 취소되었습니다.');
                
                // 모집 취소 후 신청자 목록을 ApplyHistory에서 다시 로드
                await loadApplicants(Number(id), isHistory, -1);
                
                // 잠시 후 이전 페이지로 이동
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            } else {
                showToast(response.message || '모집글 취소에 실패했습니다.');
            }
        } catch (error) {
            console.error('모집글 취소 실패:', error);
            showToast('모집글 취소 중 오류가 발생했습니다.');
        }
    };

    // 유틸리티 함수들
    const getStatusText = (status: number) => {
        switch (status) {
            case 0: return '대기중';
            case 1: return '승인됨';
            case -1: return '거절됨';
            default: return '알 수 없음';
        }
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case 0: return 'bg-yellow-100 text-yellow-800';
            case 1: return 'bg-green-100 text-green-800';
            case -1: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const goBack = () => {
        navigate(-1);
        // navigate(`/posting/list/${id}`);
    };

    const goToPostingDetail = () => {
        if (id) {
            if (isHistory) {
                navigate(`/posting/history/${id}`);
            } else {
                navigate(`/posting/${id}`);
            }
        }
    };

    // 개별 채팅 시작
    const handlePrivateChat = (userId: number) => {
        // TODO: 실제 채팅 API 연동시 구현
        console.log('개별 채팅 시작:', userId);
        showToast(`사용자 ${userId}와의 채팅을 시작합니다. (준비중)`);
        // navigate(`/chat/private/${userId}`);
    };

    // 그룹톡 생성
    const handleCreateGroupChat = () => {
        const approvedApplicants = applicants.filter(applicant => applicant.status === 1);
        if (approvedApplicants.length < 2) {
            showToast('그룹톡을 생성하려면 승인된 신청자가 2명 이상이어야 합니다.');
            return;
        }

        // TODO: 실제 채팅 API 연동시 구현
        console.log('그룹톡 생성:', {
            postingId: id,
            approvedApplicants: approvedApplicants.map(a => ({
                userId: a.userId,
                nickname: a.nickname
            }))
        });
        showToast(`승인된 ${approvedApplicants.length}명과 그룹톡을 생성합니다. (준비중)`);
        // navigate(`/chat/group/create/${id}`);
    };

    // 로딩 상태
    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!postingData) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">모집글을 찾을 수 없습니다</h3>
                    <button
                        onClick={goBack}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    const approvedCount = applicants.filter(applicant => applicant.status === 1).length;
    const totalCount = applicants.length;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* 헤더 */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between p-4">
                    <button 
                        onClick={goBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">신청자 관리</h1>
                    <button
                        onClick={goToPostingDetail}
                        className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        상세보기
                    </button>
                </div>
            </div>

            <div className="px-4 py-6">
                {/* 모집글 정보 */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 flex-1 pr-3">{postingData.title}</h2>
                        {postingStatus === 1 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                ✅ 모집확정
                            </span>
                        ) : postingStatus === -1 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                                ❌ 모집취소
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                📝 모집중
                            </span>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                            <span className="font-medium">📍 지역:</span> {postingData.sidoSigungu}
                        </div>
                        <div>
                            <span className="font-medium">📅 날짜:</span> {convertDatetime(postingData.appointmentDatetime || '')}
                        </div>
                        <div>
                            <span className="font-medium">💰 급여:</span> {postingData.payTypeText} {Number(postingData.payAmount).toLocaleString()}원
                        </div>
                        <div>
                            <span className="font-medium">👥 목표인원:</span> {postingData.targetPersonnel}명
                        </div>
                    </div>
                </div>

                {/* 신청자 현황 */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">신청자 현황</h3>
                        <div className="text-sm text-gray-600">
                            승인 {approvedCount}명 / 총 {totalCount}명
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-yellow-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">
                                {applicants.filter(a => a.status === 0).length}
                            </div>
                            <div className="text-sm text-yellow-600">대기중</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {approvedCount}
                            </div>
                            <div className="text-sm text-green-600">승인됨</div>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                                {applicants.filter(a => a.status === -1).length}
                            </div>
                            <div className="text-sm text-red-600">거절됨</div>
                        </div>
                    </div>
                </div>

                {/* 신청자 목록 */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">신청자 목록</h3>
                    
                    {applicantsLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                            <span className="text-gray-600">신청자 정보를 불러오는 중...</span>
                        </div>
                    ) : applicants.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            아직 신청자가 없습니다.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applicants.map((applicant) => (
                                <div 
                                    key={applicant.applyingId} 
                                    className="bg-gray-50 rounded-lg p-4 border hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-900 mb-1">
                                                {applicant.nickname || '알 수 없음'}
                                            </h5>
                                            <p className="text-sm text-gray-500">
                                                신청일: {convertDatetime(applicant.applyDatetime)}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(applicant.status)}`}>
                                            {getStatusText(applicant.status)}
                                        </span>
                                    </div>
                                    
                                    {/* 하단 액션 버튼들 */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            {postingStatus === 0 && !isHistory && (
                                                <select
                                                    value={applicant.status === 0 ? 'pending' : applicant.status === 1 ? 'approved' : 'rejected'}
                                                    onChange={(e) => {
                                                        handleStatusChange(
                                                            applicant.applyingId || 0, 
                                                            e.target.value as 'pending' | 'approved' | 'rejected'
                                                        );
                                                    }}
                                                    className={`text-sm border border-gray-300 rounded px-3 py-1 ${applicant.status !== 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                    disabled={applicant.status !== 0}
                                                    title={applicant.status !== 0 ? '이미 결정된 신청은 변경할 수 없습니다' : ''}
                                                >
                                                    <option value="pending">대기중</option>
                                                    <option value="approved">승인</option>
                                                    <option value="rejected">거절</option>
                                                </select>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/applying/${applicant.applyingId}`)}
                                                className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                                            >
                                                상세보기
                                            </button>
                                            <button
                                                onClick={() => handlePrivateChat(applicant.userId)}
                                                className="text-sm text-green-600 hover:text-green-800 px-3 py-1 rounded hover:bg-green-50 transition-colors flex items-center gap-1"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                                </svg>
                                                채팅
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {applicant.prContent && (
                                        <div className="mt-3">
                                            <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                                                {applicant.prContent}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 관리 버튼들 - 모집이력이 아닌 경우에만 표시 */}
                {postingStatus === 0 && !isHistory && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">모집글 관리</h3>
                        <div className="flex gap-3 mb-4">
                            {approvedCount > 0 && (
                                <button
                                    onClick={handleConfirmPosting}
                                    className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                                >
                                    ✅ 모집 확정하기 ({approvedCount}명)
                                </button>
                            )}
                            <button
                                onClick={handleCancelPosting}
                                className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                                ❌ 모집 취소하기
                            </button>
                        </div>
                        
                        {/* 채팅 관련 버튼들 */}
                        {approvedCount >= 2 && (
                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="text-md font-medium text-gray-900 mb-3">채팅 관리</h4>
                                <button
                                    onClick={handleCreateGroupChat}
                                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                    승인된 신청자들과 그룹톡 생성 ({approvedCount}명)
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* 모집 완료/취소된 경우 채팅 버튼들 */}
                {(postingStatus === 1 || isHistory) && approvedCount >= 2 && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">채팅 관리</h3>
                        <button
                            onClick={handleCreateGroupChat}
                            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            확정된 신청자들과 그룹톡 생성 ({approvedCount}명)
                        </button>
                    </div>
                )}

                {/* 모집이력인 경우 안내 메시지 */}
                {isHistory && (
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-blue-900">모집 이력</h3>
                                <p className="text-sm text-blue-700">이 모집글은 완료된 이력입니다. 신청자 정보는 조회만 가능합니다.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 하단 여백 */}
            <div className="h-20"></div>

            {/* Toast 컴포넌트 */}
            <Toast
                isVisible={toastState.isVisible}
                message={toastState.message}
                actionText={toastState.actionText}
                onAction={toastState.onAction}
                onClose={hideToast}
            />
        </div>
    );
};

export default ApplicantManagePage;