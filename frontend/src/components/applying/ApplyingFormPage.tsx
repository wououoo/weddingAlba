import { useState } from "react";
import "./styles/ApplyingFormPageStyle.css";

const ApplyingFormPage: React.FC = () => {
    const [prContent, setPrContent] = useState<string>('');
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const handlePrContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrContent(e.target.value);
    };

    const handleSubmit = () => {
        // 신청 등록 혹은 수정 함수 작성
        if (isEditMode) {
            // 수정 함수 (예: 신청 ID와 prContent를 포함하여 API 호출)
            console.log("신청 수정: ", prContent);
        } else {
            // 등록 함수 (예: postingId, userId, prContent를 포함하여 API 호출)
            console.log("신청 등록: ", prContent);
        }
        // 성공 후 페이지 이동 또는 상태 업데이트
    };

    const handleCancel = () => {
        // 취소 로직 (이전 페이지로 이동 등)
        console.log("신청 취소");
        setIsEditMode(false); // 또는 navigate(-1) 등으로 뒤로가기
    };

    return (
        <div className="applying-write-container">
            <div className="applying-top">
                <div className="button-group">
                    <button type="button" className="form-button" onClick={handleSubmit}>
                        {isEditMode ? '신청 수정하기' : '신청하기'}
                    </button>
                    <button type="button" className="form-button cancel-button" onClick={handleCancel}>
                        취소
                    </button>
                </div>
            </div>
            <div className="applying-content">
                <div className="form-card">
                    <div className="form-section">
                        <div className="form-label-container">
                            <label htmlFor="pr-content" className="form-label">
                                자기소개 (PR 내용)
                            </label>
                        </div>
                        <div className="form-input-container">
                            <textarea
                                id="pr-content"
                                placeholder="신청 동기, 본인의 강점 등을 자세히 입력해주세요..."
                                className="form-textarea"
                                value={prContent}
                                onChange={handlePrContentChange}
                                rows={10}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplyingFormPage; 