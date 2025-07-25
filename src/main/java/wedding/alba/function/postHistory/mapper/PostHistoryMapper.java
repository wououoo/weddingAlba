package wedding.alba.function.postHistory.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import wedding.alba.entity.PostHistory;
import wedding.alba.entity.Posting;
import wedding.alba.function.postHistory.dto.PostHistoryDTO;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PostHistoryMapper {
    @Named("toBasic")
    @Mapping(target = "status", ignore = true)
    PostHistoryDTO tobasicPostHistoryDTO (Posting posting);

    @Mapping(target = "status", expression = "java(isCancel ? -1 : 1)")
    @Mapping(target = "payType", expression = "java(String.valueOf(posting.getPayType()))")
    @Mapping(target = "tags", expression = "java(parseTags(posting.getTags()))")
    PostHistoryDTO toPostHistoryDTO(Posting posting, boolean isCancel);

    @Mapping(target = "postHistoryId", ignore = true)
    @Mapping(target = "registrationDatetime", ignore = true)
    @Mapping(target = "updateDatetime", ignore = true)
    @Mapping(target = "payType", expression = "java(parsePayType(postHistoryDTO.getPayType()))")
    @Mapping(target = "startTime", source = "startTime")
    @Mapping(target = "endTime", source = "endTime")
    @Mapping(target = "tags", expression = "java(joinTags(postHistoryDTO.getTags()))")
    PostHistory toPostHistory(PostHistoryDTO postHistoryDTO);

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
            return null;
        }
        try {
            return LocalTime.parse(time);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid time format: " + time);
        }
    }
}
