import React from 'react';

interface BookmarkMemoModalProps {
  editingMemo: { bookmarkId: number; memo: string };
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onChange: (memo: string) => void;
  onDelete?: () => void; // 메모 삭제 기능 추가
}

const BookmarkMemoModal: React.FC<BookmarkMemoModalProps> = ({
  editingMemo,
  isSaving,
  onSave,
  onCancel,
  onChange,
  onDelete
}) => {
  const handleDelete = () => {
    // 확인 없이 바로 텍스트만 비우기
    onChange('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {editingMemo.memo ? '북마크 메모 수정' : '북마크 메모 추가'}
          </h3>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            disabled={isSaving}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <textarea
            value={editingMemo.memo}
            onChange={(e) => onChange(e.target.value)}
            placeholder="메모를 입력하세요... (예: 친구 결혼식, 꼭 참석하고 싶어요!)"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={500}
            autoFocus
            disabled={isSaving}
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {editingMemo.memo.length}/500
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between items-center">
          <div>
            {/* 메모가 있을 때만 전체 비우기 버튼 표시 */}
            {editingMemo.memo && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                disabled={isSaving}
                title="텍스트 전체 비우기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                전체 비우기
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSaving}
            >
              취소
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  저장 중...
                </>
              ) : (
                '저장'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkMemoModal;