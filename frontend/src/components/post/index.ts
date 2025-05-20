// index.ts - 게시글 페이지 배럴 패턴 내보내기

// 컴포넌트 내보내기
export { default as Post } from './Post';
export { default as SearchBar } from './SearchBar';
export { default as TabNavigation } from './TabNavigation';
export { default as PostingCard } from './PostingCard';
export { default as BottomNavigation } from './BottomNavigation';
export { default as FloatingButton } from './FloatingButton';

// API 내보내기
export * from './api/postApi';

// DTO 내보내기
export * from './dto/PostRequestDTO';
export * from './dto/PostResponseDTO';

// 타입 내보내기
export * from './types/types';

// 훅 내보내기
export * from './hooks';

// 기본 내보내기
import Post from './Post';
export default Post;