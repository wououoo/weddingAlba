package wedding.alba.function.common;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import wedding.alba.enums.EnumType;
import wedding.alba.function.applyHistory.dto.ApplyHistoryDTO;
import wedding.alba.function.applying.dto.ApplyingResponseDTO;
import wedding.alba.function.common.dto.CommonApplyResponseDTO;
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

    @Mapping(target = "statusText", expression = "java(parseStausText(applying.getStatus()))")
    @Mapping(target = "nickname", source = "profile.nickname")
    @Mapping(target = "applyHistoryId", ignore = true)
    @Mapping(target = "postHistoryId", ignore = true)
    CommonApplyResponseDTO toCommonApplyResponseDTO(ApplyingResponseDTO applying);

    @Mapping(target = "statusText", expression = "java(parseStausText(applyHistoryDTO.getStatus()))")
    @Mapping(target = "nickname", source = "profile.nickname")
    @Mapping(target = "applyingId", ignore = true)
    @Mapping(target = "postingId", ignore = true)
    CommonApplyResponseDTO toCommonApplyResponseDTO(ApplyHistoryDTO applyHistoryDTO);

    default String parsePayTypeText (EnumType.PayType payType) {
        if(payType.equals(EnumType.PayType.DAILY)) return "일급";
        else return "시급";
    }

    default String parseStausText (Integer status) {
        if(status == 0) return "대기";
        else if (status == -1) return "거절";
        else return "확정";
    }

}
