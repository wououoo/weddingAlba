import MainPage from "../MainPage";

const postings = [
    { id: 1, title: "모집글 1", tags: "태그 A" },
    { id: 2, title: "모집글 2", tags: "태그 B" },
    { id: 3, title: "모집글 3", tags: "태그 C" },
    { id: 3, title: "모집글 4", tags: "태그 D" },
    { id: 3, title: "모집글 5", tags: "태그 E" },
    { id: 3, title: "모집글 6", tags: "태그 F" },
    { id: 3, title: "모집글 7", tags: "태그 G" },
    { id: 3, title: "모집글 8", tags: "태그 H" },
];
export const MainPostingList: React.FC = () => {
    return (
        <div className="posting-wrapper pb-10">
            <div className="posting-list-container py-5">
                <div className="posting-list-header px-5">
                    <h3 className="text-lg font-bold">전체 모집글</h3>
                    <a className="more-btn" href="/posting/list">더보기</a>
                </div>
                <div className="posting-list-container-body">
                    <div className="v-scroll">
                        <div className="v-scroll-inner">
                            <div className="posting-list">
                                {postings.map((post) => (
                                    <div key={post.id}>
                                        <div className="posting-list-item">
                                            <a className="image-wrap">
                                                <div className="img"></div>
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
