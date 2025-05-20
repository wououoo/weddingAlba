import React from "react";
import './styles/MainStyle.css';
import MainFooter from "./component/MainFooter";
import MainPostingList from "./component/MainPostingList";

const MainPage: React.FC = () => {
    return (
        <div className="content-wrap">
            {/* 메인 배너 - swiper 대신 일반 이미지로 대체 */}
            <div className="main-banner-images">
                <div>
                    <img src="/images/placeholder-banner.jpg" alt="메인 배너" />
                </div>
            </div>
            
            {/*아이콘 버튼 모음*/}
            <div className="main-icon-btn-wrap">
                <button className="main-icon-btn posting-btn">
                    <div className="icon-img">
                        {/* 이미지가 없는 경우 대비하여 텍스트로 대체 */}
                        <div className="placeholder-icon">모집</div>
                    </div>
                    <p className="main-icon-btn-text">모집하기</p>
                </button>
                <button className="main-icon-btn posting-state-btn">
                    <div className="icon-img">
                        <div className="placeholder-icon">현황</div>
                    </div>
                    <p className="main-icon-btn-text">모집현황</p>
                </button>
                <button className="main-icon-btn applying-btn">
                    <div className="icon-img">
                        <div className="placeholder-icon">지원</div>
                    </div>
                    <p className="main-icon-btn-text">지원하기</p>
                </button>
                <button className="main-icon-btn applying-state-btn">
                    <div className="icon-img">
                        <div className="placeholder-icon">결과</div>
                    </div>
                    <p className="main-icon-btn-text">지원현황</p>
                </button>
            </div>
            
            {/* 모집글 */}
            <MainPostingList/>
            
            {/*푸터 */}
            <MainFooter/>
        </div>
    );
}

export default MainPage;