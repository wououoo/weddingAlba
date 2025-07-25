package wedding.alba.function.postHistory;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wedding.alba.entity.PostHistory;
import wedding.alba.entity.Posting;
import wedding.alba.function.postHistory.dto.PostHistoryDTO;
import wedding.alba.function.postHistory.mapper.PostHistoryMapper;

@Service
@Slf4j
public class PostHistoryService {

    @Autowired
    private PostHistoryRepository postHistoryRepository;

    @Autowired
    private PostHistoryMapper postHistoryMapper;

    // 모집글에서 이력으로 데이터 이동
    public Long movePostingToHistory (PostHistoryDTO historyDTO) {
        PostHistory postHistory = postHistoryMapper.toPostHistory(historyDTO);
        Long postHistoryId = postHistoryRepository.save(postHistory).getPostHistoryId();
        return postHistoryId;
    }


}
