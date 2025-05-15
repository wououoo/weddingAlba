import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './MainStyle.css';
import MainFooter from "./MainFooter";
import PostingList from "./PostingList";

const MainPage: React.FC = () => {
    return (
        <div className="content-wrap">
            {/*메인 배너 swiper
        일단 임시로 대충넣어둠 나중에 맞춰서 설정할예정*/}
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
            <PostingList/>
            {/*<div className="posting-wrapper pb-10">*/}
            {/*    <div className="posting-list-container py-5">*/}
            {/*        <div className="posting-list-header px-5">*/}
            {/*            <h3 className="text-lg font-bold">전체 모집글</h3>*/}
            {/*            <a className="more-btn" href="">더보기</a>*/}
            {/*        </div>*/}
            {/*        <div className="posting-list-container-body">*/}
            {/*            <div className="v-scroll">*/}
            {/*                <div className="v-scroll-inner">*/}
            {/*                    <div className="posting-list">*/}
            {/*                        <div>*/}
            {/*                            <div className="posting-list-item">*/}
            {/*                                <a className="image-wrap">*/}
            {/*                                    <div className="img"></div>*/}
            {/*                                </a>*/}
            {/*                                <div className="detail">*/}
            {/*                                    <a><h3 className="name">모집글 1</h3>*/}
            {/*                                    <div className="meta">*/}
            {/*                                        <span className="tags">모집글 태그</span>*/}
            {/*                                    </div>*/}
            {/*                                    </a>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}


            {/*<section className="section pb-45">*/}
            {/*    <div className="container gutter-sm">*/}
            {/*        <div className="section-header section-header-v">*/}
            {/*            <h3 className="section-title ebold">웨이팅 핫플레이스*/}
            {/*            BEST</h3><p>핫 한 웨이팅 라인업, 이제 캐치테이블에서!</p>*/}
            {/*            <a className="kquhz00 btn-more">전체보기*/}
            {/*            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"*/}
            {/*                 className="kquhz01">*/}
            {/*                <path fill-rule="evenodd" clip-rule="evenodd"*/}
            {/*                      d="M14.7271 12.0002L9.36353 6.63656L10.6363 5.36377L16.6363 11.3638C16.9878 11.7152 16.9878 12.2851 16.6363 12.6366L10.6363 18.6366L9.36353 17.3638L14.7271 12.0002Z"*/}
            {/*                      fill="currentColor"></path>*/}
            {/*            </svg>*/}
            {/*        </a></div>*/}
            {/*        <div className="section-body">*/}
            {/*            <div className="v-scroll">*/}
            {/*                <div className="v-scroll-inner">*/}
            {/*                    <div className="restaurant-list restaurant-list-sm">*/}
            {/*                        <div>*/}
            {/*                            <div className="restaurant-list-item"><a className="tb">*/}
            {/*                                <div className="img"></div>*/}
            {/*                            </a>*/}
            {/*                                <div className="detail"><a className="btn-bookmark">북마크</a><a><h3*/}
            {/*                                    className="name">고집돌우럭 제주공항점</h3>*/}
            {/*                                    <div className="meta"><span className="score">4.6</span><span*/}
            {/*                                        className="tags">한식 • 제주 제주시</span></div>*/}
            {/*                                </a></div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                        <div>*/}
            {/*                            <div className="restaurant-list-item"><a className="tb">*/}
            {/*                                <div className="img"></div>*/}
            {/*                            </a>*/}
            {/*                                <div className="detail"><a className="btn-bookmark">북마크</a><a><h3*/}
            {/*                                    className="name">포레스트 동탄본점</h3>*/}
            {/*                                    <div className="meta"><span className="score">4.7</span><span*/}
            {/*                                        className="tags">베트남음식 • 동탄</span></div>*/}
            {/*                                </a></div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                        <div>*/}
            {/*                            <div className="restaurant-list-item"><a className="tb">*/}
            {/*                                <div className="img"></div>*/}
            {/*                            </a>*/}
            {/*                                <div className="detail"><a className="btn-bookmark">북마크</a><a><h3*/}
            {/*                                    className="name">네시사분</h3>*/}
            {/*                                    <div className="meta"><span className="score">4.7</span><span*/}
            {/*                                        className="tags">카페,디저트 • 연남</span></div>*/}
            {/*                                </a></div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                        <div className="restaurant-list-item"></div>*/}
            {/*                        <div className="restaurant-list-item"></div>*/}
            {/*                        <div className="restaurant-list-item"></div>*/}
            {/*                        <div className="restaurant-list-item"></div>*/}
            {/*                        <div className="restaurant-list-item"></div>*/}
            {/*                        <div className="restaurant-list-item"></div>*/}
            {/*                        <div className="restaurant-list-item"></div>*/}
            {/*                        <span className="_3daqbr0">*/}
            {/*                            <button type="button" className="_3daqbr1 _1ltqxco22">*/}
            {/*                                <div className="_3daqbr2 _1ltqxco28 _3daqbr4">*/}
            {/*                                    <svg width="1em" height="1em"*/}
            {/*                                                                          viewBox="0 0 24 24" fill="none"*/}
            {/*                                                                          xmlns="http://www.w3.org/2000/svg"*/}
            {/*                                                                          className="_3daqbr5 _3daqbr7"><path*/}
            {/*                            fill-rule="evenodd" clip-rule="evenodd"*/}
            {/*                            d="M13.0001 5.72705L18.6365 11.3634C18.988 11.7149 18.988 12.2848 18.6365 12.6362L13.0001 18.2726L11.7273 16.9998L15.8273 12.8998H5.1001V11.0998H15.8273L11.7273 6.99984L13.0001 5.72705Z"*/}
            {/*                            fill="currentColor"></path></svg></div><span>전체보기</span></button></span></div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            <MainFooter/>
        </div>
    );
}

export default MainPage;