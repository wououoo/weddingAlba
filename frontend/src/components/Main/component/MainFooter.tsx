const MainFooter: React.FC = () => {
    return (
        <div className="text-[11px] bg-gray-50 py-[35px]">
            <div className="px-4">
                <h4>
                    주식회사
                </h4>
                <address className="text-gray-700 mt-3">
                    <p>대표 : <span></span></p>
                    <p>
                        주소 : <span></span>
                    </p>
                    <p>
                        사업자등록번호 : <span></span>
                    </p>
                    <p>
                        통신판매업 신고번호 : <span></span>
                    </p>
                    <p>
                        개인정보담당 : <span></span>
                    </p>
                    <p>
                        대표번호 : <span></span>
                    </p>
                </address>
                <p className="main-footer-desc mt-2 text-gray-600">
                    하객알바는 통신판매중개자이며 통신판매의 당사자가 아닙니다. 하객알바는 예약 및 구매관련 통신판매업자가 제공하는 상품,
                    거래정보 및 거래 등에 대하여 책임을 지지 않습니다.
                </p>
                <nav className="mt-5 text-[11px] font-medium text-[#666] flex items-center flex-wrap content-center">
                    <a className="menu-abchor" href="">서비스 이용약관</a>
                    <span className="split">|</span>
                    <a className="menu-abchor" href="">개인정보 처리방침</a>
                    <span className="split">|</span>
                    <a className="menu-abchor" href="" >위치정보 이용약관</a>
                    <span className="split">|</span>
                    <a className="menu-abchor" href="">입점 문의</a>
                    <span className="split">|</span>
                    <a>광고/제휴 문의</a>
                </nav>
            </div>
        </div>
    );
}

export default MainFooter;