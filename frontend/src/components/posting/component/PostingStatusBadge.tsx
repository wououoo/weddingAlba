import React from 'react';

interface PostingStatusBadgeProps {
    status: number;
}

const PostingStatusBadge: React.FC<PostingStatusBadgeProps> = ({ status }) => {
    const getBadgeConfig = () => {
        switch (status) {
            case 1:
                return {
                    icon: "✅",
                    text: "모집확정",
                    className: "bg-green-100 text-green-800 border border-green-200"
                };
            case -1:
                return {
                    icon: "❌",
                    text: "모집취소",
                    className: "bg-red-100 text-red-800 border border-red-200"
                };
            case 0:
            default:
                return {
                    icon: "📝",
                    text: "모집중",
                    className: "bg-yellow-100 text-yellow-800 border border-yellow-200"
                };
        }
    };

    const { icon, text, className } = getBadgeConfig();

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}>
            {icon} {text}
        </span>
    );
};

export default PostingStatusBadge;