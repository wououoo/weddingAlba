import { ApplyingResponseDTO } from "../dto/ApplyingResponseDTO";
import { useNavigate } from "react-router-dom";


const ApplyingCard: React.FC<ApplyingResponseDTO> = ({
    applyId,
    status,
    applyDatetime,
    prContent,
}) => {
    const navigate = useNavigate();

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
        <li className="applying-card-li w-100 p-3 bg-white rounded-lg mb-5">
            <div onClick={() => navigate(`/applying/${applyId}`)}> {/* 신청한 모집글 상세 페이지로 이동 */}
                <div className="applying-component-header flex justify-between px-2 mb-3">
                    <div className="component-header-left">
                        <span className="title">신청 ID: {applyId}</span>
                    </div>
                    <div className="component-header-right">
                        <div className="status">
                            <span>상태: {getStatusText(status)}</span>
                        </div>
                    </div>
                </div>
                <div className="applying-component-body px-2 mb-3">
                    <div className="content-wrap">
                        <div className="content-detail-wrap flex">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                                 className="size-4 fill-stone-400">
                                <path
                                    d="M5.75 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM5 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM10.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM7.25 8.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM8 9.5A.75.75 0 1 0 8 11a.75.75 0 0 0 0-1.5Z"/>
                                <path fill-rule="evenodd"
                                      d="M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1ZM3.5 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V7Z"
                                      clip-rule="evenodd"/>
                            </svg>
                            <span className="content-text">신청 일시: {applyDatetime}</span>
                        </div>
                        <div className="content-detail-wrap flex">
                            <p className="content-text">PR 내용: {prContent}</p>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}

export default ApplyingCard; 