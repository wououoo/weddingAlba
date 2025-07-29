package wedding.alba.function.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import wedding.alba.function.applyHistory.ApplyHistoryService;
import wedding.alba.function.applyHistory.dto.ApplyHistoryDTO;
import wedding.alba.function.applying.ApplyingService;
import wedding.alba.function.applying.dto.ApplyingResponseDTO;
import wedding.alba.function.common.dto.CommonPostResponseDTO;
import wedding.alba.function.postHistory.PostHistoryService;
import wedding.alba.function.postHistory.dto.PostHistoryDTO;
import wedding.alba.function.posting.PostingService;
import wedding.alba.function.posting.dto.PostingResponseDTO;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommonService {
    @Autowired
    private CommonMapper commonMapper;

    @Autowired
    private PostingService postingService;

    @Autowired
    private PostHistoryService postHistoryService;

    @Autowired
    private ApplyingService applyingService;

    @Autowired
    private ApplyHistoryService applyHistoryService;



    // 내 모집글 리스트
    public Page<CommonPostResponseDTO> getMyPostingPage(int page, int size, Long userId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "registrationDatetime"));
        List<PostingResponseDTO> postingResponseDTOList = postingService.getPostingListByUserId(userId);

        List<CommonPostResponseDTO> myPostingList = new ArrayList<>();
        // 현재 모집중인 모집글
        for(PostingResponseDTO posting : postingResponseDTOList) {
            List<ApplyingResponseDTO> applyingList = applyingService.getApplyingListByPostingId(posting.getPostingId());

            // 신청 개수
            int applyCount = applyingList.size();

            // 확정된 신청 개수 (status == 1)
            int confirmationCount = (int) applyingList.stream()
                    .filter(applying -> applying.getStatus() == 1)
                    .count();

            CommonPostResponseDTO postingReponseDTO = commonMapper.toCommonPostingResponseDTO(posting, applyCount, confirmationCount);
            myPostingList.add(postingReponseDTO);
        }

        // 모집완료 혹은 취소
        List<PostHistoryDTO> postHistoryDTOList = postHistoryService.getPostHistoryListByUserId(userId);
        for(PostHistoryDTO postHistoryDTO : postHistoryDTOList) {
            List<ApplyHistoryDTO> applyHistoryDTOList = applyHistoryService.getApplyHistoryListByPostId(postHistoryDTO.getPostHistoryId());
            // 신청 개수
            int applyCount = applyHistoryDTOList.size();

            // 확정된 신청 개수 (status == 1)
            int confirmationCount = (int) applyHistoryDTOList.stream()
                    .filter(applyHistoryDTO -> applyHistoryDTO.getStatus() == 1)
                    .count();

            CommonPostResponseDTO postingReponseDTO = commonMapper.toCommonPostResponseDTO(postHistoryDTO, applyCount, confirmationCount);
            myPostingList.add(postingReponseDTO);
        }

        int start = page * size;
        int end = Math.min(start + size, myPostingList.size());
        List<CommonPostResponseDTO> pageContent = myPostingList.subList(start, end);

        // 4. PageImpl로 변환
        return new PageImpl<>(pageContent, pageable, myPostingList.size());
    }
}
