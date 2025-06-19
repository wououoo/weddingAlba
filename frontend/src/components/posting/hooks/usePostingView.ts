import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postingApi } from '../api/postingApi';
import { PostingResponseDTO } from '../dto';
import { getAccessToken } from '../../../OAuth2/authUtils';

export const usePostingView = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    
    // 상태 관리
    const [isFavorite, setIsFavorite] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [postingData, setPostingData] = useState<PostingResponseDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    // 현재 사용자 ID 추출 (JWT 토큰에서)
    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            try {
                // JWT 토큰에서 사용자 ID 추출 (간단한 방법)
                const payload = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserId(payload.userId || payload.sub);
            } catch (error) {
                console.error('토큰 파싱 오류:', error);
                setCurrentUserId(null);
            }
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
            navigate(`/posting/edit/${id}`);
        }
    };

    // 모집 취소 함수
    const cancelPosting = async () => {
        if (window.confirm('정말로 모집을 취소하시겠습니까?')) {
            try {
                // TODO: 모집 취소 API 호출
                console.log('모집 취소:', id);
                alert('모집이 취소되었습니다.');
                navigate(-1);
            } catch (error) {
                console.error('모집 취소 중 오류 발생:', error);
                alert('모집 취소 중 오류가 발생했습니다.');
            }
        }
    };

    // 현재 사용자가 작성자인지 확인
    const isAuthor = currentUserId && postingData?.userId === currentUserId;

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
        
        // 액션 함수
        toggleFavorite,
        toggleDescription,
        goBack,
        goToUserProfile,
        goToApplyPage,
        goToEditPage,
        cancelPosting
    };
};