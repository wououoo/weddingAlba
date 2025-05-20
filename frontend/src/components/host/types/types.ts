// types.ts - 호스트 페이지 관련 타입 정의

// 탭 타입
export type TabType = 'all' | 'recommended' | 'recent' | 'popular';

// 하객 알바 게시글 타입
export interface PostingItem {
  id: number;
  title: string;
  location: string;
  price: number;
  date: string;
  time: string;
  requiredPeople: number;
  currentPeople: number;
  tags: string[];
}