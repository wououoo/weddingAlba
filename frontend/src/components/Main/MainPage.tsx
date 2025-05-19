import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './styles/MainStyle.css';
import MainFooter from "./component/MainFooter";
import MainPostingList from "./component/MainPostingList";

const MainPage: React.FC = () => {
    return (
        <div className="content-wrap">
{/*메인 배너 swiper 일단 임시로 대충넣어둠 나중에 맞춰서 설정할예정*/}
            <Swiper
                className="main-banner-images"
                spaceBetween={50}
                slidesPerView={1}
                navigation
                pagination={{clickable: true}}
                autoplay={{delay: 2000}}>
                <SwiperSlide>
                    <img src="/images/example-how-to-use-image.jpg"/>
                </SwiperSlide>
                <SwiperSlide>
                    <img src="/images/example-notice-image.jpg"/>
                </SwiperSlide>
            </Swiper>
            {/*아이콘 버튼 모음*/}
            <div className="main-icon-btn-wrap">
                <button className="main-icon-btn posting-btn">
                    <div className="icon-img">
                        <img src="/images/hiring-icon-img.png"/>
                    </div>
                    <p className="main-icon-btn-text">모집하기</p>
                </button>
                <button className="main-icon-btn posting-state-btn">
                    <div className="icon-img">
                        <img src="/images/hired-icon-img.png"/>
                    </div>
                    <p className="main-icon-btn-text">모집현황</p>
                </button>
                <button className="main-icon-btn applying-btn">
                    <div className="icon-img">
                        <img src="/images/applying-icon-img.png"/>

                    </div>
                    <p className="main-icon-btn-text">지원하기</p>
                </button>
                <button className="main-icon-btn applying-state-btn">
                    <div className="icon-img">
                        <img src="/images/applied-icon-img.png"/>
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