// PostingCard.tsx - 게시글 카드 컴포넌트

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PostingItem } from './types/types';
import { formatPrice } from './utils';

interface PostingCardProps {
  posting: PostingItem;
}

const PostingCard: React.FC<PostingCardProps> = ({ posting }) => {
  const navigate = useNavigate();
  
  const onCardClick = () => {
    navigate(`/posting/${posting.id}`);
  };
  
  const onApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/apply/${posting.id}`);
  };
  
  const onBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`${posting.title} 게시글을 찜 목록에 추가했습니다.`);
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer posting-card"
      onClick={onCardClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg mb-1">{posting.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{posting.location}</p>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{`${posting.date} (${posting.time})`}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {posting.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <span className="text-purple-600 font-bold">{formatPrice(posting.price)}</span>
          <div className="text-sm text-gray-500 mt-2">
            모집 인원: <span className="font-medium">{posting.requiredPeople}명</span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        <button 
          className="text-white bg-purple-600 px-3 py-1 rounded-md text-sm hover:bg-purple-700" 
          onClick={onApplyClick}
        >
          신청하기
        </button>
        <button 
          className="ml-2 text-gray-500 border border-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-50"
          onClick={onBookmarkClick}
        >
          찜하기
        </button>
      </div>
    </div>
  );
};

export default PostingCard;