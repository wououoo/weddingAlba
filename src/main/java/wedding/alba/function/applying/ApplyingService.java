package wedding.alba.function.applying;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wedding.alba.entity.Applying;

import java.util.NoSuchElementException;

@Service
@Slf4j
public class ApplyingService {
    @Autowired
    private ApplyingRepository applyingRepository;

    @Autowired
    private ApplyingWrapper applyingWrapper;

    public Long createApplying(ApplyingRequestDTO requestDTO) {
        Applying applying = applyingWrapper.toEntity(requestDTO);
        Long applyId = applyingRepository.save(applying).getApplyId();
        return applyId;
    }

    public ApplyingResponseDTO getApplyingDetail(Long applyId) {
        Applying applying = applyingRepository.findById(applyId) .orElseThrow(() -> {
            log.error("존재하지 않는 신청글 {} ", applyId);
            return new IllegalArgumentException("존재하지 않는 신청글입니다.");
        });
        ApplyingResponseDTO responseDTO = applyingWrapper.toResponseDTO(applying);
        responseDTO.setStatusStr();

        return responseDTO;
    }

}
