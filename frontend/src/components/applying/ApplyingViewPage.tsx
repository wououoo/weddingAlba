import { sampleApplyingData } from "./dto/ApplyingResponseDTO";
import { useNavigate } from "react-router-dom";

const ApplyingViewPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        applyId,
        userId,
        postingId,
        status,
        applyDatetime,
        prContent,
        confirmationDatetime
    } = sampleApplyingData;

    // 임시 모집글 정보 (실제로는 API에서 가져와야 함)
    const postingInfo = {
        title: "친구 결혼식 도우미 모집",
        simplyLocation: "서울 강남",
        appointmentDatetime: "2025년 06월 20일 15시",
        wages: "50,000원",
        tags: ["친구대행", "당일지급", "식비지급"],
        guestMainRole: "고등학교 동창"
    };

    const getStatusText = (statusCode: number) => {
        switch (statusCode) {
            case 0:
                return "대기";
            case 1:
                return "승인";
            case -1:
                return "거절";
            default:
                return "알 수 없음";
        }
    };

    const getStatusColor = (statusCode: number) => {
        switch (statusCode) {
            case 0:
                return "text-yellow-600 bg-yellow-100";
            case 1:
                return "text-green-600 bg-green-100";
            case -1:
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
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
                    <h1 className="text-lg font-semibold text-gray-900">신청 상세</h1>
                    <div className="w-10 h-10"></div> {/* 헤더 균형을 위한 빈 공간 */}
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="px-4 py-6">
                {/* 신청 ID 및 상태 */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">신청 #{applyId}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                            {getStatusText(status)}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span>신청자 ID: {userId}</span>
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                            </svg>
                            <span 
                                onClick={() => navigate(`/posting/${postingId}`)} 
                                className="cursor-pointer text-blue-600 hover:underline transition-colors"
                            >
                                모집글 #{postingId} 보러가기
                            </span>
                        </div>
                    </div>
                </div>

                {/* 신청한 모집글 정보 */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">신청한 모집글</h3>
                        <button
                            onClick={() => navigate(`/posting/${postingId}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                            상세보기 →
                        </button>
                    </div>
                    
                    <div 
                        className="cursor-pointer hover:bg-gray-50 rounded-lg p-4 border border-gray-200 transition-colors"
                        onClick={() => navigate(`/posting/${postingId}`)}
                    >
                        <h4 className="font-bold text-lg text-gray-900 mb-2">{postingInfo.title}</h4>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span>{postingInfo.simplyLocation}</span>
                            <span className="mx-2">•</span>
                            <span>{postingInfo.appointmentDatetime}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                            {postingInfo.tags.map((tag, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium text-blue-600">{postingInfo.wages}</span>
                                <span className="mx-2">•</span>
                                <span>{postingInfo.guestMainRole}</span>
                            </div>
                            <div className="text-xs text-gray-400">
                                클릭하여 모집글 보기
                            </div>
                        </div>
                    </div>
                </div>

                {/* 신청 정보 */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">신청 정보</h3>
                    
                    <div className="space-y-4">
                        {/* 신청 일시 */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">신청 일시</h4>
                                <p className="text-gray-600 text-sm">{applyDatetime}</p>
                            </div>
                        </div>

                        {/* 확정 일시 */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">확정 일시</h4>
                                <p className="text-gray-600 text-sm">
                                    {confirmationDatetime ? confirmationDatetime : "미정"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PR 내용 */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-20">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">PR 내용</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <div className="flex-1">
                                <p className="text-gray-700 text-sm leading-relaxed">{prContent}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단 고정 버튼 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
                <button className="w-full bg-gradient-to-r from-pink-400 to-red-400 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all">
                    신청 수정하기
                </button>
            </div>
        </div>
    );
}

export default ApplyingViewPage; 