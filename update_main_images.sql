-- 기존 갤러리 이미지 중 image_order가 1인 이미지들을 is_main = true로 업데이트
UPDATE profile_gallery 
SET is_main = true 
WHERE image_order = 1 
AND is_main = false;

-- 확인용 쿼리
SELECT user_id, image_order, is_main, image_url 
FROM profile_gallery 
ORDER BY user_id, image_order;
