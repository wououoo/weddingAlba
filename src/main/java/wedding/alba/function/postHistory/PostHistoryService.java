package wedding.alba.function.postHistory;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wedding.alba.entity.PostHistory;
import wedding.alba.function.postHistory.dto.PostHistoryDTO;
import wedding.alba.function.postHistory.mapper.PostHistoryMapper;

import java.util.List;
import java.util.NoSuchElementException;

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

    // 해당 사용자의 이력가져오기
    public List<PostHistoryDTO> getPostHistoryListByUserId(Long userId) {
        List<PostHistory> postHistoryList = postHistoryRepository.findByUserId(userId);
        List<PostHistoryDTO> postHistoryDTOList = postHistoryList.stream().map(postHistory -> postHistoryMapper.toPostHistoryDTO(postHistory)).toList();
        return postHistoryDTOList;
    }

    public PostHistoryDTO getPostHistoryDetail(Long postHistoryId) {
        PostHistoryDTO postHistoryDTO = postHistoryRepository.findById(postHistoryId)
                .map(postHistoryMapper::toPostHistoryDTO)
                .orElseThrow(() -> new NoSuchElementException("모집이력을 찾을 수 없습니다. ID: " + postHistoryId));
        return postHistoryDTO;
    }

}
