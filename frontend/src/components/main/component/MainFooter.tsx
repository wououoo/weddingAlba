const MainFooter: React.FC = () => {
    return (
        <div className="mt-12 bg-gray-100/80 pt-8 pb-6">
            <div className="px-4">
                {/* 회사 정보 섹션 */}
                <div className="bg-gray-200/60 rounded-lg p-5 mb-6 border border-gray-300/50">
                    <div className="flex items-start mb-4">
                        <div className="w-8 h-8 bg-gray-600 rounded-md flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">W</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700 text-base">하객알바</h3>
                            <p className="text-xs text-gray-500">주식회사</p>
                        </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-600">
                        <div className="flex">
                            <span className="w-16 text-gray-500">대표</span>
                            <span>김웨딩</span>
                        </div>
                        <div className="flex">
                            <span className="w-16 text-gray-500">주소</span>
                            <span className="flex-1">서울특별시 강남구 테헤란로 123</span>
                        </div>
                        <div className="flex">
                            <span className="w-16 text-gray-500">사업자</span>
                            <span>123-45-67890</span>
                        </div>
                        <div className="flex">
                            <span className="w-16 text-gray-500">연락처</span>
                            <span>02-1234-5678</span>
                        </div>
                    </div>
                </div>

                {/* 링크 메뉴 */}
                <div className="mb-6">
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
                        <button className="text-gray-600 hover:text-gray-800 transition-colors underline-offset-2 hover:underline">
                            서비스 이용약관
                        </button>
                        <span className="text-gray-400">•</span>
                        <button className="text-gray-600 hover:text-gray-800 transition-colors underline-offset-2 hover:underline">
                            개인정보 처리방침
                        </button>
                        <span className="text-gray-400">•</span>
                        <button className="text-gray-600 hover:text-gray-800 transition-colors underline-offset-2 hover:underline">
                            위치정보 이용약관
                        </button>
                        <span className="text-gray-400">•</span>
                        <button className="text-gray-600 hover:text-gray-800 transition-colors underline-offset-2 hover:underline">
                            입점 문의
                        </button>
                        <span className="text-gray-400">•</span>
                        <button className="text-gray-600 hover:text-gray-800 transition-colors underline-offset-2 hover:underline">
                            광고/제휴 문의
                        </button>
                    </div>
                </div>

                {/* 고지사항 */}
                <div className="text-center">
                    <p className="text-xs text-gray-500 leading-relaxed mb-3 px-2">
                        하객알바는 통신판매중개자이며 통신판매의 당사자가 아닙니다.<br />
                        하객알바는 예약 및 구매관련 통신판매업자가 제공하는 상품, 거래정보 및 거래 등에 대하여 책임을 지지 않습니다.
                    </p>
                    <div className="text-xs text-gray-400 border-t border-gray-300 pt-3">
                        © 2025 하객알바. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainFooter;