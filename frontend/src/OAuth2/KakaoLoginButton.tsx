import React from 'react';

const KakaoLoginButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center bg-[#FEE500] text-black font-medium py-3 px-4 rounded-lg hover:bg-[#FFEC8B] transition-colors duration-300"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" className="mr-2">
        <g fill="none" fillRule="evenodd">
          <path 
            fill="#000" 
            fillRule="nonzero" 
            d="M9 0C4.0294 0 0 3.22178 0 7.19303c0 2.6179 1.75927 4.91339 4.39452 6.19061-.19247.72823-.69538 2.63388-.79758 3.04256-.12438.50918.18443.50173.38647.36517.15879-.10709 2.52255-1.70134 3.53315-2.39011.48087.06979.97654.10684 1.48344.10684C13.9706 14.5061 18 11.2843 18 7.31307 18 3.22178 13.9706 0 9 0Z"
          />
        </g>
      </svg>
      카카오 로그인
    </button>
  );
};

export default KakaoLoginButton;