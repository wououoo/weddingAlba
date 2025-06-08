import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const postings = [
    { id: 1, title: "모집글 1", tags: "태그 A" },
    { id: 2, title: "모집글 2", tags: "태그 B" },
    { id: 3, title: "모집글 3", tags: "태그 C" },
    { id: 4, title: "모집글 4", tags: "태그 D" },
    { id: 5, title: "모집글 5", tags: "태그 E" },
    { id: 6, title: "모집글 6", tags: "태그 F" },
    { id: 7, title: "모집글 7", tags: "태그 G" },
    { id: 8, title: "모집글 8", tags: "태그 H" },
];

export const MainPostingList: React.FC = () => {
    const navigate = useNavigate();
    const imgRefs = useRef<Array<HTMLDivElement | null>>([]);

    // 이미지 로드 오류 처리 - 백그라운드 이미지를 위한 처리
    useEffect(() => {
        // 각 이미지 요소의 로드 오류 처리
        imgRefs.current.forEach(imgDiv => {
            if (imgDiv) {
                // 배경 이미지가 로드되었는지 확인하는 방법이 없으므로
                // 임시 이미지 요소를 만들어 테스트
                const tempImage = new Image();
                tempImage.onerror = () => {
                    imgDiv.classList.add('no-image');
                };
                tempImage.src = "/images/example-apply-image.jpg";
            }
        });
    }, []);

    const goToPostingList = () => {
        navigate('/posting/list');
    };

    return (
        <div className="posting-wrapper pb-10">
            <div className="py-5">
                <div className="flex justify-between items-center mb-4 px-5">
                    <h3 
                        className="text-lg font-bold cursor-pointer hover:text-purple-600" 
                        onClick={goToPostingList}
                    >
                        전체 모집글
                    </h3>
                    <a 
                        className="more-btn text-gray-600 right-0 ml-auto items-center cursor-pointer"
                        onClick={goToPostingList}
                        style={{ cursor: 'pointer' }}
                    >
                        더보기
                    </a>
                </div>
                <div className="posting-list-container-body">
                    <div className="scroll width-100 overflow-x-auto px-4">
                        <div className="flex gap-4 w-fit">
                            <div className="posting-list flex flex-nowrap">
                                {postings.map((post, index) => (
                                    <div key={post.id}>
                                        <div className="posting-list-item">
                                            <a className="image-wrap">
                                                <div 
                                                    className="img"
                                                    ref={el => { imgRefs.current[index] = el; }}
                                                ></div>
                                            </a>
                                            <div className="detail">
                                                <a>
                                                    <h3 className="name">{post.title}</h3>
                                                    <div className="meta">
                                                        <span className="tags">{post.tags}</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default MainPostingList;
