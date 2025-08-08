package wedding.alba.function.review;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wedding.alba.entity.*;
import wedding.alba.function.applying.ApplyingRepository;
import wedding.alba.function.posting.PostingRepository;
import wedding.alba.repository.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 리뷰 서비스
 * 게스트 리뷰와 호스트 리뷰 관련 비즈니스 로직 처리
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ReviewService {

    private final GuestReviewRepository guestReviewRepository;
    private final HostReviewRepository hostReviewRepository;
    private final UserRepository userRepository;
    private final PostingRepository postingRepository;
    private final ApplyingRepository applyingRepository;

    /**
     * 특정 사용자가 받은 게스트 리뷰 목록 조회 (페이징)
     */
    public ReviewListResponseDto getGuestReviews(Long userId, int page, int limit) {
        try {
            // 페이징 설정
            Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());

            // 게스트 리뷰 조회
            Page<GuestReview> reviewPage = guestReviewRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

            // DTO 변환
            List<ReviewResponseDto> reviews = reviewPage.getContent().stream()
                    .map(this::convertGuestReviewToDto)
                    .collect(Collectors.toList());

            return ReviewListResponseDto.builder()
                    .data(reviews)
                    .totalCount(reviewPage.getTotalElements())
                    .hasMore(reviewPage.hasNext())
                    .currentPage(page)
                    .success(true)
                    .message("게스트 리뷰 목록을 성공적으로 조회했습니다.")
                    .build();

        } catch (Exception e) {
            log.error("게스트 리뷰 목록 조회 실패 - userId: {}, error: {}", userId, e.getMessage());
            return ReviewListResponseDto.builder()
                    .data(List.of())
                    .totalCount(0L)
                    .hasMore(false)
                    .currentPage(page)
                    .success(false)
                    .message("게스트 리뷰 목록 조회에 실패했습니다.")
                    .build();
        }
    }

    /**
     * 특정 사용자가 받은 호스트 리뷰 목록 조회 (페이징)
     */
    public ReviewListResponseDto getHostReviews(Long userId, int page, int limit) {
        try {
            // 페이징 설정
            Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());

            // 호스트 리뷰 조회
            Page<HostReview> reviewPage = hostReviewRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

            // DTO 변환
            List<ReviewResponseDto> reviews = reviewPage.getContent().stream()
                    .map(this::convertHostReviewToDto)
                    .collect(Collectors.toList());

            return ReviewListResponseDto.builder()
                    .data(reviews)
                    .totalCount(reviewPage.getTotalElements())
                    .hasMore(reviewPage.hasNext())
                    .currentPage(page)
                    .success(true)
                    .message("호스트 리뷰 목록을 성공적으로 조회했습니다.")
                    .build();

        } catch (Exception e) {
            log.error("호스트 리뷰 목록 조회 실패 - userId: {}, error: {}", userId, e.getMessage());
            return ReviewListResponseDto.builder()
                    .data(List.of())
                    .totalCount(0L)
                    .hasMore(false)
                    .currentPage(page)
                    .success(false)
                    .message("호스트 리뷰 목록 조회에 실패했습니다.")
                    .build();
        }
    }

    /**
     * 게스트 리뷰 카운트 조회
     */
    public ReviewCountResponseDto getGuestReviewCount(Long userId) {
        try {
            long count = guestReviewRepository.countByUserId(userId);

            return ReviewCountResponseDto.builder()
                    .count(count)
                    .success(true)
                    .message("게스트 리뷰 카운트를 성공적으로 조회했습니다.")
                    .build();

        } catch (Exception e) {
            log.error("게스트 리뷰 카운트 조회 실패 - userId: {}, error: {}", userId, e.getMessage());
            return ReviewCountResponseDto.builder()
                    .count(0L)
                    .success(false)
                    .message("게스트 리뷰 카운트 조회에 실패했습니다.")
                    .build();
        }
    }

    /**
     * 호스트 리뷰 카운트 조회
     */
    public ReviewCountResponseDto getHostReviewCount(Long userId) {
        try {
            long count = hostReviewRepository.countByUserId(userId);

            return ReviewCountResponseDto.builder()
                    .count(count)
                    .success(true)
                    .message("호스트 리뷰 카운트를 성공적으로 조회했습니다.")
                    .build();

        } catch (Exception e) {
            log.error("호스트 리뷰 카운트 조회 실패 - userId: {}, error: {}", userId, e.getMessage());
            return ReviewCountResponseDto.builder()
                    .count(0L)
                    .success(false)
                    .message("호스트 리뷰 카운트 조회에 실패했습니다.")
                    .build();
        }
    }

    /**
     * 게스트 리뷰를 DTO로 변환
     */
    private ReviewResponseDto convertGuestReviewToDto(GuestReview guestReview) {
        try {
            // 게스트 사용자 정보 조회
            User guestUser = userRepository.findById(guestReview.getUserId())
                    .orElse(null);

            // 모집글 정보 조회 (없어도 에러 내지 않음)
            Posting posting = postingRepository.findById(guestReview.getPostingId())
                    .orElse(null);

            // 게스트 파워 계산 (평균 점수 기반)
            Double avgScore = guestReviewRepository.findAverageScoreByUserId(guestReview.getUserId());
            int guestPower = avgScore != null ? (int) Math.round(avgScore * 20) : 50; // 1-5점을 20-100점으로 변환

            // 주소 정보 생성 (시도시군구 + 건물명)
            String location = "";
            if (posting != null) {
                location = (posting.getSidoSigungu() != null ? posting.getSidoSigungu() : "") +
                        (posting.getBuildingName() != null ? " " + posting.getBuildingName() : "");
                if (location.trim().isEmpty()) {
                    location = posting.getAddress() != null ? posting.getAddress() : "위치 정보 없음";
                }
            } else {
                location = "위치 정보 없음";
            }

            return ReviewResponseDto.builder()
                    .guestReviewId(guestReview.getGuestReviewId())
                    .applyId(guestReview.getApplyId())
                    .postingId(guestReview.getPostingId())
                    .userId(guestReview.getUserId())
                    .content(guestReview.getContent())
                    .score(guestReview.getScore())
                    .createdAt(guestReview.getCreatedAt())
                    .updatedAt(guestReview.getUpdatedAt())
                    .guestInfo(ReviewResponseDto.GuestInfo.builder()
                            .nickname(guestUser != null ? guestUser.getName() : "게스트")
                            .profileImageUrl(null) // 프로필 이미지는 추후 구현
                            .guestPower(guestPower)
                            .build())
                    .postingInfo(ReviewResponseDto.PostingInfo.builder()
                            .title(posting != null ? posting.getTitle() : "모집글 제목 없음")
                            .appointmentDatetime(posting != null ? posting.getAppointmentDatetime() : null)
                            .location(location)
                            .build())
                    .build();
        } catch (Exception e) {
            log.error("게스트 리뷰 DTO 변환 실패 - reviewId: {}, error: {}", guestReview.getGuestReviewId(), e.getMessage());
            // 에러 발생 시 기본값으로 대체
            return ReviewResponseDto.builder()
                    .guestReviewId(guestReview.getGuestReviewId())
                    .applyId(guestReview.getApplyId())
                    .postingId(guestReview.getPostingId())
                    .userId(guestReview.getUserId())
                    .content(guestReview.getContent())
                    .score(guestReview.getScore())
                    .createdAt(guestReview.getCreatedAt())
                    .updatedAt(guestReview.getUpdatedAt())
                    .guestInfo(ReviewResponseDto.GuestInfo.builder()
                            .nickname("게스트")
                            .profileImageUrl(null)
                            .guestPower(50)
                            .build())
                    .postingInfo(ReviewResponseDto.PostingInfo.builder()
                            .title("모집글 제목 없음")
                            .appointmentDatetime(null)
                            .location("위치 정보 없음")
                            .build())
                    .build();
        }
    }

    /**
     * 호스트 리뷰를 DTO로 변환
     */
    private ReviewResponseDto convertHostReviewToDto(HostReview hostReview) {
        // 호스트 사용자 정보 조회
        User hostUser = userRepository.findById(hostReview.getUserId())
                .orElseThrow(() -> new RuntimeException("호스트 사용자를 찾을 수 없습니다."));

        // 모집글 정보 조회
        Posting posting = postingRepository.findById(hostReview.getPostingId())
                .orElseThrow(() -> new RuntimeException("모집글을 찾을 수 없습니다."));

        // 호스트 파워 계산 (평균 점수 기반)
        Double avgScore = hostReviewRepository.findAverageScoreByUserId(hostReview.getUserId());
        int hostPower = avgScore != null ? (int) Math.round(avgScore * 20) : 50; // 1-5점을 20-100점으로 변환

        // 주소 정보 생성
        String location = (posting.getSidoSigungu() != null ? posting.getSidoSigungu() : "") +
                (posting.getBuildingName() != null ? " " + posting.getBuildingName() : "");
        if (location.trim().isEmpty()) {
            location = posting.getAddress() != null ? posting.getAddress() : "위치 정보 없음";
        }

        return ReviewResponseDto.builder()
                .hostReviewId(hostReview.getHostReviewId())
                .applyId(hostReview.getApplyId())
                .postingId(hostReview.getPostingId())
                .userId(hostReview.getUserId())
                .content(hostReview.getContent())
                .score(hostReview.getScore())
                .createdAt(hostReview.getCreatedAt())
                .updatedAt(hostReview.getUpdatedAt())
                .hostInfo(ReviewResponseDto.HostInfo.builder()
                        .nickname(hostUser.getName())
                        .profileImageUrl(null) // 프로필 이미지는 추후 구현
                        .hostPower(hostPower)
                        .build())
                .postingInfo(ReviewResponseDto.PostingInfo.builder()
                        .title(posting.getTitle())
                        .appointmentDatetime(posting.getAppointmentDatetime())
                        .location(location)
                        .build())
                .build();
    }

    /**
     * 게스트 리뷰 생성
     */
    @Transactional
    public ReviewResponseDto createGuestReview(ReviewRequestDto requestDto) {
        try {
            // 신청 정보 조회
            Applying applying = applyingRepository.findById(requestDto.getApplyId())
                    .orElseThrow(() -> new RuntimeException("신청 정보를 찾을 수 없습니다."));

            // 이미 리뷰가 작성되었는지 확인
            if (guestReviewRepository.existsByApplyId(requestDto.getApplyId())) {
                throw new RuntimeException("이미 해당 신청에 대한 리뷰가 작성되었습니다.");
            }

            // 게스트 리뷰 생성
            GuestReview guestReview = GuestReview.builder()
                    .applyId(requestDto.getApplyId())
                    .postingId(requestDto.getPostingId())
                    .userId(requestDto.getUserId())
                    .content(requestDto.getContent())
                    .score(requestDto.getScore())
                    .build();

            GuestReview savedReview = guestReviewRepository.save(guestReview);

            return convertGuestReviewToDto(savedReview);

        } catch (Exception e) {
            log.error("게스트 리뷰 생성 실패 - applyId: {}, error: {}", requestDto.getApplyId(), e.getMessage());
            throw new RuntimeException("게스트 리뷰 생성에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 호스트 리뷰 생성
     */
    @Transactional
    public ReviewResponseDto createHostReview(ReviewRequestDto requestDto) {
        try {
            // 신청 정보 조회
            Applying applying = applyingRepository.findById(requestDto.getApplyId())
                    .orElseThrow(() -> new RuntimeException("신청 정보를 찾을 수 없습니다."));

            // 이미 리뷰가 작성되었는지 확인
            if (hostReviewRepository.existsByApplyId(requestDto.getApplyId())) {
                throw new RuntimeException("이미 해당 신청에 대한 리뷰가 작성되었습니다.");
            }

            // 호스트 리뷰 생성
            HostReview hostReview = HostReview.builder()
                    .applyId(requestDto.getApplyId())
                    .postingId(requestDto.getPostingId())
                    .userId(requestDto.getUserId())
                    .content(requestDto.getContent())
                    .score(requestDto.getScore())
                    .build();

            HostReview savedReview = hostReviewRepository.save(hostReview);

            return convertHostReviewToDto(savedReview);

        } catch (Exception e) {
            log.error("호스트 리뷰 생성 실패 - applyId: {}, error: {}", requestDto.getApplyId(), e.getMessage());
            throw new RuntimeException("호스트 리뷰 생성에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 리뷰 작성 가능 여부 확인
     */
    public boolean checkReviewWritable(Long applyId, String reviewType) {
        try {
            if ("guest".equalsIgnoreCase(reviewType)) {
                return !guestReviewRepository.existsByApplyId(applyId);
            } else if ("host".equalsIgnoreCase(reviewType)) {
                return !hostReviewRepository.existsByApplyId(applyId);
            } else {
                throw new IllegalArgumentException("올바르지 않은 리뷰 타입입니다: " + reviewType);
            }
        } catch (Exception e) {
            log.error("리뷰 작성 가능 여부 확인 실패 - applyId: {}, reviewType: {}, error: {}", applyId, reviewType, e.getMessage());
            return false;
        }
    }

}
