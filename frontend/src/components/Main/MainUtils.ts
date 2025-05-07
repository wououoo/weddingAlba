import { PostingItem } from './MainTypes';

// 가격 포맷팅 함수
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

// 더미 데이터 생성 함수
export const generateDummyPostings = (): PostingItem[] => {
  return [
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
};

// API 호출 함수 (실제 구현 시 사용)
export const fetchPostings = async (tab: string = 'all'): Promise<PostingItem[]> => {
  // 실제 API 구현 시 이 부분을 대체
  // const response = await fetch(`/api/postings?tab=${tab}`);
  // return await response.json();
  
  // 더미 데이터 사용
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateDummyPostings());
    }, 300);
  });
};