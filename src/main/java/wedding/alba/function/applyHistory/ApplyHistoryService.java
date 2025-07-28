package wedding.alba.function.applyHistory;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wedding.alba.entity.ApplyHistory;
import wedding.alba.function.applyHistory.dto.ApplyHistoryDTO;
import wedding.alba.function.applyHistory.mapper.ApplyHistoryMapper;

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


}
