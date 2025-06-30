package wedding.alba.function.applying;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import wedding.alba.entity.Applying;
import wedding.alba.entity.Profile;
import wedding.alba.function.posting.PostingWrapper;

@Component
public class ApplyingWrapper {

    @Autowired
    private PostingWrapper postingWrapper;

    public Applying toEntity(ApplyingRequestDTO requestDTO) {
        return Applying.builder()
                .userId(requestDTO.getUserId())
                .postingId(requestDTO.getPostingId())
                .status(0)
                .prContent(requestDTO.getPrContent())
                .build();
    }

    public ApplyingResponseDTO toResponseDTO (Applying applying) {
        return ApplyingResponseDTO.builder()
                .userId(applying.getUserId())
                .applyingId(applying.getApplyingId())
                .applyDatetime(applying.getApplyDatetime())
                .confirmationDatetime(applying.getConfirmationDatetime())
                .prContent(applying.getPrContent())
                .status(applying.getStatus())
                .postingId(applying.getPostingId())
                .posting(postingWrapper.toResponseDTO(applying.getPosting()))
                .build();
    }
}
