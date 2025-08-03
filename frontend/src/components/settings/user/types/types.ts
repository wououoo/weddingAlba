// types.ts - 컴포넌트에서 사용되는 타입 정의

// 날짜 선택기 Props 타입 정의
export interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  initialYear?: number;
  initialMonth?: number;
  initialDay?: number;
}

// 생년월일 분해 타입
export interface BirthDateParts {
  year: number;
  month: number;
  day: number;
}

// 성별 옵션 타입
export interface GenderOption {
  value: string;
  label: string;
}
