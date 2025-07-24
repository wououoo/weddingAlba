import React from "react";
import { convertDatetime, convertTime } from "../common/base";
import { usePostingView } from "./hooks/usePostingView";
import Toast from "../profile/toast/Toast";

const PostingViewPage: React.FC = () => {
    const {
        postingData,
        isBookmarked,
        isBookmarkLoading,
        showFullDescription,
        isLoading,
        isAuthor,
        hasApplied,
        toastState,
        hideToast,
        toggleBookmark,
        toggleDescription,
        goBack,
        goToUserProfile,
        goToApplyPage,
        goToApplyingDetail,
        goToEditPage,
        cancelPosting,
    } = usePostingView();

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    }

    if (!postingData) {
        return <div className="flex justify-center items-center h-screen">게시물을 찾을 수 없습니다.</div>;
    }

    const {
        postingId,
        title,
        address,
        buildingName,
        sidoSigungu,
        appointmentDatetime,
        startTime,
        endTime,
        workingHours,
        payAmount,
        nickname,
        hasMobileInvitation,
        guestMainRole,
        detailContent,
        tags,
        userId,
        payTypeStr,
        targetPersonnel
    } = postingData;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* 헤더 */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between p-4">
                    <button 
                        onClick={goBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center">하객알바 모집</h1>
                    <div className="w-10 h-10 flex items-center justify-center">
                        {!isAuthor && (
                            <button 
                                onClick={toggleBookmark}
                                disabled={isBookmarkLoading}
                                className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                                    isBookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
                                    isBookmarked ? 'text-red-500' : 'text-gray-400'
                                }`} fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="px-4 py-6">
                {/* 제목 및 위치 */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                    <div className="flex items-center text-gray-600 mb-4">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{sidoSigungu}</span>
                    </div>
                </div>

                {/* 모집자 정보 */}
                {/* 해당 모집자 프로필로 이동하게 */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-4" onClick={() => userId && goToUserProfile(userId)}>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">모집자 정보</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">
                                    {nickname?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{nickname}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                    {hasMobileInvitation ? (
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-xs text-green-600 font-medium">모바일 청첩장 인증</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-xs text-gray-500 font-medium">모바일 청첩장 미인증</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 알바 정보 */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">알바정보</h3>
                    
                    <div className="space-y-4">
                        {/* 날짜 */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">날짜</h4>
                                <p className="text-gray-600 text-sm">{convertDatetime(appointmentDatetime || '')}</p>
                            </div>
                        </div>

                        {/* 시간 */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">시간</h4>
                                <p className="text-gray-600 text-sm">{convertTime(startTime || '')} 부터 {convertTime(endTime || '')}, {Math.floor(Number(workingHours))}시간</p>
                            </div>
                        </div>

                        {/* 급여 */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">임금</h4>
                                <p className="text-green-600 font-semibold">{payTypeStr} {Number(payAmount).toLocaleString()}원</p>
                            </div>
                        </div>

                        {/* 업무 */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">업무</h4>
                                <p className="text-gray-600 text-sm">{guestMainRole}</p>
                            </div>
                        </div>

                        {/* 모집인원 */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">모집인원</h4>
                                <p className="text-gray-600 text-sm">{targetPersonnel}명</p>
                            </div>
                        </div>

                        {/* 위치 */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">위치</h4>
                                <p className="text-gray-600 text-sm">{address} {buildingName}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 상세내용 */}
                {detailContent && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">상세내용</h3>
                        <div className="relative">
                            <p className={`text-gray-600 text-sm leading-relaxed ${!showFullDescription && detailContent.length > 100 ? 'line-clamp-3' : ''}`}>
                                {detailContent}
                            </p>
                            {detailContent.length > 100 && (
                                <button 
                                    onClick={toggleDescription}
                                    className="mt-2 text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
                                >
                                    {showFullDescription ? '접기' : '더보기'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 태그 */}
                {tags && tags.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">태그</h3>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <span 
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* 지도 영역 */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-20">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">위치</h3>
                    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-medium">지도</p>
                            <p className="text-xs mt-1">{address} {buildingName}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단 고정 버튼 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
                <div className="flex space-x-3">
                    {isAuthor ? (
                        // 작성자인 경우: 모집취소하기, 수정하기
                        <>
                            <button
                                onClick={cancelPosting}
                                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-all"
                            >
                                모집 취소
                            </button>
                            <button
                                onClick={goToEditPage}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                            >
                                수정하기
                            </button>
                        </>
                    ) : (
                        // 일반 사용자인 경우: 북마크, 신청하기/신청글 확인하기
                        <>
                            <button
                                onClick={toggleBookmark}
                                disabled={isBookmarkLoading}
                                className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center space-x-2 
                                    ${isBookmarkLoading 
                                        ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
                                        : isBookmarked
                                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
                                `}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{isBookmarkLoading ? '처리중...' : '찜하기'}</span>
                            </button>
                            {hasApplied ? (
                                <button
                                    onClick={goToApplyingDetail}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                                >
                                    신청글 확인하기
                                </button>
                            ) : (
                                <button
                                    onClick={goToApplyPage}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                                >
                                    신청하기
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

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

export default PostingViewPage; 