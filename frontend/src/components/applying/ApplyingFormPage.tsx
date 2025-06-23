import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApplyingForm } from "./hooks/useApplyingForm";
import { getUserIdFromToken, isAuthenticated } from "../../OAuth2/authUtils";

const ApplyingFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { postingId: postingIdParam } = useParams<{ postingId: string }>();
    
    // URL에서 postingId 파라미터 가져오기
    const postingId = postingIdParam ? parseInt(postingIdParam, 10) : undefined;
    
    // 토큰에서 사용자 ID 가져오기
    const userId = getUserIdFromToken();
    const isEditMode = false; // 임시값
    
    const {
        isLoading,
        error,
        prContent,
        handlePrContentChange,
        handleSubmit,
        handleCancel
    } = useApplyingForm({
        isEditMode,
        postingId,
        userId: userId || undefined,
        initialPrContent: ''
    });

    // 로그인하지 않은 사용자 처리
    if (!isAuthenticated() || !userId) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">로그인이 필요합니다</h2>
                    <p className="text-gray-600 mb-4">신청하기 위해서는 먼저 로그인해주세요.</p>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            이전 페이지로
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            로그인하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // postingId가 없거나 유효하지 않은 경우 처리
    if (!postingId || isNaN(postingId)) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">잘못된 접근입니다</h2>
                    <p className="text-gray-600 mb-4">유효하지 않은 공고입니다.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        이전 페이지로
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* 헤더 */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center">
                        {isEditMode ? '신청서 수정' : '하객알바 신청'}
                    </h1>
                </div>
            </div>

            <div className="px-4 py-6 space-y-4">
                {/* 신청서 정보 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">신청서 작성</h2>

                    {/* 자기소개 (PR 내용) */}
                    <div className="mb-4">
                        <label htmlFor="pr-content" className="block text-sm font-medium text-gray-700 mb-2">
                            자기소개 (PR 내용) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <textarea
                                id="pr-content"
                                placeholder="신청 동기, 본인의 강점, 관련 경험 등을 자세히 입력해주세요...&#10;&#10;예시:&#10;- 결혼식 참석 경험이 많아 예의와 매너를 잘 알고 있습니다&#10;- 밝고 적극적인 성격으로 분위기를 좋게 만들 수 있습니다&#10;- 사진 촬영에 자연스럽고 예쁘게 나올 수 있습니다"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                value={prContent}
                                onChange={handlePrContentChange}
                                rows={12}
                                disabled={isLoading}
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                {prContent.length}/1000자
                            </div>
                        </div>
                        
                        {/* 글자 수 안내 */}
                        <div className="mt-2 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                최소 50자 이상 작성해주세요
                            </div>
                            <div className={`text-sm ${prContent.length >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                                {prContent.length >= 50 ? '✓ 조건 충족' : `${50 - prContent.length}자 더 입력해주세요`}
                            </div>
                        </div>

                        {/* 에러 메시지 표시 */}
                        {error && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* 작성 팁 */}
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-medium text-blue-800 mb-1">작성 팁</h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• 본인의 성격과 장점을 구체적으로 어필해주세요</li>
                                        <li>• 결혼식이나 공식 행사 참석 경험이 있다면 언급해주세요</li>
                                        <li>• 왜 이 알바에 지원하게 되었는지 동기를 적어주세요</li>
                                        <li>• 성실하고 책임감 있는 모습을 보여주세요</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 신청 안내사항 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">신청 안내사항</h2>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>신청서 제출 후 모집자가 검토하여 개별 연락드립니다.</span>
                        </div>
                        <div className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>신청서는 제출 후 24시간 내에 수정 가능합니다.</span>
                        </div>
                        <div className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>허위 정보 기재 시 신청이 취소될 수 있습니다.</span>
                        </div>
                        <div className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>선정 결과는 마이페이지에서 확인할 수 있습니다.</span>
                        </div>
                    </div>
                </div>

                {/* 하단 여백 */}
                <div className="h-20"></div>
            </div>

            {/* 하단 고정 버튼 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
                <div className="flex space-x-3">
                    <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                            isLoading 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!prContent.trim() || prContent.length < 50 || isLoading}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                            !prContent.trim() || prContent.length < 50 || isLoading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                처리중...
                            </div>
                        ) : (
                            isEditMode ? '수정하기' : '신청하기'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ApplyingFormPage; 