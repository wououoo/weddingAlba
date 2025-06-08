type PostingCardProps = {
    title: string;
    simplyLocation: string;
    appointmentDatetime: string;
    location: string;
    perPay: string;
    pay: string;
    tag: string[];
    // 필요 시 더 추가
};

const PostingCard: React.FC<PostingCardProps> = ({
                                                     title,
                                                     simplyLocation,
                                                     appointmentDatetime,
                                                     location,
                                                     perPay,
                                                     pay,
                                                     tag,}) => {
    return (
    <li className="posting-card-li w-100 p-3 bg-white rounded-lg mb-5">
        <a href="/posting/view/id">
            <div className="posting-component-header flex justify-between px-2 mb-3">
                <div className="component-header-left">
                    <span className="title">{title}</span>
                </div>
                <div className="component-header-right">
                    <div className="simply-location">
                        {/*대략적인 위치*/}
                        <svg width="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                             className="size-4 m-0 p-0">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M8 14.667s5.667-3.334 5.667-8.074c0-2.926-2.353-5.26-5.667-5.26-3.314 0-5.667 2.334-5.667 5.26 0 4.74 5.667 8.074 5.667 8.074zm0-6a2 2 0 100-4 2 2 0 000 4z"
                                  fill="currentColor"></path>
                        </svg>
                        <span>{simplyLocation}</span>
                    </div>
                </div>
            </div>
            <div className="posting-component-body px-2 mb-3">
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
                        <span className="content-text">{appointmentDatetime}</span>
                    </div>
                    <div className="content-detail-wrap flex">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                             className="size-4 fill-stone-400">
                            <path fill-rule="evenodd"
                                  d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                                  clip-rule="evenodd"/>
                        </svg>
                        <span className="content-text">{location}</span>
                    </div>
                    <div className="content-detail-wrap flex">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                             className="size-4 fill-stone-400">
                            <path
                                d="M6.375 5.5h.875v1.75h-.875a.875.875 0 1 1 0-1.75ZM8.75 10.5V8.75h.875a.875.875 0 0 1 0 1.75H8.75Z"/>
                            <path fill-rule="evenodd"
                                  d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM7.25 3.75a.75.75 0 0 1 1.5 0V4h2.5a.75.75 0 0 1 0 1.5h-2.5v1.75h.875a2.375 2.375 0 1 1 0 4.75H8.75v.25a.75.75 0 0 1-1.5 0V12h-2.5a.75.75 0 0 1 0-1.5h2.5V8.75h-.875a2.375 2.375 0 1 1 0-4.75h.875v-.25Z"
                                  clip-rule="evenodd"/>
                        </svg>
                        <span className="content-text"><span className="highlight-text">{perPay}</span>{pay}</span>
                    </div>
                </div>
            </div>
            <div className="posting-component-footer px-2">
                <div className="tag-wrap">
                    {tag.map((t, i) => (
                        <span key={i} className="posting-tag">{t}</span>
                    ))}
                </div>
            </div>
        </a>
    </li>
    )
        ;
}
export default PostingCard;