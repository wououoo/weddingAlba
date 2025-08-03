# PostgreSQL DISTINCT + ORDER BY 이슈 해결

## 🚨 발생한 문제

```
org.postgresql.util.PSQLException: 오류: SELECT DISTINCT, ORDER BY 표현식을 위해서 반드시 select list 에 나타나야만 합니다
```

## 🔍 문제 원인

PostgreSQL에서 `SELECT DISTINCT`와 `ORDER BY`를 함께 사용할 때, `ORDER BY` 절의 표현식이 SELECT 목록에 포함되어 있지 않으면 오류가 발생합니다.

기존 쿼리:
```sql
SELECT DISTINCT cr FROM ChatRoom cr 
JOIN ChatRoomParticipant crp ON cr.chatRoomId = crp.chatRoomId 
WHERE crp.userId = :userId AND crp.isActive = true 
ORDER BY COALESCE(cr.lastActiveAt, cr.lastMessageAt, cr.createdAt) DESC
```

## ✅ 해결 방법

### 1. Repository 수정
두 단계로 쿼리를 분리:

```java
// 1단계: 채팅방 ID 목록만 조회
@Query("SELECT DISTINCT crp.chatRoomId FROM ChatRoomParticipant crp " +
       "WHERE crp.userId = :userId AND crp.isActive = true")
List<Long> findChatRoomIdsByUserId(@Param("userId") Long userId);

// 2단계: 채팅방 정보 조회 (정렬 없이)
@Query("SELECT cr FROM ChatRoom cr WHERE cr.chatRoomId IN :chatRoomIds")
List<ChatRoom> findChatRoomsByIds(@Param("chatRoomIds") List<Long> chatRoomIds);
```

### 2. Service 수정
서비스 레벨에서 정렬 처리:

```java
@Transactional(readOnly = true)
public List<ChatRoom> getUserChatRooms(Long userId) {
    // 1. 채팅방 ID 목록 조회
    List<Long> chatRoomIds = chatRoomRepository.findChatRoomIdsByUserId(userId);
    
    if (chatRoomIds.isEmpty()) {
        return List.of();
    }
    
    // 2. 채팅방 정보 조회
    List<ChatRoom> chatRooms = chatRoomRepository.findChatRoomsByIds(chatRoomIds);
    
    if (chatRooms.isEmpty()) {
        return List.of();
    }
    
    // 3. LAST_ACTIVE_AT 기준으로 정렬
    chatRooms.sort((a, b) -> {
        LocalDateTime aTime = a.getLastActiveAt() != null ? a.getLastActiveAt() 
            : (a.getLastMessageAt() != null ? a.getLastMessageAt() : a.getCreatedAt());
        LocalDateTime bTime = b.getLastActiveAt() != null ? b.getLastActiveAt()
            : (b.getLastMessageAt() != null ? b.getLastMessageAt() : b.getCreatedAt());
        
        // DESC 정렬 (최신 순)
        return bTime.compareTo(aTime);
    });
    
    return chatRooms;
}
```

## 🎯 장점

1. **SQL 호환성**: PostgreSQL의 DISTINCT + ORDER BY 제약 해결
2. **성능**: 필요한 데이터만 조회 후 메모리에서 정렬
3. **유연성**: 복잡한 정렬 로직을 Java 코드로 처리 가능
4. **안전성**: 빈 결과 처리 및 null 안전성 강화

## 🔄 정렬 우선순위

```
lastActiveAt > lastMessageAt > createdAt
```

최신 활동 시간을 기준으로 내림차순 정렬

## 🚀 테스트 확인사항

1. 채팅방 목록 조회 시 SQL 오류 없이 정상 동작
2. 채팅방이 활동 시간 순으로 정렬되는지 확인
3. 빈 결과 처리가 안전한지 확인
4. null 값 처리가 올바른지 확인

## 📊 성능 고려사항

- 대량의 채팅방이 있는 경우 메모리 정렬보다는 DB 정렬이 효율적
- 필요시 페이징 처리나 캐싱 고려
- 채팅방 수가 많지 않은 현재 시점에서는 서비스 레벨 정렬이 적합
