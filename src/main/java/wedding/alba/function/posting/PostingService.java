package wedding.alba.function.posting;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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

    // 내가 작성한 모집글
    public Page<PostingResponseDTO> getPostingPageByUserId(Pageable pageable) {
        try {
            // 페이징으로 Posting 엔터티 조회
            Page<Posting> postingPage = postingRepository.findAll(pageable);
            
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

    public Page<PostingResponseDTO> getPulicPostingPage(Pageable pageable) {
        try {
            // 페이징으로 Posting 엔터티 조회
            Page<Posting> postingPage = postingRepository.findAll(pageable);
            
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
