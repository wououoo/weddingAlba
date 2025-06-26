package wedding.alba.function.applying;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wedding.alba.entity.Applying;

import java.util.List;
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
        Long applyId = applyingRepository.save(applying).getApplyingId();
        return applyId;
    }

    public Long updateApplying(Long userId, Long applyingId, ApplyingRequestDTO requestDTO) {
        Applying existApplying = applyingRepository.findById(applyingId)                
                .orElseThrow(() -> {
                    log.error("존재하지 않는 신청글 {}  수정 시도", applyingId);
                    return new IllegalArgumentException("존재하지 않는 신청글입니다.");
                });

        if(!existApplying.getUserId().equals(userId)) {
            log.warn("사용자 {}가 다른 사용자의 신청글 {} 수정 시도", userId, applyingId);
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        requestDTO.setUserId(userId);
        requestDTO.setApplyingId(applyingId);
        existApplying.toUpdateApplying(requestDTO);
        Long updateApplyingId = applyingRepository.save(existApplying).getApplyingId();
        return updateApplyingId;
    }

    public ApplyingStatusDTO checkUserApplying(Long postingId, Long userId) {
        List<Applying> applyingListByPostingId =  applyingRepository.findByPostingId(postingId);

        ApplyingStatusDTO statusDTO = new ApplyingStatusDTO();
        for(Applying applying : applyingListByPostingId) {
            if(applying.getUserId().equals(userId)) {
                statusDTO.setApplyingId(applying.getApplyingId());
                statusDTO.setHasApplied(true);
                break;
            } else {
                statusDTO.setApplyingId(applying.getApplyingId());
                statusDTO.setHasApplied(false);
            }
        }

        return statusDTO;
    }


    public ApplyingResponseDTO getApplyingDetail(Long applyingId) {
        Applying applying = applyingRepository.findById(applyingId).orElseThrow(() -> {
            log.error("존재하지 않는 신청글 {} ", applyingId);
            return new IllegalArgumentException("존재하지 않는 신청글입니다.");
        });
        ApplyingResponseDTO responseDTO = applyingWrapper.toResponseDTO(applying);
        responseDTO.setStatusStr();

        return responseDTO;
    }

}
