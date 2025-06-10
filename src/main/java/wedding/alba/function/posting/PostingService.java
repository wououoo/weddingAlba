package wedding.alba.function.posting;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wedding.alba.entity.Posting;
import wedding.alba.repository.PostingRepository;

@Service
@Slf4j
public class PostingService {

    @Autowired
    private PostingRepository postingRepository;

    public PostingResponseDTO createPosting(PostingRequestDTO postingDto) {

        // dto -> Posting 엔터티로 변경
        Posting posting = Posting.builder()
                .userId(postingDto.getUserId())
                .title(postingDto.getTitle())
                .isSelf(postingDto.getIsSelf())
                .personName(postingDto.getPersonName())
                .personPhoneNumber(postingDto.getPersonPhoneNumber())
                .appointmentDatetime(postingDto.getAppointmentDatetime())
                .location(postingDto.getLocation())
                .hasMobileInvitation(postingDto.getHasMobileInvitation())
                .workingHours(postingDto.getWorkingHours())
                .payType(postingDto.getPayType())
                .payAmount(postingDto.getPayAmount())
                .guestMainRole(postingDto.getGuestMainRole())
                .detailContent(postingDto.getDetailContent())
                .tags(postingDto.getTags().toString())
                .build();

        // insert
        Posting responsePosting = postingRepository.save(posting);

        PostingResponseDTO responseDTO = PostingResponseDTO.builder()
                .postingId(responsePosting.getPostingId())
                .build();
        return responseDTO;
    }

}
