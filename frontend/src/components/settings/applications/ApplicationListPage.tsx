import React from 'react';
import { useNavigate } from 'react-router-dom';

// 샘플 신청 데이터
const sampleApplications = [
  {
    id: 1,
    postingTitle: '강남 S웨딩홀 하객 구함',
    date: '2025-05-15',
    time: '13:00',
    location: '서울 강남구',
    payment: '100,000원',
    status: 'pending',
    appliedAt: '2025-05-01'
  },
  {
    id: 2,
    postingTitle: '송파 L호텔 하객 급구',
    date: '2025-04-28',
    time: '11:30',
    location: '서울 송파구',
    payment: '120,000원',
    status: 'approved',
    appliedAt: '2025-04-20'
  },
  {
    id: 3,
    postingTitle: '분당 P컨벤션 하객 모집',
    date: '2025-05-05',
    time: '14:00',
    location: '경기 성남시 분당구',
    payment: '90,000원',
    status: 'rejected',
    appliedAt: '2025-04-28'
  }
];

const ApplicationListPage: React.FC = () => {
  const navigate = useNavigate();

  // 신청 상태에 따른 배경색 지정
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 신청 상태 한글로 표시
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기중';
      case 'approved':
        return '승인됨';
      case 'rejected':
        return '거절됨';
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
        <h1 className="text-xl font-bold">신청 목록</h1>
      </div>
      
      {/* 필터 버튼 */}
      <div className="p-4 flex space-x-2 overflow-x-auto">
        <button className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm whitespace-nowrap">
          전체
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm whitespace-nowrap">
          대기중
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm whitespace-nowrap">
          승인됨
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm whitespace-nowrap">
          거절됨
        </button>
      </div>
      
      {/* 신청 목록 */}
      <div className="flex-1 overflow-auto p-4">
        {sampleApplications.length > 0 ? (
          <div className="space-y-4">
            {sampleApplications.map((application) => (
              <div key={application.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{application.postingTitle}</h3>
                    <p className="text-sm text-gray-500">
                      {application.date} {application.time} • {application.location}
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-medium">보수:</span> {application.payment}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">신청일:</span> {application.appliedAt}
                    </p>
                  </div>
                  <span className={`${getStatusColor(application.status)} px-2 py-1 rounded text-xs`}>
                    {getStatusText(application.status)}
                  </span>
                </div>
                
                {/* 취소 버튼 (대기중일 때만 표시) */}
                {application.status === 'pending' && (
                  <div className="mt-3 text-right">
                    <button className="text-red-600 text-sm">신청 취소</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500">신청 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationListPage;