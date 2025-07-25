package wedding.alba.function.applyHistory;

import lombok.extern.slf4j.Slf4j;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wedding.alba.entity.ApplyHistory;
import wedding.alba.function.applyHistory.dto.ApplyHistoryRequestDTO;
import wedding.alba.function.applyHistory.mapper.ApplyHistoryMapper;

@Service
@Slf4j
public class ApplyHistoryService {
    @Autowired
    private ApplyHistoryRepository applyHistoryRepository;

    @Autowired
    private ApplyHistoryMapper applyHistoryMapper;

    public Long moveApplyingToHistory (ApplyHistoryRequestDTO requestDTO) {
        ApplyHistory applyHistory = applyHistoryMapper.toApplyHistory(requestDTO);
        Long applyHistoryId = applyHistoryRepository.save(applyHistory).getApplyHistoryId();
        return applyHistoryId;
    }


}
