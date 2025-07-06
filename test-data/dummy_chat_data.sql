-- 웨딩알바 채팅 시스템 더미데이터 (userid 1번 중심)
-- PostgreSQL용 스크립트

-- 기존 데이터 정리 (테스트용)
DELETE FROM chat_messages WHERE chat_room_id IN (1,2,3,4,5,6);
DELETE FROM chat_room_participants WHERE chat_room_id IN (1,2,3,4,5,6);
DELETE FROM chat_rooms WHERE chat_room_id IN (1,2,3,4,5,6);

-- 시퀀스 리셋 (필요시)
-- ALTER SEQUENCE chat_rooms_chat_room_id_seq RESTART WITH 1;
-- ALTER SEQUENCE chat_room_participants_participant_id_seq RESTART WITH 1;

-- 1. 채팅방 생성 (userid 1번이 참여하는 채팅방들)
INSERT INTO chat_rooms (chat_room_id, room_name, room_type, creator_user_id, host_user_id, guest_user_id, posting_id, is_public, description, created_at, updated_at, last_active_at, last_message_at) VALUES
-- 1:1 채팅방들 (userid 1번과 다른 사용자들)
(1, '웨딩플래너와 상담', 'PERSONAL', 1, 1, 2, 101, false, '2024년 12월 웨딩 준비 상담', NOW() - INTERVAL '2 days', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '5 minutes'),
(2, '사진사 섭외 문의', 'PERSONAL', 2, 2, 1, 102, false, '웨딩 스냅 촬영 문의', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
(3, '메이크업 아티스트', 'PERSONAL', 1, 1, 3, 103, false, '웨딩 메이크업 예약', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),

-- 그룹 채팅방들 (userid 1번이 참여)
(4, '2024 겨울 웨딩 준비 모임', 'GROUP', 1, NULL, NULL, NULL, false, '12월 웨딩 예정 신부들 모임', NOW() - INTERVAL '5 days', NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '10 minutes'),
(5, '강남구 웨딩홀 정보', 'GROUP', 4, NULL, NULL, NULL, true, '강남구 웨딩홀 추천 및 후기 공유', NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
(6, '웨딩 알바 구인구직', 'PUBLIC', 5, NULL, NULL, NULL, true, '웨딩 관련 알바 정보 공유', NOW() - INTERVAL '10 days', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes');

-- 2. 채팅방 참가자 설정
INSERT INTO chat_room_participants (chat_room_id, user_id, role, joined_at, is_active, is_notification_enabled) VALUES
-- 채팅방 1: userid 1번과 2번의 1:1 채팅
(1, 1, 'ADMIN', NOW() - INTERVAL '2 days', true, true),
(1, 2, 'MEMBER', NOW() - INTERVAL '2 days', true, true),

-- 채팅방 2: userid 1번과 2번의 1:1 채팅 (2번이 생성)
(2, 2, 'ADMIN', NOW() - INTERVAL '1 day', true, true),
(2, 1, 'MEMBER', NOW() - INTERVAL '1 day', true, true),

-- 채팅방 3: userid 1번과 3번의 1:1 채팅
(3, 1, 'ADMIN', NOW() - INTERVAL '3 hours', true, true),
(3, 3, 'MEMBER', NOW() - INTERVAL '3 hours', true, true),

-- 채팅방 4: 그룹 채팅 (userid 1,2,3,4 참여)
(4, 1, 'ADMIN', NOW() - INTERVAL '5 days', true, true),
(4, 2, 'MEMBER', NOW() - INTERVAL '5 days', true, true),
(4, 3, 'MEMBER', NOW() - INTERVAL '4 days', true, true),
(4, 4, 'MEMBER', NOW() - INTERVAL '3 days', true, true),

-- 채팅방 5: 공개 그룹 채팅 (userid 1,3,4,5 참여)
(5, 4, 'ADMIN', NOW() - INTERVAL '7 days', true, true),
(5, 1, 'MEMBER', NOW() - INTERVAL '6 days', true, true),
(5, 3, 'MEMBER', NOW() - INTERVAL '5 days', true, true),
(5, 5, 'MEMBER', NOW() - INTERVAL '4 days', true, true),

-- 채팅방 6: 알바 구인구직 (userid 1,2,3,4,5 모두 참여)
(6, 5, 'ADMIN', NOW() - INTERVAL '10 days', true, true),
(6, 1, 'MEMBER', NOW() - INTERVAL '9 days', true, true),
(6, 2, 'MEMBER', NOW() - INTERVAL '8 days', true, true),
(6, 3, 'MEMBER', NOW() - INTERVAL '7 days', true, true),
(6, 4, 'MODERATOR', NOW() - INTERVAL '6 days', true, true);

-- 3. 채팅 메시지 더미데이터 (userid 1번 중심)
INSERT INTO chat_messages (message_id, chat_room_id, sender_id, sender_name, sender_profile_image, content, message_type, timestamp, is_system_message, is_deleted) VALUES

-- 채팅방 1: 웨딩플래너와 상담 (1:1)
('msg-001-' || EXTRACT(epoch FROM NOW())::text, 1, 2, '김웨딩', '/profiles/kim_wedding.jpg', '안녕하세요! 12월 웨딩 준비 상담 문의드립니다.', 'CHAT', NOW() - INTERVAL '2 days', false, false),
('msg-002-' || EXTRACT(epoch FROM NOW())::text, 1, 1, '이신부', '/profiles/lee_bride.jpg', '네 안녕하세요! 언제쯤 예식 예정이신가요?', 'CHAT', NOW() - INTERVAL '2 days' + INTERVAL '5 minutes', false, false),
('msg-003-' || EXTRACT(epoch FROM NOW())::text, 1, 2, '김웨딩', '/profiles/kim_wedding.jpg', '12월 15일 토요일 오후 2시로 생각하고 있어요.', 'CHAT', NOW() - INTERVAL '2 days' + INTERVAL '10 minutes', false, false),
('msg-004-' || EXTRACT(epoch FROM NOW())::text, 1, 1, '이신부', '/profiles/lee_bride.jpg', '좋은 날짜네요! 예산은 어느 정도로 생각하고 계신가요?', 'CHAT', NOW() - INTERVAL '5 minutes', false, false),

-- 채팅방 2: 사진사 섭외 문의 (1:1)
('msg-005-' || EXTRACT(epoch FROM NOW())::text, 2, 2, '김웨딩', '/profiles/kim_wedding.jpg', '웨딩 스냅 촬영 문의드려요~', 'CHAT', NOW() - INTERVAL '1 day', false, false),
('msg-006-' || EXTRACT(epoch FROM NOW())::text, 2, 1, '이신부', '/profiles/lee_bride.jpg', '어떤 스타일을 원하시나요?', 'CHAT', NOW() - INTERVAL '1 day' + INTERVAL '2 minutes', false, false),
('msg-007-' || EXTRACT(epoch FROM NOW())::text, 2, 2, '김웨딩', '/profiles/kim_wedding.jpg', '자연스러운 스냅과 정식 웨딩 사진 모두 원해요', 'CHAT', NOW() - INTERVAL '1 day' + INTERVAL '5 minutes', false, false),
('msg-008-' || EXTRACT(epoch FROM NOW())::text, 2, 1, '이신부', '/profiles/lee_bride.jpg', '포트폴리오 보여드릴게요! 잠시만요', 'CHAT', NOW() - INTERVAL '1 hour', false, false),

-- 채팅방 3: 메이크업 아티스트 (1:1)
('msg-009-' || EXTRACT(epoch FROM NOW())::text, 3, 1, '이신부', '/profiles/lee_bride.jpg', '안녕하세요! 웨딩 메이크업 예약 가능한지 문의드려요', 'CHAT', NOW() - INTERVAL '3 hours', false, false),
('msg-010-' || EXTRACT(epoch FROM NOW())::text, 3, 3, '박메이크', '/profiles/park_makeup.jpg', '안녕하세요! 언제 예식이신가요?', 'CHAT', NOW() - INTERVAL '3 hours' + INTERVAL '1 minute', false, false),
('msg-011-' || EXTRACT(epoch FROM NOW())::text, 3, 1, '이신부', '/profiles/lee_bride.jpg', '12월 15일 토요일이에요! 시간은 오후 2시 예식입니다', 'CHAT', NOW() - INTERVAL '2 hours 50 minutes', false, false),
('msg-012-' || EXTRACT(epoch FROM NOW())::text, 3, 3, '박메이크', '/profiles/park_makeup.jpg', '해당 날짜 예약 가능해요! 리허설은 언제 하실 건가요?', 'CHAT', NOW() - INTERVAL '30 minutes', false, false),

-- 채팅방 4: 2024 겨울 웨딩 준비 모임 (그룹)
('msg-013-' || EXTRACT(epoch FROM NOW())::text, 4, 1, '이신부', '/profiles/lee_bride.jpg', '안녕하세요! 12월 웨딩 예정인 이신부입니다 😊', 'CHAT', NOW() - INTERVAL '5 days', false, false),
('msg-014-' || EXTRACT(epoch FROM NOW())::text, 4, 2, '김웨딩', '/profiles/kim_wedding.jpg', '저도 12월이에요! 반가워요~', 'CHAT', NOW() - INTERVAL '5 days' + INTERVAL '3 minutes', false, false),
('msg-015-' || EXTRACT(epoch FROM NOW())::text, 4, 3, '박메이크', '/profiles/park_makeup.jpg', '다들 준비 어디까지 하셨나요?', 'CHAT', NOW() - INTERVAL '4 days 22 hours', false, false),
('msg-016-' || EXTRACT(epoch FROM NOW())::text, 4, 4, '최플래너', '/profiles/choi_planner.jpg', '웨딩홀은 정하셨나요? 12월은 정말 인기 시즌이라...', 'CHAT', NOW() - INTERVAL '4 days 20 hours', false, false),
('msg-017-' || EXTRACT(epoch FROM NOW())::text, 4, 1, '이신부', '/profiles/lee_bride.jpg', '@최플래너 웨딩홀은 정했는데 드레스가 고민이에요 😭', 'MENTION', NOW() - INTERVAL '4 days 19 hours', false, false),
('msg-018-' || EXTRACT(epoch FROM NOW())::text, 4, 2, '김웨딩', '/profiles/kim_wedding.jpg', '저는 드레스 3벌 보고 결정했어요! 시간 여유 있을 때 많이 봐두세요', 'CHAT', NOW() - INTERVAL '10 minutes', false, false),

-- 채팅방 5: 강남구 웨딩홀 정보 (공개 그룹)
('msg-019-' || EXTRACT(epoch FROM NOW())::text, 5, 4, '최플래너', '/profiles/choi_planner.jpg', '강남 ○○호텔 웨딩홀 후기 공유드려요!', 'CHAT', NOW() - INTERVAL '7 days', false, false),
('msg-020-' || EXTRACT(epoch FROM NOW())::text, 5, 5, '정알바', '/profiles/jung_alba.jpg', '오 궁금해요! 가격대는 어떻게 되나요?', 'CHAT', NOW() - INTERVAL '6 days 23 hours', false, false),
('msg-021-' || EXTRACT(epoch FROM NOW())::text, 5, 1, '이신부', '/profiles/lee_bride.jpg', '저도 그 호텔 고려 중인데 자세한 후기 부탁드려요!', 'CHAT', NOW() - INTERVAL '6 days 22 hours', false, false),
('msg-022-' || EXTRACT(epoch FROM NOW())::text, 5, 4, '최플래너', '/profiles/choi_planner.jpg', '홀 크기별로 가격이 다른데 중형홀 기준 1500만원 정도예요', 'CHAT', NOW() - INTERVAL '6 days 20 hours', false, false),
('msg-023-' || EXTRACT(epoch FROM NOW())::text, 5, 3, '박메이크', '/profiles/park_makeup.jpg', '음식은 어떤가요? 하객들 반응이...', 'CHAT', NOW() - INTERVAL '2 hours', false, false),

-- 채팅방 6: 웨딩 알바 구인구직 (대형 공개)
('msg-024-' || EXTRACT(epoch FROM NOW())::text, 6, 5, '정알바', '/profiles/jung_alba.jpg', '🔔 12월 웨딩 알바 모집 공지', 'SYSTEM', NOW() - INTERVAL '10 days', true, false),
('msg-025-' || EXTRACT(epoch FROM NOW())::text, 6, 1, '이신부', '/profiles/lee_bride.jpg', '웨딩 당일 도우미 구해요! 12/15 토요일 강남 쪽', 'CHAT', NOW() - INTERVAL '9 days', false, false),
('msg-026-' || EXTRACT(epoch FROM NOW())::text, 6, 2, '김웨딩', '/profiles/kim_wedding.jpg', '시간당 얼마인가요?', 'CHAT', NOW() - INTERVAL '9 days' + INTERVAL '5 minutes', false, false),
('msg-027-' || EXTRACT(epoch FROM NOW())::text, 6, 1, '이신부', '/profiles/lee_bride.jpg', '시간당 15,000원이고 8시간 정도 예상해요', 'CHAT', NOW() - INTERVAL '9 days' + INTERVAL '10 minutes', false, false),
('msg-028-' || EXTRACT(epoch FROM NOW())::text, 6, 3, '박메이크', '/profiles/park_makeup.jpg', '메이크업 보조 경험 있어서 지원하고 싶어요!', 'CHAT', NOW() - INTERVAL '8 days 23 hours', false, false),
('msg-029-' || EXTRACT(epoch FROM NOW())::text, 6, 4, '최플래너', '/profiles/choi_planner.jpg', '웨딩 플래너 보조도 필요하시면 연락주세요', 'CHAT', NOW() - INTERVAL '8 days 20 hours', false, false),
('msg-030-' || EXTRACT(epoch FROM NOW())::text, 6, 1, '이신부', '/profiles/lee_bride.jpg', '@박메이크 @최플래너 DM으로 연락드릴게요!', 'MENTION', NOW() - INTERVAL '15 minutes', false, false);

-- 4. 읽음 상태 업데이트 (userid 1번의 읽음 상태)
UPDATE chat_room_participants 
SET last_read_message_id = (
    SELECT message_id 
    FROM chat_messages 
    WHERE chat_room_id = chat_room_participants.chat_room_id 
    ORDER BY timestamp DESC 
    LIMIT 1
),
last_read_at = NOW() - INTERVAL '1 minute'
WHERE user_id = 1;

-- 5. 시퀀스 업데이트 (필요시)
SELECT setval('chat_rooms_chat_room_id_seq', (SELECT MAX(chat_room_id) FROM chat_rooms));
SELECT setval('chat_room_participants_participant_id_seq', (SELECT MAX(participant_id) FROM chat_room_participants));

-- 6. 확인 쿼리들
SELECT '=== 채팅방 목록 (userid 1번 참여) ===' as info;
SELECT 
    cr.chat_room_id,
    cr.room_name,
    cr.room_type,
    cr.description,
    CASE 
        WHEN cr.room_type = 'PERSONAL' THEN 
            CASE WHEN cr.host_user_id = 1 THEN cr.guest_user_id ELSE cr.host_user_id END
        ELSE NULL 
    END as other_user_id,
    cr.created_at,
    cr.last_message_at
FROM chat_rooms cr
JOIN chat_room_participants crp ON cr.chat_room_id = crp.chat_room_id
WHERE crp.user_id = 1 AND crp.is_active = true
ORDER BY cr.last_message_at DESC;

SELECT '=== 최근 메시지들 (userid 1번 관련) ===' as info;
SELECT 
    cm.chat_room_id,
    cr.room_name,
    cm.sender_name,
    cm.content,
    cm.message_type,
    cm.timestamp
FROM chat_messages cm
JOIN chat_rooms cr ON cm.chat_room_id = cr.chat_room_id
JOIN chat_room_participants crp ON cr.chat_room_id = crp.chat_room_id
WHERE crp.user_id = 1 AND crp.is_active = true
ORDER BY cm.timestamp DESC
LIMIT 20;

-- 커밋
COMMIT;