package wedding.alba.function.posting.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import wedding.alba.entity.Posting;
import wedding.alba.entity.Profile;
import wedding.alba.function.postHistory.dto.PostHistoryDTO;
import wedding.alba.function.posting.dto.MyPostingReponseDTO;
import wedding.alba.function.posting.dto.PostingRequestDTO;
import wedding.alba.function.posting.dto.PostingResponseDTO;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-24T09:19:50+0900",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class PostingMapperImpl implements PostingMapper {

    @Override
    public PostingResponseDTO toBasicResponseDTO(Posting posting) {
        if ( posting == null ) {
            return null;
        }

        PostingResponseDTO.PostingResponseDTOBuilder postingResponseDTO = PostingResponseDTO.builder();

        postingResponseDTO.postingId( posting.getPostingId() );
        postingResponseDTO.title( posting.getTitle() );
        postingResponseDTO.appointmentDatetime( posting.getAppointmentDatetime() );
        postingResponseDTO.isSelf( posting.getIsSelf() );
        postingResponseDTO.personName( posting.getPersonName() );
        postingResponseDTO.personPhoneNumber( posting.getPersonPhoneNumber() );
        postingResponseDTO.address( posting.getAddress() );
        postingResponseDTO.buildingName( posting.getBuildingName() );
        postingResponseDTO.sidoSigungu( posting.getSidoSigungu() );
        postingResponseDTO.hasMobileInvitation( posting.getHasMobileInvitation() );
        postingResponseDTO.workingHours( posting.getWorkingHours() );
        postingResponseDTO.startTime( posting.getStartTime() );
        postingResponseDTO.endTime( posting.getEndTime() );
        postingResponseDTO.payType( posting.getPayType() );
        postingResponseDTO.payAmount( posting.getPayAmount() );
        postingResponseDTO.guestMainRole( posting.getGuestMainRole() );
        postingResponseDTO.targetPersonnel( posting.getTargetPersonnel() );
        postingResponseDTO.detailContent( posting.getDetailContent() );
        postingResponseDTO.tags( parseTags( posting.getTags() ) );
        postingResponseDTO.userId( posting.getUserId() );
        postingResponseDTO.registrationDatetime( posting.getRegistrationDatetime() );
        postingResponseDTO.updateDatetime( posting.getUpdateDatetime() );

        return postingResponseDTO.build();
    }

    @Override
    public PostingResponseDTO toDetailDTO(Posting posting) {
        if ( posting == null ) {
            return null;
        }

        PostingResponseDTO.PostingResponseDTOBuilder postingResponseDTO = PostingResponseDTO.builder();

        postingResponseDTO.registrationDatetime( posting.getRegistrationDatetime() );
        postingResponseDTO.updateDatetime( posting.getUpdateDatetime() );
        postingResponseDTO.nickname( postingProfileNickname( posting ) );
        postingResponseDTO.startTime( posting.getStartTime() );
        postingResponseDTO.endTime( posting.getEndTime() );
        postingResponseDTO.postingId( posting.getPostingId() );
        postingResponseDTO.title( posting.getTitle() );
        postingResponseDTO.appointmentDatetime( posting.getAppointmentDatetime() );
        postingResponseDTO.isSelf( posting.getIsSelf() );
        postingResponseDTO.personName( posting.getPersonName() );
        postingResponseDTO.personPhoneNumber( posting.getPersonPhoneNumber() );
        postingResponseDTO.address( posting.getAddress() );
        postingResponseDTO.buildingName( posting.getBuildingName() );
        postingResponseDTO.sidoSigungu( posting.getSidoSigungu() );
        postingResponseDTO.hasMobileInvitation( posting.getHasMobileInvitation() );
        postingResponseDTO.workingHours( posting.getWorkingHours() );
        postingResponseDTO.payType( posting.getPayType() );
        postingResponseDTO.payAmount( posting.getPayAmount() );
        postingResponseDTO.guestMainRole( posting.getGuestMainRole() );
        postingResponseDTO.targetPersonnel( posting.getTargetPersonnel() );
        postingResponseDTO.detailContent( posting.getDetailContent() );
        postingResponseDTO.tags( parseTags( posting.getTags() ) );
        postingResponseDTO.userId( posting.getUserId() );

        return postingResponseDTO.build();
    }

    @Override
    public Posting toPosting(PostingRequestDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Posting.PostingBuilder posting = Posting.builder();

        posting.postingId( dto.getPostingId() );
        posting.userId( dto.getUserId() );
        posting.title( dto.getTitle() );
        posting.isSelf( dto.getIsSelf() );
        posting.personName( dto.getPersonName() );
        posting.personPhoneNumber( dto.getPersonPhoneNumber() );
        posting.appointmentDatetime( dto.getAppointmentDatetime() );
        posting.address( dto.getAddress() );
        posting.buildingName( dto.getBuildingName() );
        posting.sidoSigungu( dto.getSidoSigungu() );
        posting.hasMobileInvitation( dto.getHasMobileInvitation() );
        posting.workingHours( dto.getWorkingHours() );
        posting.payAmount( dto.getPayAmount() );
        posting.targetPersonnel( dto.getTargetPersonnel() );
        posting.guestMainRole( dto.getGuestMainRole() );
        posting.detailContent( dto.getDetailContent() );

        posting.payType( parsePayType(dto.getPayType()) );
        posting.startTime( parseTime(dto.getStartTime()) );
        posting.endTime( parseTime(dto.getEndTime()) );
        posting.tags( joinTags(dto.getTags()) );

        return posting.build();
    }

    @Override
    public void updatePostingFromDto(PostingRequestDTO dto, Posting posting) {
        if ( dto == null ) {
            return;
        }

        posting.setUserId( dto.getUserId() );
        posting.setTitle( dto.getTitle() );
        posting.setIsSelf( dto.getIsSelf() );
        posting.setPersonName( dto.getPersonName() );
        posting.setPersonPhoneNumber( dto.getPersonPhoneNumber() );
        posting.setAppointmentDatetime( dto.getAppointmentDatetime() );
        posting.setAddress( dto.getAddress() );
        posting.setBuildingName( dto.getBuildingName() );
        posting.setSidoSigungu( dto.getSidoSigungu() );
        posting.setHasMobileInvitation( dto.getHasMobileInvitation() );
        posting.setWorkingHours( dto.getWorkingHours() );
        posting.setPayAmount( dto.getPayAmount() );
        posting.setTargetPersonnel( dto.getTargetPersonnel() );
        posting.setGuestMainRole( dto.getGuestMainRole() );
        posting.setDetailContent( dto.getDetailContent() );

        posting.setPayType( parsePayType(dto.getPayType()) );
        posting.setStartTime( parseTime(dto.getStartTime()) );
        posting.setEndTime( parseTime(dto.getEndTime()) );
        posting.setTags( joinTags(dto.getTags()) );
    }

    @Override
    public PostHistoryDTO toPostHistoryDTO(Posting posting, boolean isCancel) {
        if ( posting == null ) {
            return null;
        }

        PostHistoryDTO.PostHistoryDTOBuilder postHistoryDTO = PostHistoryDTO.builder();

        if ( posting != null ) {
            postHistoryDTO.postingId( posting.getPostingId() );
            postHistoryDTO.userId( posting.getUserId() );
            postHistoryDTO.title( posting.getTitle() );
            postHistoryDTO.isSelf( posting.getIsSelf() );
            postHistoryDTO.personName( posting.getPersonName() );
            postHistoryDTO.personPhoneNumber( posting.getPersonPhoneNumber() );
            postHistoryDTO.appointmentDatetime( posting.getAppointmentDatetime() );
            postHistoryDTO.address( posting.getAddress() );
            postHistoryDTO.buildingName( posting.getBuildingName() );
            postHistoryDTO.sidoSigungu( posting.getSidoSigungu() );
            postHistoryDTO.hasMobileInvitation( posting.getHasMobileInvitation() );
            postHistoryDTO.workingHours( posting.getWorkingHours() );
            postHistoryDTO.startTime( posting.getStartTime() );
            postHistoryDTO.endTime( posting.getEndTime() );
            postHistoryDTO.payAmount( posting.getPayAmount() );
            postHistoryDTO.targetPersonnel( posting.getTargetPersonnel() );
            postHistoryDTO.guestMainRole( posting.getGuestMainRole() );
            postHistoryDTO.detailContent( posting.getDetailContent() );
        }
        postHistoryDTO.status( isCancel ? -1 : 1 );
        postHistoryDTO.payType( String.valueOf(posting.getPayType()) );
        postHistoryDTO.tags( parseTags(posting.getTags()) );

        return postHistoryDTO.build();
    }

    @Override
    public MyPostingReponseDTO toMyPostingReponseDTO(Posting posting, int applyCount, int confirmationCount) {
        if ( posting == null ) {
            return null;
        }

        MyPostingReponseDTO.MyPostingReponseDTOBuilder myPostingReponseDTO = MyPostingReponseDTO.builder();

        myPostingReponseDTO.posting( toDetailDTO( posting ) );
        myPostingReponseDTO.applyCount( applyCount );
        myPostingReponseDTO.confirmationCount( confirmationCount );

        return myPostingReponseDTO.build();
    }

    @Override
    public List<PostingResponseDTO> toBasicResponseDTOList(List<Posting> postings) {
        if ( postings == null ) {
            return null;
        }

        List<PostingResponseDTO> list = new ArrayList<PostingResponseDTO>( postings.size() );
        for ( Posting posting : postings ) {
            list.add( toDetailDTO( posting ) );
        }

        return list;
    }

    @Override
    public List<PostingResponseDTO> toDetailDTOList(List<Posting> postings) {
        if ( postings == null ) {
            return null;
        }

        List<PostingResponseDTO> list = new ArrayList<PostingResponseDTO>( postings.size() );
        for ( Posting posting : postings ) {
            list.add( toDetailDTO( posting ) );
        }

        return list;
    }

    private String postingProfileNickname(Posting posting) {
        if ( posting == null ) {
            return null;
        }
        Profile profile = posting.getProfile();
        if ( profile == null ) {
            return null;
        }
        String nickname = profile.getNickname();
        if ( nickname == null ) {
            return null;
        }
        return nickname;
    }
}
