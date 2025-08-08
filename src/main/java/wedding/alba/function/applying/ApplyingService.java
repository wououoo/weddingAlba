package wedding.alba.function.applying;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import wedding.alba.entity.Applying;
import wedding.alba.function.applying.dto.ApplyingRequestDTO;
import wedding.alba.function.applying.dto.ApplyingResponseDTO;
import wedding.alba.function.applying.dto.ApplyingStatusDTO;
import wedding.alba.function.applying.mapper.ApplyingMapper;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class ApplyingService {
    @Autowired
    private ApplyingRepository applyingRepository;

    @Autowired
    private ApplyingMapper applyingMapper;

    public Long createApplying(ApplyingRequestDTO requestDTO) {
        if(requestDTO.getStatus() == null) {
            requestDTO.setStatus(0);
        }
        Applying applying = applyingMapper.toApplying(requestDTO);
        Long applyingId = applyingRepository.save(applying).getApplyingId();
        return applyingId;
    }

    public Long updateApplying(Long userId, Long applyingId, ApplyingRequestDTO rquestDto) {
        Applying existApplying = applyingRepository.findById(applyingId)                
                .orElseThrow(() -> {
                    log.error("존재하지 않는 신청글 {}  수정 시도", applyingId);
                    return new IllegalArgumentException("존재하지 않는 신청글입니다.");
                });

        if(!existApplying.getUserId().equals(userId)) {
            log.warn("사용자 {}가 다른 사용자의 신청글 {} 수정 시도", userId, applyingId);
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }
        existApplying.setPrContent(rquestDto.getPrContent());

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
        ApplyingResponseDTO responseDTO = applyingMapper.toApplyingResponseDTO(applying);
        responseDTO.setStatusStr();

        return responseDTO;
    }

    public Page<ApplyingResponseDTO> getMyApplyingList(int page, int size, Integer status, Long userId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "applyDatetime"));
        Page<Applying> applyingPage;
        if (status == null) {
            applyingPage = applyingRepository.findAllByUserId(pageable, userId);
        } else {
            applyingPage = applyingRepository.findMyPageByStatus(pageable, status, userId);
        }
        Page<ApplyingResponseDTO> myApplyingPage = applyingPage.map(applying -> applyingMapper.toApplyingResponseDTO(applying));
        return myApplyingPage;
    }

    public List<ApplyingResponseDTO> getApplyingListByPostingId(Long postingId) {
        List<Applying> applyingList = applyingRepository.findByPostingId(postingId);
        List<ApplyingResponseDTO> applyingResponseDTOList = applyingList.stream().map(applyingMapper::toApplyingResponseDTO).toList();
        return applyingResponseDTOList;
    }

    // 모집글 작성자가 확정 혹은 거절로 상태 변경하는경우
    public Long changeStatus (Integer status, Long applyingId, Long userId) {
        Applying existApplying = applyingRepository.findById(applyingId).orElseThrow(() -> {
                log.error("존재하지 않는 신청글 {} ", applyingId);
                return new IllegalArgumentException("존재하지 않는 신청글입니다.");
            }
        );

        if(!existApplying.getPosting().getUserId().equals(userId)) {
            log.warn("사용자 {}가 다른 사용자의 신청글 {} 수정 시도", userId, applyingId);
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        existApplying.setStatus(status);
        existApplying.setConfirmationDatetime(LocalDateTime.now());
        Long updateApplyingId = applyingRepository.save(existApplying).getApplyingId();
        return updateApplyingId;
    }

    public void deleteApplyingById(Long applyingId) {
        try {
            applyingRepository.deleteById(applyingId);
        } catch (Exception e) {
            log.warn("신청글 {} 삭제 실패", applyingId);
            throw new IllegalArgumentException("신청글 삭제에 실패했습니다.");
        }
    }


}
