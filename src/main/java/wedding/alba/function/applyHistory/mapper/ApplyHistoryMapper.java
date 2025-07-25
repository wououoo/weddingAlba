package wedding.alba.function.applyHistory.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import wedding.alba.entity.ApplyHistory;
import wedding.alba.function.applyHistory.dto.ApplyHistoryRequestDTO;

@Mapper(componentModel = "spring")
public interface ApplyHistoryMapper {
    @Named("toBasic")
    ApplyHistoryRequestDTO tobasicApplyHistoryRequestDTO (ApplyHistory applyHistory);

    @Mapping(target = "applyHistoryId", ignore = true)
    @Mapping(target = "postingId", ignore = true)
    @Mapping(target = "applyDatetime", ignore = true)
    @Mapping(target = "confirmationDatetime", ignore = true)
    ApplyHistory toApplyHistory(ApplyHistoryRequestDTO applyHistoryRequestDTO);

}
