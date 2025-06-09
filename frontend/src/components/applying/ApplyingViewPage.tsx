import { sampleApplyingData } from "./dto/ApplyingResponseDTO";
import "./styles/ApplyingViewPageStyle.css";
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

    return (
        <div className="applying-view-container bg-white">
            <div className="applying-view-top p-5">
                <div className="view-title flex justify-between mb-4">
                    <h1 className="text-xl font-bold">신청 ID: {applyId}</h1>
                    <div className="status">
                        <span>상태: {getStatusText(status)}</span>
                    </div>
                </div>

                <div className="applying-user-info mb-3">
                    <p className="applying-user-id flex mb-0.5">
                        <span>신청자 ID: {userId}</span>
                    </p>
                    <p className="applying-posting-id flex mb-0.5">
                        <span onClick={() => navigate(`/posting/${postingId}`)} className="cursor-pointer text-blue-600 hover:underline">모집글 ID: {postingId}</span>
                    </p>
                </div>
            </div>
            <hr className="divide"/>
            <div className="applying-view-content p-5">
                <div className="content-info-title">
                    <h1 className="text-lg font-bold mb-3">신청 정보</h1>
                </div>
                <div className="content-info">
                    <div className="info-detail">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                             className="size-4 fill-stone-400">
                            <path
                                d="M5.75 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM5 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM10.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM7.25 8.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM8 9.5A.75.75 0 1 0 8 11a.75.75 0 0 0 0-1.5Z"/>
                            <path fill-rule="evenodd"
                                  d="M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1ZM3.5 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V7Z"
                                  clip-rule="evenodd"/>
                        </svg>
                        <span className="detail-title">신청 일시</span><span className="detail-description">{applyDatetime}</span>
                    </div>
                    <div className="info-detail">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                             className="size-4 fill-stone-400">
                            <path fill-rule="evenodd"
                                  d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z"
                                  clip-rule="evenodd"/>
                        </svg>
                        <span className="detail-title">확정 일시</span>
                        <span className="detail-description">
                            {confirmationDatetime ? confirmationDatetime : "미정"}
                        </span>
                    </div>
                    <div className="info-detail pr-content-detail">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                             className="size-4 fill-stone-400">
                            <path d="M6 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"/>
                            <path fill-rule="evenodd"
                                  d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm3.5 2.5a3 3 0 1 0 1.524 5.585l1.196 1.195a.75.75 0 1 0 1.06-1.06l-1.195-1.196A3 3 0 0 0 7.5 4.5Z"
                                  clip-rule="evenodd"/>
                        </svg>
                        <span className="detail-title">PR 내용</span>
                        <span className="detail-description pr-content-text">{prContent}</span>
                    </div>
                </div>
            </div>
            <button className="fixed bottom-[55px] left-0 w-full bg-[#f0bfbd] text-white text-lg font-semibold py-4 shadow-md z-50">
                신청 수정하기
            </button>
        </div>
    );
}

export default ApplyingViewPage; 