import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { postingApi } from '../api/postingApi';
import { PostingResponseDTO } from '../dto';
import { getUserIdFromToken } from '../../../OAuth2/authUtils';
import { useToast } from '../../common/toast/useToast';
import { bookmarksApi } from '../../profile/api/bookmarksApi';

export const usePostingView = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { toastState, showToast, hideToast } = useToast();
    
    // URL로 모집글 타입 구분 (history 경로인지 확인)
    const isHistoryType = location.pathname.includes('/post/history/');
    
    // 상태 관리
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [currentBookmarkId, setCurrentBookmarkId] = useState<number | null>(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [userApplyingId, setUserApplyingId] = useState<number | null>(null);
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

    const [showFullDescription, setShowFullDescription] = useState(false);
    const [postingData, setPostingData] = useState<PostingResponseDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    // 현재 사용자 ID 추출 (JWT 토큰에서)
    useEffect(() => {
        const userId = getUserIdFromToken();
        setCurrentUserId(userId);
    }, []);

    // 게시물 데이터 가져오기 (타입에 따라 다른 API 호출)
    useEffect(() => {
        if (id) {
            const fetchPosting = async () => {
                try {
                    setIsLoading(true);
                    let response;
                    
                    if (isHistoryType) {
                        // 모집이력 API 호출 (새로운 API)
                        response = await postingApi.getPostingHistoryDetail(id);
                    } else {
                        // 일반 모집글 API 호출 (기존 API)
                        response = await postingApi.getPostingDetail(id);
                    }

                    if (response.success && response.data) {
                        setPostingData(response.data as PostingResponseDTO);
                    } else {
                        console.error("Failed to fetch posting detail:", response.message);
                        setPostingData(null);
                    }
                } catch (error) {
                    console.error("Error fetching posting data:", error);
                    setPostingData(null);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchPosting();
        }
    }, [id, isHistoryType]);


    // 현재 사용자가 작성자인지 확인 (타입을 통일하여 비교)
    const isAuthor = useMemo(() => {
        if (!currentUserId || !postingData?.userId) {
            return false;
        }
        
        return currentUserId === postingData.userId;
    }, [currentUserId, postingData?.userId]);

    // 사용자의 신청, 북마크 여부 확인 (모집이력이 아닌 경우만)
    useEffect(() => {
        if (postingData?.postingId && currentUserId && !isAuthor && !isHistoryType) {
            const checkPostingStatus = async () => {
                try {
                    const response = await postingApi.checkPostingStatus(postingData?.postingId);
                    if (response.success && response.data) {
                        setHasApplied(response.data.isApplied);
                        setUserApplyingId(response.data.applyingId);
                        setIsBookmarked(response.data.isBookmarked);
                        setCurrentBookmarkId(response.data.bookmarkId);
                    }   
                } catch (error) {
                    console.error("Error checking posting status:", error);
                }
            };
            checkPostingStatus();
        }
    }, [postingData?.postingId, currentUserId, isAuthor, isHistoryType]);

    
    // 북마크 토글 함수 - API 연결
    const toggleBookmark = async () => {
        // 로딩 중이면 중복 실행 방지
        if (isBookmarkLoading) {
            console.log('북마크 처리 중... 중복 클릭 무시');
            return;
        }
        
        if (!postingData?.postingId) {
            showToast('게시물 정보를 불러오는 중입니다.');
            return;
        }

        setIsBookmarkLoading(true); // 로딩 시작

        try {
            if (isBookmarked && currentBookmarkId) {
                // 북마크 삭제
                const response = await bookmarksApi.deleteBookmark(currentBookmarkId);
                
                if (response.success) {
                    setIsBookmarked(false);
                    setCurrentBookmarkId(null);
                    showToast('북마크가 해제되었습니다.');
                } else {
                    showToast('북마크 해제에 실패했습니다.');
                }
            } else {
                // 북마크 추가
                const response = await bookmarksApi.createBookmark({
                    postingId: postingData.postingId
                });
                
                if (response.success && response.data) {
                    const newBookmarkId = response.data.bookmarkId;
                    setIsBookmarked(true);
                    setCurrentBookmarkId(newBookmarkId);
                    console.log('새로운 북마크 ID:', newBookmarkId);
                    showToast('북마크가 추가되었습니다.');
                } else {
                    showToast('북마크 추가에 실패했습니다.');
                }
            }
        } catch (error) {
            console.error('북마크 토글 중 오류 발생:', error);
            showToast('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsBookmarkLoading(false); // 로딩 종료
        }
    };

    // 상세 설명 토글 함수
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    // 뒤로가기 함수
    const goBack = () => {
        navigate(-1);
    };

    // 프로필 페이지로 이동
    const goToUserProfile = (userId: number) => {
        navigate(`/user/${userId}`);
    };

    // 신청 페이지로 이동
    const goToApplyPage = () => {
        navigate(`/applying/create/${postingData?.postingId}`);
    };

    // 신청글 확인하기 페이지로 이동
    const goToApplyingDetail = () => {
        if (userApplyingId) {
            navigate(`/applying/${userApplyingId}`);
        }
    };

    // 수정 페이지로 이동
    const goToEditPage = () => {
        if (id) {
            navigate(`/posting/edit/${postingData?.postingId}`);
        }
    };

    const goToApplicantManage = () => {
        if (id) {
            navigate(`/posting/${id}/applicants`);
        }
    };

    // 모집 취소 함수
    const cancelPosting = async () => {
        showToast('정말로 모집을 취소하시겠습니까?', '취소하기', async () => {
            try {
                // TODO: 모집 취소 API 호출
                const postingId = id ? parseInt(id, 10) : 0;
                postingApi.cancelPosting(postingId);
                hideToast(); // 확인 Toast 닫기
                showToast('모집이 취소되었습니다.');
                
                // 잠시 후 페이지 이동
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            } catch (error) {
                console.error('모집 취소 중 오류 발생:', error);
                hideToast();
                showToast('모집 취소 중 오류가 발생했습니다.');
            }
        });
    };

    return {
        // 상태
        postingData,
        isBookmarked,
        isBookmarkLoading,
        showFullDescription,
        isLoading,
        isAuthor,
        currentUserId,
        hasApplied,
        userApplyingId,
        isHistoryType, // 모집이력 타입 여부 추가
        
        // Toast 상태
        toastState,
        hideToast,
        
        // 액션 함수
        toggleBookmark,
        toggleDescription,
        goBack,
        goToUserProfile,
        goToApplyPage,
        goToApplyingDetail,
        goToEditPage,
        goToApplicantManage,
        cancelPosting
    };
};