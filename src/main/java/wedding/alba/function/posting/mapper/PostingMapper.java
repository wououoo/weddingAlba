package wedding.alba.function.posting.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import wedding.alba.entity.Posting;
import wedding.alba.enums.PayType;
import wedding.alba.function.posting.dto.PostingRequestDTO;
import wedding.alba.function.posting.dto.PostingResponseDTO;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PostingMapper {
    @Mapping(target = "registrationDatetime", source = "registrationDatetime")
    @Mapping(target = "updateDatetime", source = "updateDatetime")
    @Mapping(target = "nickname", source = "profile.nickname")
    @Mapping(target = "startTime", source = "startTime")
    @Mapping(target = "endTime", source = "endTime")
    @Mapping(target = "payTypeText", expression="java(parsePayTypeText(posting.getPayType()))")
    PostingResponseDTO toDetailDTO(Posting posting);

    @Mapping(target = "profile", ignore = true)
    @Mapping(target = "registrationDatetime", ignore = true)
    @Mapping(target = "updateDatetime", ignore = true)
    @Mapping(target = "payType", expression = "java(parsePayType(dto.getPayType()))")
    @Mapping(target = "startTime", expression = "java(parseTime(dto.getStartTime()))")
    @Mapping(target = "endTime", expression = "java(parseTime(dto.getEndTime()))")
    @Mapping(target = "tags", expression = "java(joinTags(dto.getTags()))")
    Posting toPosting(PostingRequestDTO dto);

    @Mapping(target = "postingId", ignore = true) // ID는 변경하지 않음
    @Mapping(target = "registrationDatetime", ignore = true) // 등록일시는 변경하지 않음
    @Mapping(target = "updateDatetime", ignore = true) // 수정일시는 자동 업데이트
    @Mapping(target = "profile", ignore = true) // 관계는 변경하지 않음
    @Mapping(target = "payType", expression = "java(parsePayType(dto.getPayType()))")
    @Mapping(target = "startTime", expression = "java(parseTime(dto.getStartTime()))")
    @Mapping(target = "endTime", expression = "java(parseTime(dto.getEndTime()))")
    @Mapping(target = "tags", expression = "java(joinTags(dto.getTags()))")
    void updatePostingFromDto(PostingRequestDTO dto, @MappingTarget Posting posting);


    default List<String> parseTags(String tags) {
        if (tags == null || tags.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .collect(Collectors.toList());
    }

    default String joinTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return null;
        }
        return String.join(",", tags);
    }

    default PayType parsePayType(String payType) {
        if (payType == null || payType.trim().isEmpty()) {
            throw new IllegalArgumentException("Pay type cannot be null or empty");
        }
        try {
            return PayType.valueOf(payType.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid pay type: " + payType);
        }
    }

    default String parsePayTypeText (PayType payType) {
        if(payType.equals(PayType.DAILY)) return "일급";
        else return "시급";
    }

    default LocalTime parseTime(String time) {
        if (time == null || time.trim().isEmpty()) {
            throw new IllegalArgumentException("Time cannot be null or empty");
        }
        try {
            return LocalTime.parse(time);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid time format: " + time);
        }
    }

}
