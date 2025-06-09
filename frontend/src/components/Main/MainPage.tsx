import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import MainPostingList from './component/MainPostingList';
import MainFooter from "./component/MainFooter";

const MainPage: React.FC = () => {
    const navigate = useNavigate();

    // 공지사항 데이터
    const notices = [
        {
            id: 1,
            title: '"새로운 하객 모집 공고가 등록되었습니다!"',
            subtitle: '지금 바로 확인하세요 →'
        },
        {
            id: 2,
            title: '하객알바 플랫폼 이용 가이드',
            subtitle: '자세히 알아보기 →'
        },
        {
            id: 3,
            title: '프리미엄 하객 서비스 출시!',
            subtitle: '특별 혜택 확인하기 →'
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Swiper 커스텀 스타일 */}
            <style>{`
                .notice-swiper .swiper-pagination {
                    bottom: 16px !important;
                    right: 16px !important;
                    left: auto !important;
                    width: auto !important;
                    text-align: right;
                }
                .notice-swiper .swiper-pagination-bullet {
                    background-color: white !important;
                    opacity: 0.4 !important;
                    width: 8px !important;
                    height: 8px !important;
                    margin: 0 4px !important;
                }
                .notice-swiper .swiper-pagination-bullet-active {
                    opacity: 1 !important;
                }
            `}</style>
            
            {/* 상단 공지사항 배너 */}
            <div className="mx-4 mt-4 mb-6">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{
                        clickable: true,
                    }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="rounded-xl notice-swiper"
                >
                    {notices.map((notice, index) => (
                        <SwiperSlide key={notice.id}>
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white relative overflow-hidden">
                                {/* 배경 장식 요소 */}
                                <div className="absolute right-4 top-4 opacity-30">
                                    <div className="w-16 h-16 border-4 border-white rounded-full"></div>
                                    <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full opacity-50"></div>
                                </div>
                                
                                {/* 공지사항 내용 */}
                                <div className="relative z-10">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 inline-block mb-3">
                                        <span className="text-sm font-medium">공지사항 (최신 글)</span>
                                    </div>
                                    <h2 className="text-lg font-bold mb-2">{notice.title}</h2>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm opacity-90">{notice.subtitle}</span>
                                        <span className="text-sm opacity-75">{index + 1} / {notices.length}</span>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* 메인 메뉴 아이콘들 */}
            <div className="flex justify-around mb-8 px-4">
                <button 
                    className="flex flex-col justify-center items-center p-1"
                    onClick={() => navigate('/posting/create')}
                >
                    <div className="w-8 h-8 mb-4">
                        <img src="/images/hiring-icon-img.png" alt="모집하기" className="w-full h-full object-contain"/>
                    </div>
                    <p className="text-sm">모집하기</p>
                </button>
                <button className="flex flex-col justify-center items-center p-1">
                    <div className="w-8 h-8 mb-4">
                        <img src="/images/hired-icon-img.png" alt="모집현황" className="w-full h-full object-contain"/>
                    </div>
                    <p className="text-sm">모집현황</p>
                </button>
                <button 
                    className="flex flex-col justify-center items-center p-1"
                    onClick={() => navigate('/posting/list')}
                >
                    <div className="w-8 h-8 mb-4">
                        <img src="/images/applying-icon-img.png" alt="지원하기" className="w-full h-full object-contain"/>
                    </div>
                    <p className="text-sm">지원하기</p>
                </button>
                <button 
                    className="flex flex-col justify-center items-center p-1"
                    onClick={() => navigate('/applying/list')}
                >
                    <div className="w-8 h-8 mb-4">
                        <img src="/images/applied-icon-img.png" alt="지원현황" className="w-full h-full object-contain"/>
                    </div>
                    <p className="text-sm">지원현황</p>
                </button>
            </div>

            {/* 전체 모집글 섹션 */}
            <MainPostingList />

            {/* Footer */}
            <MainFooter />

            {/* 하단 여백 */}
            <div className="h-6"></div>
        </div>
    );
};

export default MainPage; 