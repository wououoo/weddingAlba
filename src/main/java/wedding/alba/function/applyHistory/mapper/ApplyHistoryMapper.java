package wedding.alba.function.applyHistory.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import wedding.alba.entity.ApplyHistory;
import wedding.alba.function.applyHistory.dto.ApplyHistoryDTO;
import wedding.alba.function.applying.dto.ApplyingResponseDTO;


@Mapper(componentModel = "spring")
public interface ApplyHistoryMapper {
    @Named("toBasic")
    @Mapping(target = "profile", source = "profile")
    @Mapping(target = "statusText", expression = "java(getStatusText(applyHistory.getStatus()))")
    ApplyHistoryDTO toBasicApplyHistoryDTO (ApplyHistory applyHistory);

    @Mapping(target = "postingId", expression = "java(applying.getPostingId() != null && applying.getPostingId() > 0 ? applying.getPostingId() : null)")
    @Mapping(target = "postHistoryId", expression = "java(postHistoryId != null ? postHistoryId : null)")
    @Mapping(target = "status", expression = "java(isCancel ? -1 : 1)")
    @Mapping(target = "profile", source = "applying.profile")
    @Mapping(target = "statusText", expression = "java(getStatusText(applying.getStatus()))")
    @Mapping(target = "applyHistoryId", ignore = true)
    ApplyHistoryDTO toApplyHistoryDTO(ApplyingResponseDTO applying, boolean isCancel, Long postHistoryId);

    @Mapping(target = "applyHistoryId", ignore = true)
    @Mapping(target = "confirmationDatetime", expression = "java(applyHistoryDTO.getConfirmationDatetime() != null ? applyHistoryDTO.getConfirmationDatetime() : java.time.LocalDateTime.now())")
    @Mapping(target = "profile", ignore = true)
    ApplyHistory toApplyHistory(ApplyHistoryDTO applyHistoryDTO);

    // 상태 텍스트 변환 메소드
    default String getStatusText(Integer status) {
        if (status == null) return "알수없음";
        switch (status) {
            case 0: return "대기";
            case 1: return "승인";
            case -1: return "거절";
            default: return "알수없음";
        }
    }


}
