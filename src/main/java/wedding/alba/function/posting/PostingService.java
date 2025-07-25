package wedding.alba.function.posting;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import wedding.alba.entity.Applying;
import wedding.alba.entity.Posting;
import wedding.alba.entity.Profile;
import wedding.alba.function.applying.ApplyingRepository;
import wedding.alba.function.postHistory.mapper.PostHistoryMapper;
import wedding.alba.function.postHistory.dto.PostHistoryDTO;
import wedding.alba.function.postHistory.PostHistoryService;
import wedding.alba.function.posting.dto.MyPostingReponseDTO;
import wedding.alba.function.posting.dto.PostingRequestDTO;
import wedding.alba.function.posting.dto.PostingResponseDTO;
import wedding.alba.function.posting.mapper.PostingMapper;
import wedding.alba.function.profile.ProfileRepository;

@Service
@Slf4j
public class PostingService {

    @Autowired
    private PostingRepository postingRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ApplyingRepository applyingRepository;

    @Autowired
    private PostHistoryService postHistoryService;

    @Autowired
    private PostingMapper postingMapper;

    @Autowired
    private PostHistoryMapper postHistoryMapper;

    // 모집글 작성
    public PostingResponseDTO createPosting(PostingRequestDTO postingDto) {
        // dto -> Posting 엔터티로 변경
        Posting posting = postingMapper.toPosting(postingDto);

        // insert
        Posting responsePosting = postingRepository.save(posting);

        PostingResponseDTO responseDTO = PostingResponseDTO.builder()
                .postingId(responsePosting.getPostingId())
                .build();

        return responseDTO;
    }

    // 모집글 수정
    @Transactional
    public PostingResponseDTO updatePosting(Long userId, Long postingId, PostingRequestDTO postingDto) {
        Posting existPosting = postingRepository.findById(postingId)
                .orElseThrow(() -> {
                        log.error("존재하지 않는 모집글 {}  수정 시도", postingId);
                         return new IllegalArgumentException("존재하지 않는 모집글입니다.");
                    });

        // 본인 게시글인지, 수정할려는 게시글이 맞는지 확인
        if(!existPosting.getUserId().equals(userId)) {
            log.warn("사용자 {}가 다른 사용자의 모집글 {} 수정 시도", postingDto.getUserId(), postingId);
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        postingDto.setUserId(userId);
        postingDto.setPostingId(postingId);
        postingMapper.updatePostingFromDto(postingDto, existPosting);
        Posting updatePosting = postingRepository.save(existPosting);
        log.info("사용자 {}가  모집글 {} 수정완료", updatePosting.getUserId(), updatePosting.getPostingId());

        PostingResponseDTO responseDTO = PostingResponseDTO.builder()
                .postingId(updatePosting.getPostingId())
                .build();
        return responseDTO;
    }

    @Transactional
    public void deletePosting(Long userId, Long postingId) {
        Posting existPosting = postingRepository.findById(postingId)
                .orElseThrow(() -> {
                    log.error("존재하지 않는 모집글 {}  삭제 시도", postingId);
                    return new IllegalArgumentException("존재하지 않는 모집글입니다.");
                });

        // 본인 게시글인지, 수정할려는 게시글이 맞는지 확인
        if(!existPosting.getUserId().equals(userId)) {
            log.warn("사용자 {}가 다른 사용자의 모집글 {} 삭제 시도", userId, postingId);
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }

        // 삭제전에 신청글 확인
        // 확정된 신청글이있는경우, 신청이력테이블로 데이터 이동
        // 없는경우, 신청글 모두 신청이력테이블로 이동 모집글 이력으로 이동

        // 모집글 히스토리로 데이터 이동 (상태 : -1)
        // 실패시 삭제 시도안하고 전체 롤백되게
        PostHistoryDTO historyDTO = postHistoryMapper.toPostHistoryDTO(existPosting, true);
        Long postHistoryId = postHistoryService.movePostingToHistory(historyDTO);

        if(postHistoryId == null || postHistoryId == 0L) {
            log.error("모집글 {}을 모집글 이력으로 데이터 이동 실패", postingId);
            throw new RuntimeException("모집글 이력 저장에 실패하여 삭제를 중단합니다.");
        }

        // 모집글 삭제
        postingRepository.deleteById(postingId);
    }

    @Transactional
    public void confirmationPosting(Long postingId, Long userId) {
        Posting existPosting = postingRepository.findById(postingId)
                .orElseThrow(() -> {
                    log.error("존재하지 않는 모집글 {}  확정 시도", postingId);
                    return new IllegalArgumentException("존재하지 않는 모집글입니다.");
                });

        // 본인 게시글인지, 확정할려는 게시글이 맞는지 확인
        if(!existPosting.getUserId().equals(userId)) {
            log.warn("사용자 {}가 다른 사용자의 모집글 {} 삭제 시도", userId, postingId);
            throw new IllegalArgumentException("확정 권한이 없습니다.");
        }

        List<Applying> existApplyingList = applyingRepository.findByPostingId(postingId).stream().toList();

        // 모집글 이력으로 이동
        PostHistoryDTO historyDTO = postHistoryMapper.toPostHistoryDTO(existPosting, false);
        Long postHistoryId = postHistoryService.movePostingToHistory(historyDTO);







    }

    public void getPostingAndApplying(Long postingId, Long userId) {

    }

    // 전체 모집글 리스트 조회
    public Page<PostingResponseDTO> getAllPostingList(int page, int size, String address, String guestMainRole) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "registrationDatetime"));
            // 페이징으로 Posting 엔터티 조회
            Page<Posting> postingPage = postingRepository.findPostingPageByKeyword(pageable, LocalDateTime.now(), address,guestMainRole);
            
            // 각 Posting에  DTO로 변환
            List<PostingResponseDTO> dtoList = new ArrayList<>();
            for(Posting posting : postingPage.getContent()) {
                PostingResponseDTO dto = postingMapper.toDetailDTO(posting);
                dto.setPayTypeStr();
                dtoList.add(dto);
            }
            
            // Page<PostingResponseDTO>로 변환하여 반환
            return new PageImpl<>(dtoList, pageable, postingPage.getTotalElements());
            
        } catch (Exception e) {
            log.error("페이징 모집글 조회 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("페이징 모집글 조회에 실패했습니다.",    e);
        }
    }


    public Page<MyPostingReponseDTO> getMyPostingPage(int page, int size, Long userId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "registrationDatetime"));
        Page<Posting> myPostingPage = postingRepository.findPostingPageByUserId(pageable,userId);
        List<MyPostingReponseDTO> myPostingList = new ArrayList<>();
        for(Posting posting : myPostingPage.getContent()) {
            List<Applying> applyingList = applyingRepository.findByPostingId(posting.getPostingId());

            // 신청 개수
            int applyCount = applyingList.size();

            // 확정된 신청 개수 (status == 1)
            int confirmationCount = (int) applyingList.stream()
                    .filter(applying -> applying.getStatus() == 1)
                    .count();

            MyPostingReponseDTO postingReponseDTO = postingMapper.toMyPostingReponseDTO(posting, applyCount, confirmationCount);
            postingReponseDTO.getPosting().setPayTypeStr();
            postingReponseDTO.setStatus(0);         // 모집중
            myPostingList.add(postingReponseDTO);
        }

        return new PageImpl<>(myPostingList, pageable, myPostingPage.getTotalElements());
    }

    // 상세페이지
    public PostingResponseDTO getPostingDetail(Long postingId) {
        Posting posting = postingRepository.findById(postingId).orElseThrow(() -> new NoSuchElementException("모집글을 찾을 수 없습니다. ID: " + postingId));
        Profile profile = profileRepository.findByUserId(posting.getUserId()).orElseThrow(() -> new NoSuchElementException("사용자 프로필을 찾을 수 없습니다. ID: " + postingId));
        PostingResponseDTO dto = postingMapper.toDetailDTO(posting);
        dto.setPayTypeStr();
        return dto;
    }

}
