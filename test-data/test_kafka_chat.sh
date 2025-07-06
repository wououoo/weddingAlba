#!/bin/bash

# 웨딩알바 카프카 채팅 테스트 스크립트
# userid 1번으로 실시간 메시지 전송 테스트

echo "🎉 웨딩알바 카프카 채팅 테스트 시작!"
echo "=================================="

# Kafka 컨테이너가 실행 중인지 확인
if ! docker ps | grep -q "kafka"; then
    echo "❌ Kafka 컨테이너가 실행되지 않았습니다!"
    echo "다음 명령어로 실행하세요: docker-compose up -d"
    exit 1
fi

echo "✅ Kafka 실행 확인됨"

# 토픽 존재 확인
echo "📋 현재 토픽 목록:"
docker exec kafka kafka-topics --list --bootstrap-server localhost:9092

echo ""
echo "🚀 userid 1번으로 테스트 메시지 전송 중..."

# 1. 1:1 채팅 메시지 (채팅방 1번)
echo "💬 1:1 채팅 메시지 전송 (채팅방 1번)"
docker exec kafka kafka-console-producer --bootstrap-server localhost:9092 --topic wedding-chat-messages --property "key=1" << 'EOF'
{
  "messageId": "test-msg-001",
  "chatRoomId": 1,
  "senderId": 1,
  "senderName": "이신부",
  "senderProfileImage": "/profiles/lee_bride.jpg",
  "content": "혹시 드레스 피팅은 언제 가능한가요?",
  "type": "CHAT",
  "timestamp": "2024-07-06T15:30:00",
  "isSystemMessage": false
}
EOF

sleep 2

# 2. 그룹 채팅 메시지 (채팅방 4번)
echo "👥 그룹 채팅 메시지 전송 (채팅방 4번)"
docker exec kafka kafka-console-producer --bootstrap-server localhost:9092 --topic wedding-chat-messages --property "key=4" << 'EOF'
{
  "messageId": "test-msg-002",
  "chatRoomId": 4,
  "senderId": 1,
  "senderName": "이신부",
  "senderProfileImage": "/profiles/lee_bride.jpg",
  "content": "다들 드레스는 어디서 준비하셨나요? 추천 좀 해주세요! 🙏",
  "type": "CHAT",
  "timestamp": "2024-07-06T15:31:00",
  "isSystemMessage": false
}
EOF

sleep 2

# 3. 멘션 메시지 (채팅방 4번)
echo "📢 멘션 메시지 전송 (채팅방 4번)"
docker exec kafka kafka-console-producer --bootstrap-server localhost:9092 --topic wedding-chat-messages --property "key=4" << 'EOF'
{
  "messageId": "test-msg-003",
  "chatRoomId": 4,
  "senderId": 1,
  "senderName": "이신부",
  "senderProfileImage": "/profiles/lee_bride.jpg",
  "content": "@김웨딩 혹시 드레스샵 정보 공유해주실 수 있나요?",
  "type": "MENTION",
  "timestamp": "2024-07-06T15:32:00",
  "mentionUserId": 2,
  "isSystemMessage": false
}
EOF

sleep 2

# 4. 타이핑 상태 메시지
echo "⌨️ 타이핑 상태 메시지 전송"
docker exec kafka kafka-console-producer --bootstrap-server localhost:9092 --topic wedding-chat-messages --property "key=1" << 'EOF'
{
  "messageId": "test-typing-001",
  "chatRoomId": 1,
  "senderId": 1,
  "senderName": "이신부",
  "type": "TYPING",
  "timestamp": "2024-07-06T15:33:00",
  "isSystemMessage": false
}
EOF

sleep 3

# 5. 타이핑 중지
echo "⏹️ 타이핑 중지 메시지 전송"
docker exec kafka kafka-console-producer --bootstrap-server localhost:9092 --topic wedding-chat-messages --property "key=1" << 'EOF'
{
  "messageId": "test-typing-002",
  "chatRoomId": 1,
  "senderId": 1,
  "senderName": "이신부",
  "type": "STOP_TYPING",
  "timestamp": "2024-07-06T15:33:03",
  "isSystemMessage": false
}
EOF

sleep 2

# 6. 실제 채팅 메시지 (타이핑 후)
echo "💭 타이핑 완료 후 메시지 전송"
docker exec kafka kafka-console-producer --bootstrap-server localhost:9092 --topic wedding-chat-messages --property "key=1" << 'EOF'
{
  "messageId": "test-msg-004",
  "chatRoomId": 1,
  "senderId": 1,
  "senderName": "이신부",
  "senderProfileImage": "/profiles/lee_bride.jpg",
  "content": "참고로 예산은 200만원 정도로 생각하고 있어요",
  "type": "CHAT",
  "timestamp": "2024-07-06T15:33:05",
  "isSystemMessage": false
}
EOF

sleep 2

# 7. 공개 채팅방 알바 구인 메시지 (채팅방 6번)
echo "💼 알바 구인 메시지 전송 (채팅방 6번)"
docker exec kafka kafka-console-producer --bootstrap-server localhost:9092 --topic wedding-chat-messages --property "key=6" << 'EOF'
{
  "messageId": "test-msg-005",
  "chatRoomId": 6,
  "senderId": 1,
  "senderName": "이신부",
  "senderProfileImage": "/profiles/lee_bride.jpg",
  "content": "🔔 웨딩 당일 도우미 구해요!\n📅 날짜: 12월 15일 토요일\n⏰ 시간: 오전 9시 ~ 오후 6시\n📍 장소: 강남구 ○○호텔\n💰 시급: 15,000원\n연락 주세요!",
  "type": "CHAT",
  "timestamp": "2024-07-06T15:34:00",
  "isSystemMessage": false
}
EOF

echo ""
echo "✅ 모든 테스트 메시지 전송 완료!"
echo ""
echo "🎯 확인 방법:"
echo "1. 카프카 UI: http://localhost:8090"
echo "2. 토픽 'wedding-chat-messages'에서 메시지 확인"
echo "3. 메시지 컨슈머 실행:"
echo "   docker exec kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic wedding-chat-messages --from-beginning"
echo ""
echo "🔍 실시간 메시지 모니터링:"
echo "   docker exec kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic wedding-chat-messages"
