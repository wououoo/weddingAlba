import React from 'react';
import { useNavigate } from 'react-router-dom';

// 샘플 모집 데이터
const sampleRecruitments = [
  {
    id: 1,
    title: '강남 S웨딩홀 하객 구함',
    date: '2025-05-15',
    time: '13:00',
    location: '서울 강남구',
    payment: '100,000원',
    applicantCount: 3,
    status: 'active',
    createdAt: '2025-05-01'
  },
  {
    id: 2,
    title: '송파 L호텔 하객 급구',
    date: '2025-04-28',
    time: '11:30',
    location: '서울 송파구',
    payment: '120,000원',
    applicantCount: 5,
    status: 'completed',
    createdAt: '2025-04-15'
  },
  {
    id: 3,
    title: '분당 P컨벤션 하객 모집',
    date: '2025-06-20',
    time: '14:00',
    location: '경기 성남시 분당구',
    payment: '90,000원',
    applicantCount: 1,
    status: 'expired',
    createdAt: '2025-04-28'
  }
];

const RecruitmentListPage: React.FC = () => {
  const navigate = useNavigate();

  // 모집 상태에 따른 배경색 지정
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 모집 상태 한글로 표시
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '모집중';
      case 'completed':
        return '완료됨';
      case 'expired':
        return '만료됨';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <button onClick={() => navigate('/settings', { replace: true })} className="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">모집 목록</h1>
      </div>
      
      {/* 필터 버튼 */}
      <div className="p-4 flex space-x-2 overflow-x-auto">
        <button className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm whitespace-nowrap">
          전체
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm whitespace-nowrap">
          모집중
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm whitespace-nowrap">
          완료됨
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm whitespace-nowrap">
          만료됨
        </button>
      </div>
      
      {/* 모집 목록 */}
      <div className="flex-1 overflow-auto p-4">
        {sampleRecruitments.length > 0 ? (
          <div className="space-y-4">
            {sampleRecruitments.map((recruitment) => (
              <div key={recruitment.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{recruitment.title}</h3>
                    <p className="text-sm text-gray-500">
                      {recruitment.date} {recruitment.time} • {recruitment.location}
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-medium">보수:</span> {recruitment.payment}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">신청자:</span> {recruitment.applicantCount}명
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">등록일:</span> {recruitment.createdAt}
                    </p>
                  </div>
                  <span className={`${getStatusColor(recruitment.status)} px-2 py-1 rounded text-xs`}>
                    {getStatusText(recruitment.status)}
                  </span>
                </div>
                
                {/* 버튼 그룹 */}
                <div className="mt-3 flex justify-end space-x-2">
                  <button className="text-blue-600 text-sm">신청자 보기</button>
                  {recruitment.status === 'active' && (
                    <button className="text-red-600 text-sm">마감하기</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500">모집 내역이 없습니다.</p>
          </div>
        )}
      </div>
      
      {/* 새 모집글 등록 버튼 */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium">
          새 모집글 등록하기
        </button>
      </div>
    </div>
  );
};

export default RecruitmentListPage;