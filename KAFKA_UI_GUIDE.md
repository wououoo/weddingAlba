# 웨딩알바 카프카 UI 설정 가이드

## 🎉 카프카 UI 설정 완료!

웨딩알바 프로젝트에 카프카 UI가 성공적으로 추가되었습니다.

## 🚀 시작하기

### 1. 카프카 서비스 시작
```bash
# 프로젝트 디렉토리에서
docker-compose up -d
```

### 2. 카프카 UI 접속
- **URL**: http://localhost:8090
- **클러스터 이름**: wedding-local

### 3. 초기 토픽 확인
다음 토픽들이 자동으로 생성됩니다:
- `wedding-job-applications` - 알바 지원 이벤트
- `wedding-job-assignments` - 알바 배정 이벤트
- `wedding-job-notifications` - 알바 관련 알림
- `wedding-reservations` - 웨딩 예약 이벤트
- `wedding-reservation-confirmations` - 예약 확인
- `wedding-chat-messages` - 채팅 메시지
- `wedding-chat-notifications` - 채팅 알림
- `wedding-payments` - 결제 이벤트
- `wedding-payment-confirmations` - 결제 확인
- `wedding-system-notifications` - 시스템 알림
- `wedding-email-notifications` - 이메일 알림
- `wedding-sms-notifications` - SMS 알림

## 🔧 사용법

### 카프카 UI에서 할 수 있는 일:
1. **토픽 관리**: 토픽 생성, 삭제, 설정 변경
2. **메시지 확인**: 실시간 메시지 모니터링
3. **컨슈머 그룹**: 컨슈머 그룹 상태 확인
4. **브로커 상태**: 카프카 브로커 헬스 체크
5. **스키마 관리**: 메시지 스키마 확인

### 개발 시 활용:
- 알바 지원 이벤트 디버깅
- 채팅 메시지 흐름 추적
- 결제 이벤트 모니터링
- 알림 시스템 테스트

## 🎯 웨딩알바 프로젝트 통합 예시

### Spring Boot에서 카프카 사용:
```java
@Component
public class WeddingJobEventProducer {
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    public void sendJobApplication(JobApplicationEvent event) {
        kafkaTemplate.send("wedding-job-applications", event);
    }
}
```

### 메시지 컨슈머:
```java
@KafkaListener(topics = "wedding-job-applications")
public void handleJobApplication(JobApplicationEvent event) {
    // 알바 지원 처리 로직
}
```

## 🛠️ 문제 해결

### 카프카 UI 접속 안됨:
1. 서비스 상태 확인: `docker-compose ps`
2. 로그 확인: `docker-compose logs kafka-ui`
3. 포트 확인: 8090 포트가 사용 중인지 확인

### 토픽이 생성되지 않음:
1. 카프카 초기화 로그 확인: `docker-compose logs kafka-init`
2. 수동 토픽 생성: `docker-compose exec kafka kafka-topics --create --bootstrap-server localhost:9092 --topic [토픽명]`

## 📊 모니터링

카프카 UI에서 다음을 모니터링할 수 있습니다:
- 메시지 처리량
- 컨슈머 랙
- 파티션 상태
- 브로커 메트릭

## 🔄 업데이트

새로운 토픽이 필요한 경우:
1. `kafka-setup/create-topics.sh` 파일 수정
2. `docker-compose restart kafka-init`

---

**Happy Coding! 🎊**
