-- LAST_ACTIVE_AT 컬럼 데이터 업데이트 스크립트
-- 기존 채팅방들의 LAST_ACTIVE_AT이 NULL인 경우 LAST_MESSAGE_AT 또는 CREATED_AT으로 업데이트

UPDATE chat_rooms 
SET last_active_at = COALESCE(last_message_at, created_at, CURRENT_TIMESTAMP)
WHERE last_active_at IS NULL;

-- 업데이트 결과 확인
SELECT 
    chat_room_id,
    room_name,
    room_type,
    created_at,
    last_message_at,
    last_active_at,
    CASE 
        WHEN last_active_at = last_message_at THEN 'Updated from last_message_at'
        WHEN last_active_at = created_at THEN 'Updated from created_at'
        ELSE 'Already had value'
    END as update_source
FROM chat_rooms 
ORDER BY last_active_at DESC
LIMIT 10;

-- 통계 확인
SELECT 
    COUNT(*) as total_rooms,
    COUNT(last_active_at) as rooms_with_last_active_at,
    COUNT(last_message_at) as rooms_with_last_message_at,
    COUNT(*) - COUNT(last_active_at) as rooms_without_last_active_at
FROM chat_rooms;
