import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postingApi } from '../api/postingApi';
import { PostingResponseDTO } from '../dto';
import { getAccessToken } from '../../../OAuth2/authUtils';
import { useToast } from '../../common/toast/useToast';

// 쿠키에서 값을 가져오는 유틸리티 함수
const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
};

export const usePostingView = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { toastState, showToast, hideToast } = useToast();
    
    // 상태 관리
    const [isFavorite, setIsFavorite] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [postingData, setPostingData] = useState<PostingResponseDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    // 현재 사용자 ID 추출 (JWT 토큰에서)
    useEffect(() => {
        // 먼저 localStorage에서 토큰 확인
        let token = getAccessToken();
        
        // localStorage에 토큰이 없으면 쿠키에서 확인
        if (!token) {
            token = getCookie('refreshToken'); // 쿠키에서 refreshToken 가져오기
        }
        
        if (token) {
            try {
                // JWT 토큰에서 사용자 ID 추출
                const payload = JSON.parse(atob(token.split('.')[1]));
                const extractedUserId = payload.userId || payload.sub;
                
                // 숫자로 변환 시도
                const numericUserId = typeof extractedUserId === 'string' ? parseInt(extractedUserId, 10) : extractedUserId;
                
                setCurrentUserId(numericUserId);
            } catch (error) {
                setCurrentUserId(null);
            }
        } else {
            console.log('토큰을 찾을 수 없습니다.');
            setCurrentUserId(null);
        }
    }, []);

    // 게시물 데이터 가져오기
    useEffect(() => {
        if (id) {
            const fetchPosting = async () => {
                try {
                    setIsLoading(true);
                    const response = await postingApi.getPostingDetail(id);

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
    }, [id]);

    // 찜하기 토글 함수 
    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
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
        navigate('/applying/create');
    };

    // 수정 페이지로 이동
    const goToEditPage = () => {
        if (id) {
            navigate(`/posting/edit/${postingData?.postingId}`);
        }
    };

    // 모집 취소 함수
    const cancelPosting = async () => {
        // 먼저 확인 Toast 표시
        showToast('정말로 모집을 취소하시겠습니까?', '취소하기', async () => {
            try {
                // TODO: 모집 취소 API 호출
                const postingId = id ? parseInt(id, 10) : 0;
                postingApi.deletePosting(postingId);
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

    // 현재 사용자가 작성자인지 확인 (타입을 통일하여 비교)
    const isAuthor = useMemo(() => {
        if (!currentUserId || !postingData?.userId) {
            return false;
        }
        
        // 둘 다 숫자로 변환하여 비교
        const currentUserIdNum = typeof currentUserId === 'string' ? parseInt(currentUserId, 10) : currentUserId;
        const postingUserIdNum = typeof postingData.userId === 'string' ? parseInt(postingData.userId, 10) : postingData.userId;
        
        return currentUserIdNum === postingUserIdNum;
    }, [currentUserId, postingData?.userId]);
    

    // 게시글 삭제 함수
    const deletePosting = async (postingId: number) => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                const response = await postingApi.deletePosting(postingId);
                if (response.success) {
                    alert('게시글이 삭제되었습니다.');
                    navigate('/posting/list'); // 게시글 목록 페이지로 이동
                } else {
                    alert('게시글 삭제에 실패했습니다.');
                }
            } catch (error) {
                console.error('게시글 삭제 중 오류 발생:', error);
                alert('게시글 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    return {
        // 상태
        postingData,
        isFavorite,
        showFullDescription,
        isLoading,
        isAuthor,
        currentUserId,
        
        // Toast 상태
        toastState,
        hideToast,
        
        // 액션 함수
        toggleFavorite,
        toggleDescription,
        goBack,
        goToUserProfile,
        goToApplyPage,
        goToEditPage,
        cancelPosting,
        deletePosting
    };
};