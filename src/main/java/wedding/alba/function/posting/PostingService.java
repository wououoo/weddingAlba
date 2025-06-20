package wedding.alba.function.posting;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import wedding.alba.entity.Posting;
import wedding.alba.entity.Profile;
import wedding.alba.function.profile.ProfileRepository;

@Service
@Slf4j
public class PostingService {

    @Autowired
    private PostingRepository postingRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private PostingWrapper postingWrapper;

    // 모집글 작성
    public PostingResponseDTO createPosting(PostingRequestDTO postingDto) {
        // dto -> Posting 엔터티로 변경
        Posting posting = postingWrapper.toEntity(postingDto);

        // insert
        Posting responsePosting = postingRepository.save(posting);

        PostingResponseDTO responseDTO = PostingResponseDTO.builder()
                .postingId(responsePosting.getPostingId())
                .build();

        return responseDTO;
    }

    public PostingResponseDTO updatePosting(Long userId, Long postingId, PostingRequestDTO postingDto) {
        // dto -> Posting 엔터티로 변경
        Posting findPosting = postingRepository.findById(postingId)
                .orElseThrow(() -> {
                        log.error("존재하지 않는 모집글 {}  수정 시도", postingId);
                         return new IllegalArgumentException("존재하지 않는 모집글입니다.");
                    });

        // 본인 게시글인지, 수정할려는 게시글이 맞는지 확인
        if(!findPosting.getUserId().equals(userId)) {
            log.warn("사용자 {}가 다른 사용자의 모집글 {} 수정 시도", postingDto.getUserId(), postingId);
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        Posting posting = postingWrapper.toEntity(postingDto);
        posting.setPostingId(postingId);
        Posting updatePosting = postingRepository.save(posting);
        log.info("사용자 {}가  모집글 {} 수정완료",
                updatePosting.getUserId(), updatePosting.getPostingId());

        PostingResponseDTO responseDTO = PostingResponseDTO.builder()
                .postingId(updatePosting.getPostingId())
                .build();
        return responseDTO;
    }


    // 전체 모집글 리스트 조회
    public Page<PostingResponseDTO> getAllPostingList(int page, int size, String address, String guestMainRole) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "registrationDatetime"));
            // 페이징으로 Posting 엔터티 조회
            Page<Posting> postingPage = postingRepository.findPostingPageByKeyword(pageable, LocalDateTime.now(), address,guestMainRole);
            
            // 각 Posting에 대해 프로필 정보와 함께 DTO로 변환
            List<PostingResponseDTO> dtoList = new ArrayList<>();
            for(Posting posting : postingPage.getContent()) {
                Profile profile = profileRepository.findByUserId(posting.getUserId())
                    .orElseThrow(() -> new NoSuchElementException("사용자 프로필을 찾을 수 없습니다. ID: " + posting.getUserId()));
                PostingResponseDTO dto = postingWrapper.toDetailDTO(posting, profile);
                dto.setPayTypeStr();
                dtoList.add(dto);
            }
            
            // Page<PostingResponseDTO>로 변환하여 반환
            return new PageImpl<>(dtoList, pageable, postingPage.getTotalElements());
            
        } catch (Exception e) {
            log.error("페이징 모집글 조회 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("페이징 모집글 조회에 실패했습니다.", e);
        }
    }

    // 상세페이지
    public PostingResponseDTO getPostingDetail(Long postingId) {
        Posting posting = postingRepository.findById(postingId).orElseThrow(() -> new NoSuchElementException("모집글을 찾을 수 없습니다. ID: " + postingId));
        Profile profile = profileRepository.findByUserId(posting.getUserId()).orElseThrow(() -> new NoSuchElementException("사용자 프로필을 찾을 수 없습니다. ID: " + postingId));
        PostingResponseDTO dto = postingWrapper.toDetailDTO(posting, profile);
        dto.setPayTypeStr();
        return dto;
    }

}
