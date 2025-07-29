package wedding.alba.function.common;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import wedding.alba.enums.PayType;
import wedding.alba.function.common.dto.CommonPostResponseDTO;
import wedding.alba.function.postHistory.dto.PostHistoryDTO;
import wedding.alba.function.posting.dto.PostingResponseDTO;

@Mapper(componentModel = "spring")
public interface CommonMapper {
    @Mapping(target = "applyCount", source = "applyCount")
    @Mapping(target = "confirmationCount", source = "confirmationCount")
    @Mapping(target = "status", constant = "0") // 현재 모집중 상태
    @Mapping(target = "dataType", constant = "ACTIVE")
    @Mapping(target = "payTypeText", expression = "java(parsePayTypeText(postingResponseDTO.getPayType()))")
    @Mapping(target = "postHistoryId", ignore = true)
    CommonPostResponseDTO toCommonPostingResponseDTO(PostingResponseDTO postingResponseDTO, int applyCount, int confirmationCount);

    @Mapping(target = "applyCount", source = "applyCount")
    @Mapping(target = "confirmationCount", source = "confirmationCount")
    @Mapping(target = "status", source = "postHistoryDTO.status") // PostHistoryDTO의 status 필드에서 가져옴
    @Mapping(target = "dataType", constant = "HISTORY")
    @Mapping(target = "payTypeText", expression = "java(parsePayTypeText(postHistoryDTO.getPayType()))")
    @Mapping(target = "postingId", ignore = true)
    CommonPostResponseDTO toCommonPostResponseDTO(PostHistoryDTO postHistoryDTO, int applyCount, int confirmationCount);

    default String parsePayTypeText (PayType payType) {
        if(payType.equals(PayType.DAILY)) return "일급";
        else return "시급";
    }
}
