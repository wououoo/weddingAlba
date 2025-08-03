package wedding.alba.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.Bookmark;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 북마크 데이터 접근 레포지토리 - JPA 방식
 *
 * JPA를 사용하여 타입 안전성을 보장하고 Object[] 변환 문제를 해결합니다.
 */
@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    /**
     * 사용자 ID로 북마크 목록 조회 (게시글 정보 포함, 페이징)
     * LEFT JOIN을 사용하여 게시글이 삭제된 북마크도 포함
     *
     * @param userId 사용자 ID
     * @param pageable 페이징 정보
     * @return 북마크 페이지 (게시글 정보 포함, 삭제된 게시글도 포함)
     */
    @Query("SELECT b FROM Bookmark b " +
            "LEFT JOIN FETCH b.posting p " +
            "WHERE b.userId = :userId " +
            "ORDER BY b.marcDate DESC")
    Page<Bookmark> findBookmarksWithPostingByUserId(@Param("userId") Long userId, Pageable pageable);

    /**
     * 북마크 ID로 조회 (게시글 정보 포함)
     * LEFT JOIN을 사용하여 게시글이 삭제된 경우도 처리
     *
     * @param bookmarkId 북마크 ID
     * @return 북마크 (게시글 정보 포함)
     */
    @Query("SELECT b FROM Bookmark b " +
            "LEFT JOIN FETCH b.posting p " +
            "WHERE b.bookmarkId = :bookmarkId")
    Optional<Bookmark> findBookmarkWithPostingById(@Param("bookmarkId") Long bookmarkId);

    /**
     * 사용자가 특정 게시글을 북마크했는지 확인
     *
     * @param userId 사용자 ID
     * @param postingId 게시글 ID
     * @return 북마크 여부
     */
    boolean existsByUserIdAndPostingId(Long userId, Long postingId);

    /**
     * 사용자와 게시글로 북마크 조회 (게시글 정보 포함)
     * LEFT JOIN을 사용하여 게시글이 삭제된 경우도 처리
     *
     * @param userId 사용자 ID
     * @param postingId 게시글 ID
     * @return 북마크 (게시글 정보 포함)
     */
    @Query("SELECT b FROM Bookmark b " +
            "LEFT JOIN FETCH b.posting p " +
            "WHERE b.userId = :userId AND b.postingId = :postingId")
    Optional<Bookmark> findBookmarkWithPostingByUserAndPosting(
            @Param("userId") Long userId,
            @Param("postingId") Long postingId
    );

    /**
     * 사용자의 총 북마크 개수 조회
     *
     * @param userId 사용자 ID
     * @return 북마크 총 개수
     */
    long countByUserId(Long userId);

    /**
     * 특정 게시글의 총 북마크 개수 조회
     *
     * @param postingId 게시글 ID
     * @return 해당 게시글의 북마크 총 개수
     */
    long countByPostingId(Long postingId);

    /**
     * 사용자 ID로 북마크 목록 조회 (게시글 정보 없이)
     *
     * @param userId 사용자 ID
     * @return 북마크 목록
     */
    List<Bookmark> findByUserIdOrderByMarcDateDesc(Long userId);

    /**
     * 게시글 ID로 북마크 목록 조회
     *
     * @param postingId 게시글 ID
     * @return 북마크 목록
     */
    List<Bookmark> findByPostingId(Long postingId);

    /**
     * 특정 기간 내에 생성된 북마크 조회 (게시글 정보 포함)
     * LEFT JOIN을 사용하여 삭제된 게시글도 포함
     *
     * @param userId 사용자 ID
     * @param startDate 시작 날짜
     * @param endDate 종료 날짜
     * @return 해당 기간의 북마크 목록
     */
    @Query("SELECT b FROM Bookmark b " +
            "LEFT JOIN FETCH b.posting p " +
            "WHERE b.userId = :userId " +
            "AND b.marcDate >= :startDate " +
            "AND b.marcDate <= :endDate " +
            "ORDER BY b.marcDate DESC")
    List<Bookmark> findBookmarksWithPostingByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * 사용자의 최근 북마크 N개 조회 (게시글 정보 포함)
     * LEFT JOIN을 사용하여 삭제된 게시글도 포함
     *
     * @param userId 사용자 ID
     * @param pageable 페이징 정보 (사이즈로 개수 제한)
     * @return 최근 북마크 목록
     */
    @Query("SELECT b FROM Bookmark b " +
            "LEFT JOIN FETCH b.posting p " +
            "WHERE b.userId = :userId " +
            "ORDER BY b.marcDate DESC")
    List<Bookmark> findRecentBookmarksWithPostingByUserId(
            @Param("userId") Long userId,
            Pageable pageable
    );

    /**
     * 메모가 있는 북마크만 조회 (게시글 정보 포함)
     * LEFT JOIN을 사용하여 삭제된 게시글도 포함
     *
     * @param userId 사용자 ID
     * @return 메모가 있는 북마크 목록
     */
    @Query("SELECT b FROM Bookmark b " +
            "LEFT JOIN FETCH b.posting p " +
            "WHERE b.userId = :userId " +
            "AND b.memo IS NOT NULL " +
            "AND b.memo != '' " +
            "ORDER BY b.marcDate DESC")
    List<Bookmark> findBookmarksWithPostingAndMemoByUserId(@Param("userId") Long userId);

    /**
     * 북마크 검색 (활성 게시글만 대상)
     * 삭제된 게시글의 북마크는 검색에서 제외
     *
     * @param userId 사용자 ID
     * @param keyword 검색 키워드
     * @param pageable 페이징 정보
     * @return 검색된 북마크 페이지
     */
    @Query("SELECT b FROM Bookmark b " +
            "JOIN FETCH b.posting p " +
            "WHERE b.userId = :userId " +
            "AND (p.title LIKE %:keyword% " +
            "OR p.address LIKE %:keyword% " +
            "OR p.personName LIKE %:keyword%) " +
            "ORDER BY b.marcDate DESC")
    Page<Bookmark> searchBookmarksWithPosting(
            @Param("userId") Long userId,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    /**
     * 삭제된 게시글의 북마크 목록 조회
     *
     * @param userId 사용자 ID
     * @param pageable 페이징 정보
     * @return 삭제된 게시글의 북마크 목록
     */
    @Query("SELECT b FROM Bookmark b " +
            "LEFT JOIN b.posting p " +
            "WHERE b.userId = :userId AND p.postingId IS NULL " +
            "ORDER BY b.marcDate DESC")
    Page<Bookmark> findBookmarksWithDeletedPostings(@Param("userId") Long userId, Pageable pageable);

    /**
     * 특정 사용자의 특정 게시글 북마크 삭제
     *
     * @param userId 사용자 ID
     * @param postingId 게시글 ID
     * @return 삭제된 행의 수
     */
    int deleteByUserIdAndPostingId(Long userId, Long postingId);

    /**
     * 사용자의 모든 북마크 삭제
     *
     * @param userId 사용자 ID
     * @return 삭제된 행의 수
     */
    int deleteByUserId(Long userId);

    /**
     * 특정 게시글의 모든 북마크 삭제
     *
     * @param postingId 게시글 ID
     * @return 삭제된 행의 수
     */
    int deleteByPostingId(Long postingId);
}