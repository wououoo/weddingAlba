package wedding.alba.function.bookMark;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 북마크 응답 DTO
 *
 * 서버에서 클라이언트로 북마크 정보를 전송할 때 사용하는 데이터 전송 객체입니다.
 * Native Query 결과를 처리하기 위해 Map 변환 메서드를 포함합니다.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookmarkResponseDto {

    /**
     * 북마크 ID
     */
    private Long bookmarkId;

    /**
     * 북마크된 게시글 ID
     */
    private Long postingId;

    /**
     * 북마크한 사용자 ID
     */
    private Long userId;

    /**
     * 북마크 메모
     */
    private String memo;

    /**
     * 북마크한 날짜/시간
     */
    private LocalDateTime marcDate;

    /**
     * 연관된 게시글 정보
     */
    private PostingDto posting;

    /**
     * 게시글이 삭제되었는지 여부
     */
    @Builder.Default
    private boolean isPostingDeleted = false;

    /**
     * 게시글 정보 DTO
     * 북마크와 연관된 게시글의 주요 정보를 담습니다.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PostingDto {

        /**
         * 게시글 ID
         */
        private Long postingId;

        /**
         * 게시글 제목
         */
        private String title;

        /**
         * 결혼식 예정 일시
         */
        private LocalDateTime appointmentDatetime;

        /**
         * 결혼식 장소
         */
        private String location;

        /**
         * 본인 결혼식 여부 (0: 지인, 1: 본인)
         */
        private Integer isSelf;

        /**
         * 결혼식 당사자 이름
         */
        private String personName;

        /**
         * 결혼식 당사자 연락처
         */
        private String personPhoneNumber;

        /**
         * 모바일 청첩장 유무 (0: 없음, 1: 있음)
         */
        private Integer hasMobileInvitation;

        /**
         * 게시글 등록 일시
         */
        private LocalDateTime registrationDatetime;

        /**
         * 게시글 작성자 ID
         */
        private Long userId;

        /**
         * Native Query Map에서 PostingDto 생성
         *
         * @param resultMap Native Query 결과 Map
         * @return PostingDto 객체
         */
        public static PostingDto fromMap(Map<String, Object> resultMap) {
            return PostingDto.builder()
                    .postingId(getLongValue(resultMap, "posting_id"))
                    .title((String) resultMap.get("title"))
                    .appointmentDatetime((LocalDateTime) resultMap.get("appointment_datetime"))
                    .location((String) resultMap.get("location"))
                    .isSelf((Integer) resultMap.get("is_self"))
                    .personName((String) resultMap.get("person_name"))
                    .personPhoneNumber((String) resultMap.get("person_phone_number"))
                    .hasMobileInvitation((Integer) resultMap.get("has_mobile_invitation"))
                    .registrationDatetime((LocalDateTime) resultMap.get("registration_datetime"))
                    .userId(getLongValue(resultMap, "posting_user_id"))
                    .build();
        }
    }

    /**
     * Native Query Map에서 BookmarkResponseDto 생성
     *
     * @param resultMap Native Query 결과 Map
     * @return BookmarkResponseDto 객체
     */
    public static BookmarkResponseDto fromMap(Map<String, Object> resultMap) {
        return BookmarkResponseDto.builder()
                .bookmarkId(getLongValue(resultMap, "bookmark_id"))
                .postingId(getLongValue(resultMap, "posting_id"))
                .userId(getLongValue(resultMap, "user_id"))
                .memo((String) resultMap.get("memo"))
                .marcDate((LocalDateTime) resultMap.get("marc_date"))
                .posting(PostingDto.fromMap(resultMap))
                .build();
    }

    /**
     * Native Query Map에서 BookmarkResponseDto 생성 (메모 별도 지정)
     *
     * @param resultMap Native Query 결과 Map
     * @param memo 메모 (업데이트된 메모 사용 시)
     * @return BookmarkResponseDto 객체
     */
    public static BookmarkResponseDto fromMap(Map<String, Object> resultMap, String memo) {
        return BookmarkResponseDto.builder()
                .bookmarkId(getLongValue(resultMap, "bookmark_id"))
                .postingId(getLongValue(resultMap, "posting_id"))
                .userId(getLongValue(resultMap, "user_id"))
                .memo(memo)
                .marcDate((LocalDateTime) resultMap.get("marc_date"))
                .posting(PostingDto.fromMap(resultMap))
                .build();
    }

    /**
     * Map에서 Long 값을 안전하게 추출하는 헬퍼 메서드
     *
     * @param map 결과 Map
     * @param key 키
     * @return Long 값
     */
    private static Long getLongValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        return null;
    }

    /**
     * Map에서 Integer 값을 안전하게 추출하는 헬퍼 메서드
     *
     * @param map 결과 Map
     * @param key 키
     * @return Integer 값
     */
    private static Integer getIntegerValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        return null;
    }

    /**
     * 북마크 여부만 확인하는 간단한 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookmarkStatusDto {
        private Boolean isBookmarked;
        private Long bookmarkId;
        private String memo;
        private LocalDateTime marcDate;

        public static BookmarkStatusDto fromBookmark(BookmarkResponseDto bookmark) {
            if (bookmark == null) {
                return BookmarkStatusDto.builder()
                        .isBookmarked(false)
                        .build();
            }

            return BookmarkStatusDto.builder()
                    .isBookmarked(true)
                    .bookmarkId(bookmark.getBookmarkId())
                    .memo(bookmark.getMemo())
                    .marcDate(bookmark.getMarcDate())
                    .build();
        }
    }
}
