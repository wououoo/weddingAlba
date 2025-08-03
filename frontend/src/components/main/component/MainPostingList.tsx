import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Posting {
    id: number;
    title: string;
    location: string;
    wages: string;
    image: string | null;
    bgColor: string;
    letter?: string;
    isBookmarked: boolean;
}

const postings: Posting[] = [
    {
        id: 1,
        title: "사촌 결혼식 하객 구합니다.",
        location: "서울 강남구",
        wages: "일급 12만원",
        image: null,
        bgColor: "bg-gray-200",
        isBookmarked: false,
    },
    {
        id: 2,
        title: "친척 결혼식 하객 대리 참석 구인",
        location: "경기도 성남시 분당구",
        wages: "건당 15만원",
        bgColor: "bg-orange-500",
        image: null,
        letter: "ㅊ",
        isBookmarked: false,
    },
    {
        id: 3,
        title: "친구 결혼식 축하 하객 모집합니다.",
        location: "부산 해운대구",
        wages: "협의 후 결정",
        bgColor: "bg-green-500",
        image: null,
        letter: "ㅊ",
        isBookmarked: false,
    },
    {
        id: 4,
        title: "결혼식 대리 참석 (부케 대리) 구인",
        location: "대구 수성구",
        wages: "일급 10만원 + 부케비",
        bgColor: "bg-yellow-400",
        image: null,
        isBookmarked: false,
    },
    {
        id: 5,
        title: "단시간 결혼식 참석 후기 작성 알바",
        location: "인천 연수구",
        wages: "시급 2만원",
        bgColor: "bg-red-500",
        letter: "단",
        image: null,
        isBookmarked: false,
    },
];

export const MainPostingList: React.FC = () => {
    const navigate = useNavigate();
    const [postingList, setPostingList] = useState<Posting[]>(postings);

    const goToPostingList = () => {
        navigate('/posting/list');
    };

    const handleBookmarkClick = (id: number) => {
        setPostingList((prevPostings) =>
            prevPostings.map((posting) =>
                posting.id === id ? { ...posting, isBookmarked: !posting.isBookmarked } : posting
            )
        );
    };

    return (
        <div className="px-4">
            <div className="flex items-center justify-between mb-4">
                <h3 
                    className="text-lg font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors" onClick={goToPostingList}>
                    전체 모집글
                </h3>
                <button className="flex gap-1 text-gray-500 text-sm hover:text-gray-700 transition-colors" onClick={goToPostingList}>
                    더 보기 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* 모집글 카드들 */}
            <div className="space-y-4">
                {postingList.map((posting: Posting) => (
                    <div 
                        key={posting.id} 
                        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/posting/${posting.id}`)}
                    >
                        <div className="flex items-start space-x-3">
                            <div className={`w-16 h-16 ${posting.bgColor} rounded-lg overflow-hidden flex items-center justify-center`}>
                                {posting.image ? (
                                    <img 
                                        src={posting.image} 
                                        alt="모집글 이미지"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML = `<span class="text-white font-bold text-lg">${posting.title.charAt(0)}</span>`;
                                            }
                                        }}
                                    />
                                ) : (
                                    <span className="text-white font-bold text-lg">{posting.letter}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 mb-1">{posting.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{posting.location}</p>
                                <p className="text-sm text-blue-600 font-medium">급여: {posting.wages}</p>
                            </div>
                            <button className="p-2" onClick={(e) => { e.stopPropagation(); handleBookmarkClick(posting.id); }}>
                                {posting.isBookmarked ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000" className="size-4">
                                        <path fillRule="evenodd" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainPostingList; 