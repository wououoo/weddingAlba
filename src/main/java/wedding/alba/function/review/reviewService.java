package wedding.alba.function.review;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import wedding.alba.entity.GuestReview;
import wedding.alba.entity.HostReview;
import wedding.alba.entity.Posting;
import wedding.alba.entity.Applying;
import wedding.alba.entity.User;
import wedding.alba.entity.ProfileGallery;
import wedding.alba.repository.GuestReviewRepository;
import wedding.alba.repository.HostReviewRepository;
import wedding.alba.repository.PostingRepository;
import wedding.alba.repository.ApplyingRepository;
import wedding.alba.repository.UserRepository;
import wedding.alba.repository.ProfileGalleryRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class reviewService {

    private final GuestReviewRepository guestReviewRepository;
    private final HostReviewRepository hostReviewRepository;
    private final PostingRepository postingRepository;
    private final UserRepository userRepository;
    private final ApplyingRepository applyingRepository;
    private final ProfileGalleryRepository profileGalleryRepository;

    /**
     * 게스트 리뷰 목록 조회 (특정 사용자가 받은 리뷰)
     */
    public reviewResponseDto.ReviewListResponse<reviewResponseDto.GuestReviewResponse> getGuestReviews(
            Long userId, Integer page, Integer limit) {
        
        // 페이징 설정 (최신순 정렬)
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        
        // 전체 데이터 조회 (실제로는 Page 객체를 사용하는 것이 더 효율적)
        List<GuestReview> allReviews = guestReviewRepository.findByUserId(userId);
        Long totalCount = (long) allReviews.size();
        
        // 페이징 처리
        int startIndex = (page - 1) * limit;
        int endIndex = Math.min(startIndex + limit, allReviews.size());
        
        List<GuestReview> pagedReviews = allReviews.subList(startIndex, endIndex);
        
        // DTO 변환
        List<reviewResponseDto.GuestReviewResponse> responseList = pagedReviews.stream()
                .map(this::convertToGuestReviewResponse)
                .collect(Collectors.toList());
        
        // 더 있는지 확인
        boolean hasMore = endIndex < allReviews.size();
        
        return reviewResponseDto.ReviewListResponse.<reviewResponseDto.GuestReviewResponse>builder()
                .data(responseList)
                .totalCount(totalCount)
                .hasMore(hasMore)
                .currentPage(page)
                .build();
    }

    /**
     * 호스트 리뷰 목록 조회 (특정 사용자가 받은 리뷰)
     */
    public reviewResponseDto.ReviewListResponse<reviewResponseDto.HostReviewResponse> getHostReviews(
            Long userId, Integer page, Integer limit) {
        
        // 페이징 설정 (최신순 정렬)
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        
        // 전체 데이터 조회
        List<HostReview> allReviews = hostReviewRepository.findByUserId(userId);
        Long totalCount = (long) allReviews.size();
        
        // 페이징 처리
        int startIndex = (page - 1) * limit;
        int endIndex = Math.min(startIndex + limit, allReviews.size());
        
        List<HostReview> pagedReviews = allReviews.subList(startIndex, endIndex);
        
        // DTO 변환
        List<reviewResponseDto.HostReviewResponse> responseList = pagedReviews.stream()
                .map(this::convertToHostReviewResponse)
                .collect(Collectors.toList());
        
        // 더 있는지 확인
        boolean hasMore = endIndex < allReviews.size();
        
        return reviewResponseDto.ReviewListResponse.<reviewResponseDto.HostReviewResponse>builder()
                .data(responseList)
                .totalCount(totalCount)
                .hasMore(hasMore)
                .currentPage(page)
                .build();
    }

    /**
     * 게스트 리뷰 개수 조회
     */
    public reviewResponseDto.ReviewCountResponse getGuestReviewCount(Long userId) {
        List<GuestReview> reviews = guestReviewRepository.findByUserId(userId);
        return reviewResponseDto.ReviewCountResponse.builder()
                .count((long) reviews.size())
                .build();
    }

    /**
     * 호스트 리뷰 개수 조회
     */
    public reviewResponseDto.ReviewCountResponse getHostReviewCount(Long userId) {
        List<HostReview> reviews = hostReviewRepository.findByUserId(userId);
        return reviewResponseDto.ReviewCountResponse.builder()
                .count((long) reviews.size())
                .build();
    }

    /**
     * GuestReview 엔티티를 GuestReviewResponse DTO로 변환
     */
    private reviewResponseDto.GuestReviewResponse convertToGuestReviewResponse(GuestReview guestReview) {
        // 신청 정보를 통해 실제 게스트(신청자) 정보 조회
        Applying applying = applyingRepository.findById(guestReview.getApplyId()).orElse(null);
        User guestUser = null;
        if (applying != null) {
            guestUser = userRepository.findById(applying.getUserId()).orElse(null);
        }
        
        // 포스팅 정보 조회
        Posting posting = postingRepository.findById(guestReview.getPostingId()).orElse(null);
        
        // 디버깅을 위한 로그 추가
        log.debug("GuestReview 변환 - ApplyId: {}, Guest UserId: {}, PostingId: {}, Guest found: {}, Posting found: {}", 
                guestReview.getApplyId(), applying != null ? applying.getUserId() : "null", guestReview.getPostingId(), 
                guestUser != null, posting != null);
        
        return reviewResponseDto.GuestReviewResponse.builder()
                .guestReviewId(guestReview.getGuestReviewId())
                .applyId(guestReview.getApplyId())
                .postingId(guestReview.getPostingId())
                .userId(guestReview.getUserId())
                .content(guestReview.getContent())
                .score(guestReview.getScore())
                .createdAt(guestReview.getCreatedAt())
                .updatedAt(guestReview.getUpdatedAt())
                .guestInfo(buildGuestInfo(guestUser))
                .postingInfo(buildPostingInfo(posting))
                .build();
    }

    /**
     * HostReview 엔티티를 HostReviewResponse DTO로 변환
     */
    private reviewResponseDto.HostReviewResponse convertToHostReviewResponse(HostReview hostReview) {
        // 포스팅 정보를 통해 실제 호스트(모집자) 정보 조회
        Posting posting = postingRepository.findById(hostReview.getPostingId()).orElse(null);
        User hostUser = null;
        if (posting != null) {
            hostUser = userRepository.findById(posting.getUserId()).orElse(null);
        }
        
        // 디버깅을 위한 로그 추가
        log.debug("HostReview 변환 - PostingId: {}, Host UserId: {}, Host found: {}, Posting found: {}", 
                hostReview.getPostingId(), posting != null ? posting.getUserId() : "null", 
                hostUser != null, posting != null);
        
        return reviewResponseDto.HostReviewResponse.builder()
                .hostReviewId(hostReview.getHostReviewId())
                .applyId(hostReview.getApplyId())
                .postingId(hostReview.getPostingId())
                .userId(hostReview.getUserId())
                .content(hostReview.getContent())
                .score(hostReview.getScore())
                .createdAt(hostReview.getCreatedAt())
                .updatedAt(hostReview.getUpdatedAt())
                .hostInfo(buildHostInfo(hostUser))
                .postingInfo(buildPostingInfo(posting))
                .build();
    }

    /**
     * 게스트 정보 생성 (메인 프로필 이미지 포함)
     */
    private reviewResponseDto.GuestInfo buildGuestInfo(User user) {
        if (user == null) {
            return reviewResponseDto.GuestInfo.builder()
                    .nickname("알 수 없음")
                    .profileImageUrl(null)
                    .guestPower(0)
                    .build();
        }
        
        // 메인 프로필 이미지 조회
        String profileImageUrl = null;
        try {
            ProfileGallery mainImage = profileGalleryRepository.findByUserIdAndIsMainTrue(user.getUserId()).orElse(null);
            if (mainImage != null) {
                profileImageUrl = mainImage.getImageUrl();
            }
        } catch (Exception e) {
            log.debug("프로필 이미지 조회 오류: {}", e.getMessage());
        }
        
        return reviewResponseDto.GuestInfo.builder()
                .nickname(user.getName() != null ? user.getName() : "알 수 없음")
                .profileImageUrl(profileImageUrl)
                .guestPower(85) // 실제로는 계산된 게스트 파워를 가져와야 함
                .build();
    }

    /**
     * 호스트 정보 생성 (메인 프로필 이미지 포함)
     */
    private reviewResponseDto.HostInfo buildHostInfo(User user) {
        if (user == null) {
            return reviewResponseDto.HostInfo.builder()
                    .nickname("알 수 없음")
                    .profileImageUrl(null)
                    .hostPower(0)
                    .build();
        }
        
        // 메인 프로필 이미지 조회
        String profileImageUrl = null;
        try {
            ProfileGallery mainImage = profileGalleryRepository.findByUserIdAndIsMainTrue(user.getUserId()).orElse(null);
            if (mainImage != null) {
                profileImageUrl = mainImage.getImageUrl();
            }
        } catch (Exception e) {
            log.debug("프로필 이미지 조회 오류: {}", e.getMessage());
        }
        
        return reviewResponseDto.HostInfo.builder()
                .nickname(user.getName() != null ? user.getName() : "알 수 없음")
                .profileImageUrl(profileImageUrl)
                .hostPower(90) // 실제로는 계산된 호스트 파워를 가져와야 함
                .build();
    }

    /**
     * 포스팅 정보 생성
     */
    private reviewResponseDto.PostingInfo buildPostingInfo(Posting posting) {
        if (posting == null) {
            return reviewResponseDto.PostingInfo.builder()
                    .title("알 수 없음")
                    .appointmentDatetime(null)
                    .location("알 수 없음")
                    .build();
        }
        
        // 위치 정보 조합
        String location = "";
        if (posting.getSidoSigungu() != null) {
            location += posting.getSidoSigungu();
        }
        if (posting.getBuildingName() != null) {
            location += " " + posting.getBuildingName();
        }
        if (location.isEmpty() && posting.getAddress() != null) {
            location = posting.getAddress();
        }
        
        return reviewResponseDto.PostingInfo.builder()
                .title(posting.getTitle() != null ? posting.getTitle() : "알 수 없음")
                .appointmentDatetime(posting.getAppointmentDatetime())
                .location(location.trim())
                .build();
    }
}
