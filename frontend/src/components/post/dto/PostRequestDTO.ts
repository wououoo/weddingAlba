// PostRequestDTO.ts - 게시글 페이지 요청 DTO 정의

export interface PostingRequestDTO {
  tab?: string;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface BookmarkRequestDTO {
  postingId: number;
}