package wedding.alba.function.applying.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import wedding.alba.entity.Applying;
import wedding.alba.function.applying.dto.ApplyingRequestDTO;
import wedding.alba.function.applying.dto.ApplyingResponseDTO;
import wedding.alba.function.posting.mapper.PostingMapper;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-24T09:19:50+0900",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class ApplyingMapperImpl implements ApplyingMapper {

    @Autowired
    private PostingMapper postingMapper;

    @Override
    public ApplyingResponseDTO toResponseDTO(Applying applying) {
        if ( applying == null ) {
            return null;
        }

        ApplyingResponseDTO.ApplyingResponseDTOBuilder applyingResponseDTO = ApplyingResponseDTO.builder();

        applyingResponseDTO.posting( postingMapper.toBasicResponseDTO( applying.getPosting() ) );
        applyingResponseDTO.applyingId( applying.getApplyingId() );
        applyingResponseDTO.postingId( applying.getPostingId() );
        applyingResponseDTO.userId( applying.getUserId() );
        applyingResponseDTO.prContent( applying.getPrContent() );
        applyingResponseDTO.status( applying.getStatus() );
        applyingResponseDTO.applyDatetime( applying.getApplyDatetime() );
        applyingResponseDTO.confirmationDatetime( applying.getConfirmationDatetime() );

        applyingResponseDTO.statusText( getStatusText(applying.getStatus()) );

        return applyingResponseDTO.build();
    }

    @Override
    public Applying toApplying(ApplyingRequestDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Applying.ApplyingBuilder applying = Applying.builder();

        applying.userId( dto.getUserId() );
        applying.postingId( dto.getPostingId() );
        applying.status( dto.getStatus() );
        applying.prContent( dto.getPrContent() );

        return applying.build();
    }

    @Override
    public List<ApplyingResponseDTO> toResponseDTOList(List<Applying> applyings) {
        if ( applyings == null ) {
            return null;
        }

        List<ApplyingResponseDTO> list = new ArrayList<ApplyingResponseDTO>( applyings.size() );
        for ( Applying applying : applyings ) {
            list.add( toResponseDTO( applying ) );
        }

        return list;
    }
}
