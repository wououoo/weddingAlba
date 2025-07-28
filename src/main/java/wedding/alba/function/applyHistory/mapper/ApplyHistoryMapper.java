package wedding.alba.function.applyHistory.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import wedding.alba.entity.ApplyHistory;
import wedding.alba.entity.Applying;
import wedding.alba.function.applyHistory.dto.ApplyHistoryDTO;
import wedding.alba.function.applyHistory.dto.ApplyHistoryRequestDTO;


@Mapper(componentModel = "spring")
public interface ApplyHistoryMapper {
    @Named("toBasic")
    ApplyHistoryRequestDTO tobasicApplyHistoryRequestDTO (ApplyHistory applyHistory);

    @Mapping(target = "postingId", expression = "java(applying.getPostingId() != null && applying.getPostingId() > 0 ? applying.getPostingId() : null)")
    @Mapping(target = "postHistoryId", expression = "java(postHistoryId != null ? postHistoryId : null)")
    @Mapping(target = "status", expression = "java(isCancel ? -1 : 1)")
    ApplyHistoryDTO toApplyHistoryDTO(Applying applying, boolean isCancel, Long postHistoryId);

    @Mapping(target = "applyHistoryId", ignore = true)
    @Mapping(target = "confirmationDatetime", expression = "java(applyHistoryDTO.getConfirmationDatetime() != null ? applyHistoryDTO.getConfirmationDatetime() : java.time.LocalDateTime.now())")
    ApplyHistory toApplyHistory(ApplyHistoryDTO applyHistoryDTO);


}
