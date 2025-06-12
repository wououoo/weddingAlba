package wedding.alba.function.posting;

import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wedding.alba.entity.Posting;
import wedding.alba.repository.PostingRepository;

@Service
@Slf4j
public class PostingService {

    @Autowired
    private PostingRepository postingRepository;

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
}
