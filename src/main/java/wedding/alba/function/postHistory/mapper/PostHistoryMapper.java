package wedding.alba.function.postHistory.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import wedding.alba.entity.PostHistory;
import wedding.alba.entity.Posting;
import wedding.alba.enums.EnumType;
import wedding.alba.function.postHistory.dto.PostHistoryDTO;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PostHistoryMapper {

    @Mapping(target = "status", expression = "java(isCancel ? -1 : 1)")
    @Mapping(target = "tags", expression = "java(parseTags(posting.getTags()))")
    @Mapping(target = "nickname", source = "posting.profile.nickname")
    @Mapping(target = "postHistoryId", ignore = true)
    @Mapping(target = "payTypeText", ignore = true)
    PostHistoryDTO toPostHistoryDTOFromPosting(Posting posting, boolean isCancel);

    @Mapping(target = "postHistoryId", ignore = true)
    @Mapping(target = "registrationDatetime", ignore = true)
    @Mapping(target = "updateDatetime", ignore = true)
    @Mapping(target = "profile", ignore = true)
    @Mapping(target = "startTime", source = "startTime")
    @Mapping(target = "endTime", source = "endTime")
    @Mapping(target = "tags", expression = "java(joinTags(postHistoryDTO.getTags()))")
    PostHistory toPostHistory(PostHistoryDTO postHistoryDTO);

    @Mapping(target = "payTypeText", expression = "java(parsePayTypeText(postHistory.getPayType()))")
    @Mapping(target = "nickname", source = "profile.nickname")
    PostHistoryDTO toPostHistoryDTO(PostHistory postHistory);


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

    default EnumType.PayType parsePayType(String payType) {
        if (payType == null || payType.trim().isEmpty()) {
            throw new IllegalArgumentException("Pay type cannot be null or empty");
        }
        try {
            return EnumType.PayType.valueOf(payType.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid pay type: " + payType);
        }
    }

    default String parsePayTypeText (EnumType.PayType payType) {
        if(payType.equals(EnumType.PayType.DAILY)) return "일급";
        else return "시급";
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
