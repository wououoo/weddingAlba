import { useState } from "react";
import "./styles/PostingFormPageStyle.css";

const PostingFormPage: React.FC = () => {
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && tags.length < 5) {
                // Remove '#' if already present and add it back consistently
                const formattedTag = newTag.startsWith('#') ? newTag.substring(1) : newTag;
                if (!tags.includes(formattedTag)) {
                    setTags([...tags, formattedTag]);
                    setInputValue('');
                }
            }
        } else if (e.key === 'Backspace' && inputValue === '') {
            setTags(tags.slice(0, tags.length - 1));
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleSubmit = () => {
        // 등록 혹은 수정 함수 작성
        if (isEditMode) {
            // 수정 함수 
        } else {
            // 등록 함수
        }
    };

    const handleCancel = () => {
        // 취소 로직 (이전 페이지로 이동 등)
        setIsEditMode(false);
    };

    return <div className="posting-write-container">
        <div className="posting-top">
            <div className="button-group">
                <button type="button" className="form-button" onClick={handleSubmit}>
                    {isEditMode ? '수정하기' : '등록하기'}
                </button>
            </div>
        </div>
        <div className="posting-content">
            <div className="form-card">
                <div className="form-section">
                    <div className="form-label-container">
                        <label htmlFor="posting-title" className="form-label">
                            제목
                        </label>
                    </div>
                    <div className="form-input-container">
                        <input
                            type="text"
                            name="posting-title"
                            placeholder="예: 5월 30일 웨딩 하객 모집"
                            className="form-input"
                        />
                    </div>
                </div>
                
                <div className="party-status-section">
                    <div className="form-label-container">
                        <label className="form-label">당사자 여부</label>
                    </div>
                    <div className="radio-group">
                        <label className="radio-container">
                            <input
                                type="radio"
                                name="party-status"
                                value="yes"
                                className="radio-input"
                            />
                            <div className="radio-custom">
                                <div className="radio-dot"></div>
                            </div>
                            <span className="radio-label">당사자입니다</span>
                        </label>
                        <label className="radio-container">
                            <input
                                type="radio"
                                name="party-status"
                                value="no"
                                className="radio-input"
                            />
                            <div className="radio-custom">
                                <div className="radio-dot"></div>
                            </div>
                            <span className="radio-label">대리인입니다</span>
                        </label>
                    </div>
                </div>
                
                <div className="form-section">
                    <div className="form-label-container">
                        <label className="form-label">예식 날짜</label>
                    </div>
                    <div className="form-input-container">
                        <input type="date" className="form-input" />
                    </div>
                </div>
                
                <div className="form-section">
                    <div className="form-label-container">
                        <label className="form-label">근무시간</label>
                    </div>
                    <div className="form-input-container">
                        <input type="time" className="form-input" />
                    </div>
                </div>
                
                <div className="form-section">
                    <div className="form-label-container">
                        <label className="form-label">임금</label>
                    </div>
                    <div className="form-input-container">
                        <input type="text" placeholder="예: 100,000원" className="form-input" />
                    </div>
                </div>
                
                <div className="form-section">
                    <div className="form-label-container">
                        <label className="form-label">위치</label>
                    </div>
                    <div className="form-input-container">
                        {/* 주소 검색 기능 추가 */}
                        <input type="text" placeholder="예: 서울시 강남구" className="form-input" />
                    </div>
                </div>
                
                <div className="form-section">
                    <div className="form-label-container">
                        <label className="form-label">업무내용</label>
                    </div>
                    <div className="form-input-container">
                        <input type="text" placeholder="예: 웨딩 촬영 보조" className="form-input" />
                    </div>
                </div>
                
                <div className="form-section">
                    <div className="form-label-container">
                        <label className="form-label">상세 내용</label>
                    </div>
                    <div className="form-input-container">
                        <textarea placeholder="자세한 업무 내용을 입력해주세요..." className="form-textarea" />
                    </div>
                </div>
                
                <div className="form-section">
                    <div className="form-label-container">
                        <label className="form-label">모바일 청첩장</label>
                    </div>
                    <div className="form-input-container">
                        <label className="radio-container">
                            <input
                                type="radio"
                                name="invitation-status"
                                value="yes"
                                className="radio-input"
                            />
                            <div className="radio-custom">
                                <div className="radio-dot"></div>
                            </div>
                            <span className="radio-label">있음</span>
                        </label>
                        <div className={`file-upload-container ${uploadedFile ? 'file-uploaded' : ''}`}>
                            <input 
                                type="file" 
                                className="file-upload-input"
                                onChange={handleFileUpload}
                                accept="image/*"
                            />
                            <div className="file-upload-icon"></div>
                        </div>
                        <label className="radio-container">
                            <input
                                type="radio"
                                name="invitation-status"
                                value="no"
                                className="radio-input"
                            />
                            <div className="radio-custom">
                                <div className="radio-dot"></div>
                            </div>
                            <span className="radio-label">없음</span>
                        </label>
                    </div>
                </div>
                
                <div className="form-section">
                    <div className="form-label-container">
                        <label className="form-label">태그</label>
                    </div>
                    <div className="form-input-container">
                        <div className="tag-input-container">
                            {tags.map((tag, index) => (
                                <div key={index} className="tag-item">
                                    #{tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="tag-remove-btn"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                placeholder={tags.length === 0 ? "#태그1 #태그2 (최대 5개)" : ""}
                                className="tag-input"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

export default PostingFormPage;