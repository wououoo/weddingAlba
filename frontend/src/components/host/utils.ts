// utils.ts - 유틸리티 함수

// 가격 포맷팅 함수
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

// 날짜 포맷팅 함수
export const formatDate = (dateString: string): string => {
  // 'YYYY.MM.DD' 형식의 날짜를 Date 객체로 변환
  const parts = dateString.split('.');
  if (parts.length !== 3) return dateString;
  
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // 월은 0부터 시작
  const day = parseInt(parts[2]);
  
  const date = new Date(year, month, day);
  
  // 요일 추가
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = days[date.getDay()];
  
  return `${dateString} (${dayOfWeek})`;
};