import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ApplyingFormPage: React.FC = () => {
    const navigate = useNavigate();
    const [prContent, setPrContent] = useState<string>('');
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const handlePrContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrContent(e.target.value);
    };

    const handleSubmit = () => {
        // 폼 유효성 검사
        if (!prContent.trim()) {
            alert('자기소개 내용을 입력해주세요.');
            return;
        }

        if (prContent.length < 50) {
            alert('자기소개는 최소 50자 이상 입력해주세요.');
            return;
        }

        // 신청 등록 혹은 수정 함수 작성
        if (isEditMode) {
            // 수정 함수 (예: 신청 ID와 prContent를 포함하여 API 호출)
            console.log("신청 수정: ", prContent);
        } else {
            // 등록 함수 (예: postingId, userId, prContent를 포함하여 API 호출)
            console.log("신청 등록: ", prContent);
        }
        
        // 성공 후 페이지 이동
        navigate(-1);
    };

    const handleCancel = () => {
        // 취소 로직 (이전 페이지로 이동 등)
        console.log("신청 취소");
        navigate(-1);
    };

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
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!prContent.trim() || prContent.length < 50}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                            !prContent.trim() || prContent.length < 50
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                        }`}
                    >
                        {isEditMode ? '수정하기' : '신청하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ApplyingFormPage; 