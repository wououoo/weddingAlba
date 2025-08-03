package wedding.alba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.Posting;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostingRepository extends JpaRepository<Posting, Long> {


    // 사용자별 모집글 조회
    List<Posting> findByUserId(Long userId);
    
    // 날짜별 모집글 조회
    List<Posting> findByAppointmentDatetimeBetween(LocalDateTime start, LocalDateTime end);
    
    // 최근 등록된 모집글 조회
    List<Posting> findByOrderByRegistrationDatetimeDesc();
    
    // 지역별 모집글 조회
    List<Posting> findByAddressContaining(String address);
    List<Posting> findBySidoSigunguContaining(String sidoSigungu);
    
    // 제목에 특정 키워드가 포함된 모집글 조회
    List<Posting> findByTitleContaining(String keyword);

}
