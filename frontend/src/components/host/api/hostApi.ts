// hostApi.ts - 호스트 페이지 관련 API 호출 담당

import axios from 'axios';
import { PostingRequestDTO } from '../dto/HostRequestDTO';
import { PostingResponseDTO } from '../dto/HostResponseDTO';
import { ApiResponse } from '../../../utils/httpClient';

export const hostApi = {
  // 게시글 목록 조회
  getPostings: async (tab: string = 'all'): Promise<ApiResponse<PostingResponseDTO[]>> => {
    try {
      // 실제 API 연동 시 아래 코드 사용
      // const response = await axios.get(`/api/postings?tab=${tab}`);
      // return response.data;
      
      // 더미 데이터 반환 (API 연동 전까지 사용)
      return {
        success: true,
        data: [
          {
            id: 1,
            title: '강남 S웨딩홀 하객 구합니다',
            location: '서울 강남구',
            price: 100000,
            date: '2025.05.15',
            time: '13:00',
            requiredPeople: 5,
            currentPeople: 0,
            tags: ['남녀혼합', '정장필수', '교통비포함']
          },
          {
            id: 2,
            title: '송파 L호텔 하객 급구',
            location: '서울 송파구',
            price: 120000,
            date: '2025.04.28',
            time: '11:30',
            requiredPeople: 3,
            currentPeople: 0,
            tags: ['여성우대', '20~30대', '식사제공']
          },
          {
            id: 3,
            title: '분당 P컨벤션 하객 모집',
            location: '경기 성남시 분당구',
            price: 90000,
            date: '2025.05.05',
            time: '14:00',
            requiredPeople: 8,
            currentPeople: 0,
            tags: ['남성우대', '정장여가능', '교통비별도']
          }
        ],
        message: '게시글 목록을 성공적으로 불러왔습니다.'
      };
    } catch (error) {
      console.error('게시글 목록 조회 오류:', error);
      return {
        success: false,
        data: null,
        message: '게시글 목록을 불러오는데 실패했습니다.'
      };
    }
  },
  
  // 게시글 검색
  searchPostings: async (keyword: string): Promise<ApiResponse<PostingResponseDTO[]>> => {
    try {
      // 실제 API 연동 시 아래 코드 사용
      // const response = await axios.get(`/api/postings/search?keyword=${encodeURIComponent(keyword)}`);
      // return response.data;
      
      // 더미 데이터 검색 (API 연동 전까지 사용)
      const dummyPosts = [
        {
          id: 1,
          title: '강남 S웨딩홀 하객 구합니다',
          location: '서울 강남구',
          price: 100000,
          date: '2025.05.15',
          time: '13:00',
          requiredPeople: 5,
          currentPeople: 0,
          tags: ['남녀혼합', '정장필수', '교통비포함']
        },
        {
          id: 2,
          title: '송파 L호텔 하객 급구',
          location: '서울 송파구',
          price: 120000,
          date: '2025.04.28',
          time: '11:30',
          requiredPeople: 3,
          currentPeople: 0,
          tags: ['여성우대', '20~30대', '식사제공']
        },
        {
          id: 3,
          title: '분당 P컨벤션 하객 모집',
          location: '경기 성남시 분당구',
          price: 90000,
          date: '2025.05.05',
          time: '14:00',
          requiredPeople: 8,
          currentPeople: 0,
          tags: ['남성우대', '정장여가능', '교통비별도']
        }
      ];
      
      const filteredPosts = dummyPosts.filter(post => 
        post.title.includes(keyword) || 
        post.location.includes(keyword) ||
        post.tags.some(tag => tag.includes(keyword))
      );
      
      return {
        success: true,
        data: filteredPosts,
        message: `'${keyword}'에 대한 검색 결과입니다.`
      };
    } catch (error) {
      console.error('게시글 검색 오류:', error);
      return {
        success: false,
        data: null,
        message: '게시글 검색에 실패했습니다.'
      };
    }
  },
  
  // 게시글 상세 조회
  getPostingDetail: async (postingId: number): Promise<ApiResponse<PostingResponseDTO>> => {
    try {
      // 실제 API 연동 시 아래 코드 사용
      // const response = await axios.get(`/api/postings/${postingId}`);
      // return response.data;
      
      // 더미 데이터 반환 (API 연동 전까지 사용)
      const dummyPosts = [
        {
          id: 1,
          title: '강남 S웨딩홀 하객 구합니다',
          location: '서울 강남구',
          price: 100000,
          date: '2025.05.15',
          time: '13:00',
          requiredPeople: 5,
          currentPeople: 0,
          tags: ['남녀혼합', '정장필수', '교통비포함']
        },
        {
          id: 2,
          title: '송파 L호텔 하객 급구',
          location: '서울 송파구',
          price: 120000,
          date: '2025.04.28',
          time: '11:30',
          requiredPeople: 3,
          currentPeople: 0,
          tags: ['여성우대', '20~30대', '식사제공']
        },
        {
          id: 3,
          title: '분당 P컨벤션 하객 모집',
          location: '경기 성남시 분당구',
          price: 90000,
          date: '2025.05.05',
          time: '14:00',
          requiredPeople: 8,
          currentPeople: 0,
          tags: ['남성우대', '정장여가능', '교통비별도']
        }
      ];
      
      const post = dummyPosts.find(post => post.id === postingId);
      
      if (post) {
        return {
          success: true,
          data: post,
          message: '게시글 정보를 성공적으로 불러왔습니다.'
        };
      } else {
        return {
          success: false,
          data: null,
          message: '해당 게시글을 찾을 수 없습니다.'
        };
      }
    } catch (error) {
      console.error('게시글 상세 조회 오류:', error);
      return {
        success: false,
        data: null,
        message: '게시글 정보를 불러오는데 실패했습니다.'
      };
    }
  },
  
  // 게시글 저장 (찜하기)
  bookmarkPosting: async (postingId: number): Promise<ApiResponse<boolean>> => {
    try {
      // 실제 API 연동 시 아래 코드 사용
      // const response = await axios.post(`/api/bookmarks`, { postingId });
      // return response.data;
      
      // 더미 응답 (API 연동 전까지 사용)
      return {
        success: true,
        data: true,
        message: '게시글을 찜 목록에 추가했습니다.'
      };
    } catch (error) {
      console.error('게시글 찜하기 오류:', error);
      return {
        success: false,
        data: false,
        message: '게시글 찜하기에 실패했습니다.'
      };
    }
  }
};