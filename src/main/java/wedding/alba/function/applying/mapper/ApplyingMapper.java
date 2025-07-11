package wedding.alba.function.applying.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import wedding.alba.entity.Applying;
import wedding.alba.function.applying.dto.ApplyingRequestDTO;
import wedding.alba.function.applying.dto.ApplyingResponseDTO;
import wedding.alba.function.posting.mapper.PostingMapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {PostingMapper.class})
public interface ApplyingMapper {

    // Applying -> ApplyingResponseDTO 변환
    @Mapping(target = "posting", source = "posting", qualifiedByName = "toBasic")
    @Mapping(target = "statusText", expression = "java(getStatusText(applying.getStatus()))")
    ApplyingResponseDTO toResponseDTO(Applying applying);

    // ApplyingRequestDTO -> Applying 변환
    @Mapping(target = "applyingId", ignore = true) // ID는 자동 생성
    @Mapping(target = "applyDatetime", ignore = true) // 신청일시는 자동 생성
    @Mapping(target = "confirmationDatetime", ignore = true) // 확정일시는 나중에 설정
    @Mapping(target = "posting", ignore = true) // 관계는 별도 설정
    Applying toApplying(ApplyingRequestDTO dto);

    // 컬렉션 변환
    List<ApplyingResponseDTO> toResponseDTOList(List<Applying> applyings);

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