package wedding.alba.function.posting;

import wedding.alba.entity.Posting;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import wedding.alba.entity.Profile;

@Component
public class PostingWrapper {

    public Posting toEntity(PostingRequestDTO postingDto) {
        return Posting.builder()
                .userId(postingDto.getUserId())
                .title(postingDto.getTitle())
                .isSelf(postingDto.getIsSelf())
                .personName(postingDto.getPersonName())
                .personPhoneNumber(postingDto.getPersonPhoneNumber())
                .appointmentDatetime(postingDto.getAppointmentDatetime())
                .address(postingDto.getAddress())
                .buildingName(postingDto.getBuildingName())
                .sidoSigungu(postingDto.getSidoSigungu())
                .hasMobileInvitation(postingDto.getHasMobileInvitation())
                .workingHours(postingDto.getWorkingHours())
                .targetPersonnel(postingDto.getTargetPersonnel())
                .startTime(postingDto.getStartTime())
                .endTime(postingDto.getEndTime())
                .payType(Posting.PayType.valueOf(postingDto.getPayType().toUpperCase()))
                .payAmount(postingDto.getPayAmount())
                .targetPersonnel(postingDto.getTargetPersonnel())
                .guestMainRole(postingDto.getGuestMainRole())
                .detailContent(postingDto.getDetailContent())
            .tags(postingDto.getTags() != null ? String.join(",", postingDto.getTags()) : null)
            .build();
    }

    public PostingResponseDTO toResponseDTO(Posting posting) {
        return PostingResponseDTO.builder()
            .postingId(posting.getPostingId())
            .userId(posting.getUserId())
            .title(posting.getTitle())
            .isSelf(posting.getIsSelf())
            .personName(posting.getPersonName())
            .personPhoneNumber(posting.getPersonPhoneNumber())
            .appointmentDatetime(posting.getAppointmentDatetime())
            .address(posting.getAddress())
            .buildingName(posting.getBuildingName())
            .sidoSigungu(posting.getSidoSigungu())
            .hasMobileInvitation(posting.getHasMobileInvitation())
            .workingHours(posting.getWorkingHours())
            .payType(posting.getPayType())
            .payAmount(posting.getPayAmount())
            .guestMainRole(posting.getGuestMainRole())
            .targetPersonnel(posting.getTargetPersonnel())
            .detailContent(posting.getDetailContent())
            .tags(posting.getTags() != null && !posting.getTags().isEmpty() ?
                java.util.Arrays.stream(posting.getTags().split(","))
                    .filter(tag -> !tag.trim().isEmpty())
                    .collect(Collectors.toList()) :
                Collections.emptyList())
            .build();
    }

    public PostingResponseDTO toDetailDTO (Posting posting, Profile profile) {
        return PostingResponseDTO.builder()
                .postingId(posting.getPostingId())
                .userId(posting.getUserId())
                .isSelf(posting.getIsSelf())
                .personName(posting.getPersonName())
                .personPhoneNumber(posting.getPersonPhoneNumber())
                .title(posting.getTitle())
                .appointmentDatetime(posting.getAppointmentDatetime())
                .address(posting.getAddress())
                .buildingName(posting.getBuildingName())
                .sidoSigungu(posting.getSidoSigungu())
                .hasMobileInvitation(posting.getHasMobileInvitation())
                .workingHours(posting.getWorkingHours())
                .startTime(posting.getStartTime())
                .endTime(posting.getEndTime())
                .payType(posting.getPayType())
                .payAmount(posting.getPayAmount())
                .guestMainRole(posting.getGuestMainRole())
                .targetPersonnel(posting.getTargetPersonnel())
                .detailContent(posting.getDetailContent())
                .tags(posting.getTags() != null && !posting.getTags().isEmpty() ?
                    java.util.Arrays.stream(posting.getTags().split(","))
                                            .filter(tag -> !tag.trim().isEmpty())
                                            .collect(Collectors.toList()) :
                    Collections.emptyList())
                .registrationDatetime(posting.getRegistrationDatetime())
                .updateDatetime(posting.getUpdateDatetime())
                .nickname(profile.getNickname())
                .build();
    }

}
