package wedding.alba.function.posting;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wedding.alba.entity.Posting;
import wedding.alba.entity.Profile;
import wedding.alba.function.profile.ProfileRepository;
import wedding.alba.repository.UserRepository;

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

    public List<PostingResponseDTO> getPostingAllList() {
        List<Posting> postings = postingRepository.findAll();
        return postingWrapper.toResponseDTOList(postings);
    }

    // 상세페이지 
    public PostingResponseDTO getPostingDetail(Long postingId) {
        Posting posting = postingRepository.findById(postingId).orElseThrow(() -> new NoSuchElementException("모집글을 찾을 수 없습니다. ID: " + postingId));
        Profile profile = profileRepository.findByUserId(posting.getUserId()).orElseThrow(() -> new NoSuchElementException("사용자 프로필을 찾을 수 없습니다. ID: " + postingId));
        PostingResponseDTO dto = postingWrapper.toDetailDTO(posting, profile);
        dto.setPayTypeStr();
        System.out.println(dto);

        return dto;
    }

}
