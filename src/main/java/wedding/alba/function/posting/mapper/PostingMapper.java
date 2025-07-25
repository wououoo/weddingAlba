package wedding.alba.function.posting.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import wedding.alba.entity.Posting;
import wedding.alba.function.postHistory.dto.PostHistoryDTO;
import wedding.alba.function.posting.dto.MyPostingReponseDTO;
import wedding.alba.function.posting.dto.PostingRequestDTO;
import wedding.alba.function.posting.dto.PostingResponseDTO;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PostingMapper {

    @Named("toBasic")
    PostingResponseDTO toBasicResponseDTO(Posting posting);

    @Mapping(target = "registrationDatetime", source = "registrationDatetime")
    @Mapping(target = "updateDatetime", source = "updateDatetime")
    @Mapping(target = "nickname", source = "profile.nickname")
    @Mapping(target = "startTime", source = "startTime")
    @Mapping(target = "endTime", source = "endTime")
    PostingResponseDTO toDetailDTO(Posting posting);

    @Mapping(target = "payType", expression = "java(parsePayType(dto.getPayType()))")
    @Mapping(target = "startTime", expression = "java(parseTime(dto.getStartTime()))")
    @Mapping(target = "endTime", expression = "java(parseTime(dto.getEndTime()))")
    @Mapping(target = "tags", expression = "java(joinTags(dto.getTags()))")
    Posting toPosting(PostingRequestDTO dto);

    @Mapping(target = "postingId", ignore = true) // ID는 변경하지 않음
    @Mapping(target = "registrationDatetime", ignore = true) // 등록일시는 변경하지 않음
    @Mapping(target = "profile", ignore = true) // 관계는 변경하지 않음
    @Mapping(target = "payType", expression = "java(parsePayType(dto.getPayType()))")
    @Mapping(target = "startTime", expression = "java(parseTime(dto.getStartTime()))")
    @Mapping(target = "endTime", expression = "java(parseTime(dto.getEndTime()))")
    @Mapping(target = "tags", expression = "java(joinTags(dto.getTags()))")
    void updatePostingFromDto(PostingRequestDTO dto, @MappingTarget Posting posting);



    @Mapping(target = "posting", source = "posting")
    @Mapping(target = "applyCount", source = "applyCount")
    @Mapping(target = "confirmationCount", source = "confirmationCount")
    MyPostingReponseDTO toMyPostingReponseDTO(Posting posting, int applyCount, int confirmationCount);

    List<PostingResponseDTO> toBasicResponseDTOList(List<Posting> postings);
    List<PostingResponseDTO> toDetailDTOList(List<Posting> postings);

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

    default Posting.PayType parsePayType(String payType) {
        if (payType == null || payType.trim().isEmpty()) {
            throw new IllegalArgumentException("Pay type cannot be null or empty");
        }
        try {
            return Posting.PayType.valueOf(payType.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid pay type: " + payType);
        }
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
