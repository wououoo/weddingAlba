import React from 'react';
import { useNavigate } from 'react-router-dom';

// 샘플 신고 데이터
const sampleReports = [
  {
    id: 1,
    type: 'posting',
    targetId: 'P12345',
    targetName: '강남 S웨딩홀 하객 구함',
    reason: '허위 정보',
    status: 'pending',
    date: '2025-05-01'
  },
  {
    id: 2,
    type: 'user',
    targetId: 'U67890',
    targetName: '웨딩플래너',
    reason: '부적절한 행동',
    status: 'resolved',
    date: '2025-04-28'
  }
];

const ReportListPage: React.FC = () => {
  const navigate = useNavigate();

  // 신고 상태에 따른 배경색 지정
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 신고 상태 한글로 표시
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '처리중';
      case 'resolved':
        return '해결됨';
      case 'rejected':
        return '거부됨';
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
        <h1 className="text-xl font-bold">신고 목록</h1>
      </div>
      
      {/* 신고 목록 */}
      <div className="flex-1 overflow-auto p-4">
        {sampleReports.length > 0 ? (
          <div className="space-y-4">
            {sampleReports.map((report) => (
              <div key={report.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {report.type === 'posting' ? '모집글 신고' : '유저 신고'}: {report.targetName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {report.type === 'posting' ? '게시글 ID' : '유저 ID'}: {report.targetId}
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-medium">신고 사유:</span> {report.reason}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">신고일:</span> {report.date}
                    </p>
                  </div>
                  <span className={`${getStatusColor(report.status)} px-2 py-1 rounded text-xs`}>
                    {getStatusText(report.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500">신고 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportListPage;