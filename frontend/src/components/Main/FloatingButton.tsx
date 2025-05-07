import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FloatingButtonProps {
  onClick?: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/posting/create');
    }
  };
  
  return (
    <div className="fixed bottom-16 right-4">
      <button
        className="bg-purple-600 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white floating-button"
        onClick={handleClick}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
};

export default FloatingButton;