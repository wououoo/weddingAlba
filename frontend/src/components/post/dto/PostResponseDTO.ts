// PostResponseDTO.ts - 게시글 페이지 응답 DTO 정의

export interface PostingResponseDTO {
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

export interface PageResponseDTO<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}