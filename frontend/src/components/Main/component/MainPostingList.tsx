import { useNavigate } from "react-router-dom";

const postings = [
    { 
        id: 1, 
        title: "사촌 결혼식 하객 구합니다.", 
        location: "서울 강남구",
        wages: "일급 12만원",
        image: "/images/example-image-1.jpg",
        bgColor: "bg-gray-200"
    },
    { 
        id: 2, 
        title: "친척 결혼식 하객 대리 참석 구인", 
        location: "경기도 성남시 분당구",
        wages: "건당 15만원",
        image: null,
        bgColor: "bg-orange-500",
        letter: "ㅊ"
    },
    { 
        id: 3, 
        title: "친구 결혼식 축하 하객 모집합니다.", 
        location: "부산 해운대구",
        wages: "협의 후 결정",
        image: null,
        bgColor: "bg-green-500",
        letter: "ㅊ"
    },
    { 
        id: 4, 
        title: "결혼식 대리 참석 (부케 대리) 구인", 
        location: "대구 수성구",
        wages: "일급 10만원 + 부케비",
        image: "/images/example-image-2.jpg",
        bgColor: "bg-yellow-400"
    },
    { 
        id: 5, 
        title: "단시간 결혼식 참석 후기 작성 알바", 
        location: "인천 연수구",
        wages: "시급 2만원",
        image: null,
        bgColor: "bg-red-500",
        letter: "단"
    },
];

export const MainPostingList: React.FC = () => {
    const navigate = useNavigate();

    const goToPostingList = () => {
        navigate('/posting/list');
    };

    return (
        <div className="px-4">
            <div className="flex items-center justify-between mb-4">
                <h3 
                    className="text-lg font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors" 
                    onClick={goToPostingList}
                >
                    전체 모집글
                </h3>
                <button 
                    className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                    onClick={goToPostingList}
                >
                    더 보기 →
                </button>
            </div>

            {/* 모집글 카드들 */}
            <div className="space-y-4">
                {postings.map((posting) => (
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
                            <button className="p-2">
                                <div className="w-5 h-5 border border-gray-300 rounded"></div>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainPostingList; 