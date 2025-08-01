package wedding.alba.function.applyHistory;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wedding.alba.entity.ApplyHistory;
import wedding.alba.function.applyHistory.dto.ApplyHistoryDTO;
import wedding.alba.function.applyHistory.mapper.ApplyHistoryMapper;
import wedding.alba.function.postHistory.dto.PostHistoryDTO;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Slf4j
public class ApplyHistoryService {
    @Autowired
    private ApplyHistoryRepository applyHistoryRepository;

    @Autowired
    private ApplyHistoryMapper applyHistoryMapper;

    public Long moveApplyingToHistory (ApplyHistoryDTO historyDTO) {
        ApplyHistory history = applyHistoryMapper.toApplyHistory(historyDTO);
        Long applyHistoryId = applyHistoryRepository.save(history).getApplyHistoryId();
        return applyHistoryId;
    }

    public List<ApplyHistoryDTO> getApplyHistoryListByPostId (Long postHistoryId) {
        List<ApplyHistoryDTO> applyHistoryList = applyHistoryRepository.findByPostHistoryId(postHistoryId)
                    .stream().map(applyHistory -> applyHistoryMapper.toBasicApplyHistoryDTO(applyHistory)).toList();
        return applyHistoryList;
    }

    public ApplyHistoryDTO getApplyHistoryDetail (Long applyHistoryId) {
        ApplyHistoryDTO applyHistoryDTO = applyHistoryRepository.findById(applyHistoryId)
                .map(applyHistoryMapper::toBasicApplyHistoryDTO)
                .orElseThrow(() -> new NoSuchElementException("모집이력을 찾을 수 없습니다. ID: " + applyHistoryId));
        return applyHistoryDTO;
    }



}
