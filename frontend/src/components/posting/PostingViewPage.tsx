import {sampleData} from "./dto/PostingResponseDTO";

const PostingViewPage: React.FC = () => {
    const {
        title,
        simplyLocation,
        appointmentDatetime,
        location,
        workingHours,
        wages,
        nickname,
        postingHistoryCount,
        hasMobileInvitation,
        guestMainRole,
        taskDescription,
    } = sampleData;
    return <div className="posting-view-container bg-white">
        <div className="posting-view-top p-5">
            <div className="view-title flex justify-between mb-4">
                <h1 className="text-xl font-bold">{title}</h1>
                <div className="simply-location">
                    <svg width="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                         className="size-4 m-0 p-0">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M8 14.667s5.667-3.334 5.667-8.074c0-2.926-2.353-5.26-5.667-5.26-3.314 0-5.667 2.334-5.667 5.26 0 4.74 5.667 8.074 5.667 8.074zm0-6a2 2 0 100-4 2 2 0 000 4z"
                              fill="currentColor"></path>
                    </svg>
                    <span>{simplyLocation}</span>
                </div>
            </div>

            <div className="posting-user-info mb-3">
                <p className="posting-user-nickname flex mb-0.5">
                    <span>{nickname}</span>
                </p>
                {hasMobileInvitation && (
                    <div className="hasMobileInvitation flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#f0bfbd" className="size-4">
                              <path fill-rule="evenodd" d="M8.5 1.709a.75.75 0 0 0-1 0 8.963 8.963 0 0 1-4.84 2.217.75.75 0 0 0-.654.72 10.499 10.499 0 0 0 5.647 9.672.75.75 0 0 0 .694-.001 10.499 10.499 0 0 0 5.647-9.672.75.75 0 0 0-.654-.719A8.963 8.963 0 0 1 8.5 1.71Zm2.34 5.504a.75.75 0 0 0-1.18-.926L7.394 9.17l-1.156-.99a.75.75 0 1 0-.976 1.138l1.75 1.5a.75.75 0 0 0 1.078-.106l2.75-3.5Z" clip-rule="evenodd" />
                            </svg>
                        <span className="text-xs">모바일 청첩장 인증</span>
                    </div>
                )}
            </div>
                <div className="flex justify-between mb-3">
                    <div className="posting-history-count posting-tag">
                        <span className="mr-1">
                            누적 모집
                        </span>
                        {(postingHistoryCount ?? 0) > 0 && (
                            <span className="total-count text-gray-600">{postingHistoryCount}회</span>
                        )}
                    </div>
                </div>
        </div>
        <hr className="divide"/>
        <div className="posting-view-content p-5">
            <div className="content-info-title ">
                <h1 className="text-lg font-bold mb-3">알바정보</h1>
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
                    <span className="detail-title">날짜</span><span className="detail-description">{appointmentDatetime}</span>
                </div>
                <div className="info-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 fill-stone-400">
                        <path fill-rule="evenodd"
                              d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z"
                              clip-rule="evenodd"/>
                    </svg>
                    <span className="detail-title">시간</span><span className="detail-description">{workingHours}</span>
                </div>
                <div className="info-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                         className="size-4 fill-stone-400">
                        <path
                            d="M6.375 5.5h.875v1.75h-.875a.875.875 0 1 1 0-1.75ZM8.75 10.5V8.75h.875a.875.875 0 0 1 0 1.75H8.75Z"/>
                        <path fill-rule="evenodd"
                              d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM7.25 3.75a.75.75 0 0 1 1.5 0V4h2.5a.75.75 0 0 1 0 1.5h-2.5v1.75h.875a2.375 2.375 0 1 1 0 4.75H8.75v.25a.75.75 0 0 1-1.5 0V12h-2.5a.75.75 0 0 1 0-1.5h2.5V8.75h-.875a2.375 2.375 0 1 1 0-4.75h.875v-.25Z"
                              clip-rule="evenodd"/>
                    </svg>
                    <span className="detail-title">임금</span><span className="detail-description"><span>{wages}</span></span>
                </div>
                <div className="info-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 fill-stone-400">
                        <path fill-rule="evenodd"
                              d="M11 4V3a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1ZM9 2.5H7a.5.5 0 0 0-.5.5v1h3V3a.5.5 0 0 0-.5-.5ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                              clip-rule="evenodd"/>
                        <path
                            d="M3 11.83V12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-.17c-.313.11-.65.17-1 .17H4c-.35 0-.687-.06-1-.17Z"/>
                    </svg>
                    <span className="detail-title">업무</span><span className="detail-description">{guestMainRole}</span>
                </div>
                <div className="info-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 fill-stone-400">
                        <path d="M6 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"/>
                        <path fill-rule="evenodd"
                              d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm3.5 2.5a3 3 0 1 0 1.524 5.585l1.196 1.195a.75.75 0 1 0 1.06-1.06l-1.195-1.196A3 3 0 0 0 7.5 4.5Z"
                              clip-rule="evenodd"/>
                    </svg>
                    <span className="detail-title">상세내용</span><span className="detail-description">{taskDescription}</span>
                </div>
                <div className="info-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                         className="size-4 fill-stone-400">
                        <path fill-rule="evenodd"
                              d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                              clip-rule="evenodd"/>
                    </svg>
                    <span className="detail-title">위치</span><span className="detail-description">{location}</span>
                </div>
            </div>
            <div className="content-map">
                지도 넣기
            </div>
        </div>
        <button className="fixed bottom-[55px] left-0 w-full bg-[#f0bfbd] text-white text-lg font-semibold py-4 shadow-md z-50">
            신청하기
        </button>
    </div>
}

export default PostingViewPage;