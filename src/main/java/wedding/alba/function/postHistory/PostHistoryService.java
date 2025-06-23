package wedding.alba.function.postHistory;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wedding.alba.entity.PostHistory;
import wedding.alba.entity.Posting;
import wedding.alba.function.posting.PostingResponseDTO;

@Service
@Slf4j
public class PostHistoryService {

    @Autowired
    private PostHistoryRepository postHistoryRepository;

    // 모집글에서 이력으로 데이터 이동
    public Long movePostingToHistory (PostHistoryDTO historyDTO) {
        PostHistory postHistory = toEntity(historyDTO);
        Long postHistoryId = postHistoryRepository.save(postHistory).getPostHistoryId();
        return postHistoryId;
    }


    private PostHistory toEntity(PostHistoryDTO historyDTO) {
        return PostHistory.builder()
                .postingId(historyDTO.getPostingId())
                .userId(historyDTO.getUserId())
                .title(historyDTO.getTitle())
                .isSelf(historyDTO.getIsSelf())
                .personName(historyDTO.getPersonName())
                .personPhoneNumber(historyDTO.getPersonPhoneNumber())
                .appointmentDatetime(historyDTO.getAppointmentDatetime())
                .address(historyDTO.getAddress())
                .buildingName(historyDTO.getBuildingName())
                .sidoSigungu(historyDTO.getSidoSigungu())
                .hasMobileInvitation(historyDTO.getHasMobileInvitation())
                .startTime(historyDTO.getStartTime())
                .endTime(historyDTO.getEndTime())
                .workingHours(historyDTO.getWorkingHours())
                .payType(Posting.PayType.valueOf(historyDTO.getPayType()))
                .payAmount(historyDTO.getPayAmount())
                .targetPersonnel(historyDTO.getTargetPersonnel())
                .guestMainRole(historyDTO.getGuestMainRole())
                .detailContent(historyDTO.getDetailContent())
                .status(historyDTO.getStatus())
                .tags(historyDTO.getTags() != null ? String.join(",", historyDTO.getTags()) : null)
                .build();
    }
}
