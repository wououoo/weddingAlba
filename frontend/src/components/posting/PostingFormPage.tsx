import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { PostingRequestDTO } from "./dto/PostingRequestDTO";
import { postingApi } from './api/postingApi';

const PostingFormPage: React.FC = () => {
    const navigate = useNavigate();
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    // 토큰 설정
    useEffect(() => {
        const localToken = localStorage.getItem('authToken');
        const sessionToken = sessionStorage.getItem('authToken');
        const accessToken = localStorage.getItem('accessToken');
        const jwtToken = localStorage.getItem('jwtToken');
        
        const token = localToken || sessionToken || jwtToken;
        if (token && !accessToken) {
        localStorage.setItem('accessToken', token);
        }
    }, []);
    
    // 임금 관련 상태
    const [payType, setPayType] = useState<'hourly' | 'daily'>('hourly'); // 시급 또는 일급
    const [payAmount, setPayAmount] = useState<number>(0); // 임금 금액
    const [startTime, setStartTime] = useState<string>(''); // 근무 시작 시간
    const [endTime, setEndTime] = useState<string>(''); // 근무 종료 시간
    const [totalPay, setTotalPay] = useState<number>(0); // 최종 지급 금액

    // 근무시간 계산 및 최종 지급 금액 계산
    const calculatePay = () => {
        if (!startTime || !endTime || payAmount <= 0) {
            setTotalPay(0);
            return;
        }

        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        
        if (end <= start) {
            setTotalPay(0);
            return;
        }

        const diffInMs = end.getTime() - start.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        let finalPay = 0;
        if (payType === 'hourly') {
            finalPay = Math.round(diffInHours * payAmount);
        } else {
            finalPay = payAmount; // 일급의 경우 시간과 관계없이 고정 금액
        }

        setTotalPay(finalPay);
        
        // formData 업데이트
        const workingHoursText = `${startTime} ~ ${endTime} (${diffInHours.toFixed(1)}시간)`;
        
        setFormData(prev => ({
            ...prev,
            workingHours: workingHoursText,
            payType : payType,
            payAmount: payAmount.toString()
        }));
    };

    // 값 변경 시 자동 계산
    useEffect(() => {
        calculatePay();
    }, [startTime, endTime, payType, payAmount]);

    // 폼 데이터 입력 변경 핸들러
    // 'field'는 변경될 폼 데이터의 키(예: 'title', 'location')이고, 'value'는 새로운 값입니다.
    const handleInputChange = (field: keyof PostingRequestDTO, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 태그 입력 필드에서 키 다운 이벤트 핸들러
    // Enter 또는 쉼표(,)를 누르면 태그를 추가합니다.
    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && tags.length < 5 && !tags.includes(newTag)) {
                const updatedTags = [...tags, newTag];
                setTags(updatedTags);
                setFormData(prev => ({ ...prev, tags: updatedTags }));
                setTagInput('');
            }
        }
    };

    // 태그 제거 핸들러
    // 'tagToRemove'는 제거할 태그 문자열입니다.
    const removeTag = (tagToRemove: string) => {
        const updatedTags = tags.filter(tag => tag !== tagToRemove);
        setTags(updatedTags);
        setFormData(prev => ({ ...prev, tags: updatedTags }));
    };

    // 파일 업로드 핸들러
    // 사용자가 파일을 선택하면 'uploadedFile' 상태를 업데이트합니다.
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    // 폼 데이터 상태
    const [formData, setFormData] = useState<Partial<PostingRequestDTO>>({
        title: '',
        appointmentDatetime: '',
        location: '',
        workingHours: '',
        payAmount: '',
        guestMainRole: '',
        detailContent: '',
        personName: '',
        personPhoneNumber: '',
        hasMobileInvitation: false,
        isSelf: false,
        tags: []
    });

    // 폼 제출 핸들러
    // 폼 유효성을 검사하고, 유효한 경우 폼 데이터를 콘솔에 기록한 후 이전 페이지로 이동합니다.
    const handleSubmit = () => {
        if (!formData.title || !formData.appointmentDatetime  || !startTime || !endTime || payAmount <= 0) {
            alert('필수 항목을 입력해주세요.');
            return;
        }

        console.log('Form Data:', formData);
        postingApi.addPosting(formData);
        // console.log('Pay Info:', {
        //     payType,
        //     payAmount,
        //     startTime,
        //     endTime,
        //     totalPay
        // });
        console.log('Uploaded File:', uploadedFile);

    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* 헤더 */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center">하객알바 모집글 작성</h1>
                </div>
            </div>

            <div className="px-4 py-6 space-y-4">
                {/* 기본 정보 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">기본 정보</h2>

                    {/* 제목 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            제목 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="예: 친구 결혼식 도우미 모집"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* 당사자 여부 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            당사자 여부
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="isSelf"
                                    checked={formData.isSelf === true}
                                    onChange={() => handleInputChange('isSelf', true)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">당사자입니다.</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="isSelf"
                                    checked={formData.isSelf === false}
                                    onChange={() => handleInputChange('isSelf', false)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">대리인입니다.</span>
                            </label>
                        </div>
                    </div>

                    {/* 결혼식 당사자 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                당사자 이름
                            </label>
                            <input
                                type="text"
                                value={formData.personName || ''}
                                onChange={(e) => handleInputChange('personName', e.target.value)}
                                placeholder="당사자 이름을 작성해주세요. 예: 이민수"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                연락처
                            </label>
                            <input
                                type="tel"
                                value={formData.personPhoneNumber || ''}
                                onChange={(e) => handleInputChange('personPhoneNumber', e.target.value)}
                                placeholder="당사자 연락처를 작성해주세요. 예: 010-1234-5678"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* 예식 정보 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">예식 정보</h2>

                    {/* 예식 일시 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            예식 일시 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.appointmentDatetime || ''}
                            onChange={(e) => handleInputChange('appointmentDatetime', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* 결혼식장 주소 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            결혼식장 주소 <span className="text-red-500">*</span>
                        </label>
                        <div className="flex">
                            <input
                                type="text"
                                value={formData.location || ''}
                                readOnly
                                placeholder="예: 서울시 강남구 예식홀 1층"
                                className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => alert('주소 검색 API 연동 예정: 예식장 주소')}
                                className="px-4 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* 모바일 청첩장 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            모바일 청첩장
                        </label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="hasMobileInvitation"
                                    checked={formData.hasMobileInvitation === true}
                                    onChange={() => handleInputChange('hasMobileInvitation', true)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">있음</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="hasMobileInvitation"
                                    checked={formData.hasMobileInvitation === false}
                                    onChange={() => handleInputChange('hasMobileInvitation', false)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">없음</span>
                            </label>
                        </div>

                        {/* 파일 업로드 (모바일 청첩장이 있을 때만) */}
                        {formData.hasMobileInvitation && (
                            <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    청첩장 이미지 업로드
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="invitation-upload"
                                    />
                                    <label htmlFor="invitation-upload" className="cursor-pointer">
                                        {uploadedFile ? (
                                            <div className="text-green-600">
                                                <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <p className="text-sm">{uploadedFile.name}</p>
                                            </div>
                                        ) : (
                                            <div className="text-gray-400">
                                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                <p className="text-sm">클릭하여 이미지 업로드</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 알바 정보 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">알바 정보</h2>

                    {/* 근무 시간 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            근무 시간 <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">시작 시간</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">종료 시간</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        {startTime && endTime && (
                            <div className="mt-2 text-sm text-gray-600">
                                총 근무시간: {(() => {
                                    const start = new Date(`2000-01-01T${startTime}`);
                                    const end = new Date(`2000-01-01T${endTime}`);
                                    if (end > start) {
                                        const diffInMs = end.getTime() - start.getTime();
                                        const diffInHours = diffInMs / (1000 * 60 * 60);
                                        return `${diffInHours.toFixed(1)}시간`;
                                    }
                                    return '시간을 올바르게 입력해주세요';
                                })()}
                            </div>
                        )}
                    </div>

                    {/* 임금 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            임금 <span className="text-red-500">*</span>
                        </label>
                        
                        {/* 일급/시급 선택 */}
                        <div className="flex space-x-4 mb-3">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="payType"
                                    checked={payType === 'hourly'}
                                    onChange={() => setPayType('hourly')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">시급</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="payType"
                                    checked={payType === 'daily'}
                                    onChange={() => setPayType('daily')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">일급</span>
                            </label>
                        </div>

                        {/* 임금 금액 입력 */}
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={payAmount || ''}
                                onChange={(e) => setPayAmount(Number(e.target.value))}
                                placeholder={payType === 'hourly' ? '시급을 입력하세요' : '일급을 입력하세요'}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <span className="ml-2 text-sm text-gray-600">원</span>
                        </div>

                        {/* 최종 지급 금액 표시 */}
                        {totalPay > 0 && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-blue-800">최종 지급 금액</p>
                                        <p className="text-lg font-bold text-blue-900">{totalPay.toLocaleString()}원</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 하객 역할/업무 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            하객 역할/업무
                        </label>
                        <input
                            type="text"
                            value={formData.guestMainRole || ''}
                            onChange={(e) => handleInputChange('guestMainRole', e.target.value)}
                            placeholder="예: 고등학교 동창"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* 상세 내용 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            상세 내용
                        </label>
                        <textarea
                            value={formData.detailContent || ''}
                            onChange={(e) => handleInputChange('detailContent', e.target.value)}
                            placeholder="90년대 초반 여성, MBTI가 E였으면 좋겠습니다."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>
                </div>

                {/* 태그 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">태그</h2>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            태그 추가 (최대 5개)
                        </label>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="태그를 입력하고 Enter 또는 쉼표를 눌러주세요"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={tags.length >= 5}
                        />
                    </div>

                    {/* 태그 목록 */}
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                            >
                                #{tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* 하단 여백 */}
                <div className="h-20"></div>
            </div>

            {/* 하단 고정 버튼 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
                <div className="flex space-x-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={postingSubmit}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        등록하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostingFormPage; 