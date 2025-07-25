package wedding.alba.function.applyHistory.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Named;
import wedding.alba.entity.ApplyHistory;
import wedding.alba.function.applyHistory.dto.ApplyHistoryRequestDTO;

@Mapper(componentModel = "spring")
public interface ApplyHistoryMapper {
    @Named("toBasic")
    ApplyHistoryRequestDTO tobasicApplyHistoryRequestDTO (ApplyHistory applyHistory);

    ApplyHistory toApplyHistory(ApplyHistoryRequestDTO applyHistoryRequestDTO);

}
