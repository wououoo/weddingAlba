import React from 'react';

interface SearchAndFilterProps {
    searchKeyword: string;
    setSearchKeyword: (keyword: string) => void;
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
    resultCount?: number;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    searchKeyword,
    setSearchKeyword,
    selectedStatus,
    setSelectedStatus,
    resultCount
}) => {
    return (
        <div className="bg-white px-4 py-6">
            <h1 className="text-center text-xl font-bold text-gray-900 mb-4">
                내 모집글 관리
            </h1>
            
            {/* 검색 및 필터 */}
            <div className="flex flex-row gap-4 justify-center items-center max-w-4xl mx-auto">
                {/* 검색 입력창 */}
                <div className="relative w-full max-w-md group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="모집글 제목 또는 지역으로 검색..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="block w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                    {searchKeyword && (
                        <button
                            onClick={() => setSearchKeyword("")}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200"
                        >
                            <svg className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    )}
                </div>

                {/* 상태 필터 */}
                <div className="relative group">
                    <select 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-6 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 min-w-[140px]"
                    >
                        <option value="전체">전체 상태</option>
                        <option value="pending">모집중</option>
                        <option value="approved">모집확정</option>
                        <option value="rejected">모집취소</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* 검색 결과 개수 표시 */}
            {searchKeyword && resultCount !== undefined && (
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full inline-block shadow-sm">
                        <span className="font-medium text-blue-600">"{searchKeyword}"</span> 검색 결과: <span className="font-semibold">{resultCount}개</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchAndFilter;