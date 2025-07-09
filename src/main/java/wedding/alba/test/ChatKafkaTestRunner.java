package wedding.alba.test;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Profile; // 필요 시 활성화
// import org.springframework.stereotype.Component; // 필요 시 활성화
import wedding.alba.kafka.service.ChatProducer;

/**
 * 웨딩알바 카프카 채팅 테스트 - userid 1번으로 실시간 메시지 전송
 * 
 * 사용법:
 * 1. docker-compose up -d (카프카 및 카프카 UI 실행)
 * 2. 스프링부트 애플리케이션 실행
 * 3. 브라우저에서 http://localhost:8090 (카프카 UI) 접속
 * 4. wedding-chat-messages 토픽에서 실시간 메시지 확인
 */
// @Component // 테스트용이므로 주석 처리
// @Profile("test") // 테스트 프로파일에서만 활성화
@RequiredArgsConstructor
@Slf4j
public class ChatKafkaTestRunner implements CommandLineRunner {

    private final ChatProducer chatProducer;

    @Override
    public void run(String... args) throws Exception {
        // 5초 대기 후 테스트 메시지 전송
        Thread.sleep(5000);
        
        log.info("🚀 웨딩알바 카프카 채팅 테스트 시작!");
        sendTestMessages();
    }

    /**
     * 테스트 메시지들 전송
     */
    private void sendTestMessages() {
        try {
            // 1. 1:1 채팅 메시지 (채팅방 1번 - 웨딩플래너와 상담)
            log.info("💬 1:1 채팅 메시지 전송 (채팅방 1번)");
            chatProducer.sendTextMessage(
                1L, 1L, "이신부", 
                "혹시 드레스 피팅은 언제 가능한가요?"
            );
            
            Thread.sleep(2000);
            
            // 2. 그룹 채팅 메시지 (채팅방 4번 - 2024 겨울 웨딩 준비 모임)
            log.info("👥 그룹 채팅 메시지 전송 (채팅방 4번)");
            chatProducer.sendTextMessage(
                4L, 1L, "이신부",
                "다들 드레스는 어디서 준비하셨나요? 추천 좀 해주세요! 🙏"
            );
            
            Thread.sleep(2000);
            
            // 3. 멘션 메시지 (채팅방 4번)
            log.info("📢 멘션 메시지 전송 (채팅방 4번)");
            chatProducer.sendMentionMessage(
                4L, 1L, "이신부",
                "@김웨딩 혹시 드레스샵 정보 공유해주실 수 있나요?",
                2L // 김웨딩 userid
            );
            
            Thread.sleep(2000);
            
            // 4. 타이핑 상태 메시지
            log.info("⌨️ 타이핑 상태 메시지 전송");
            chatProducer.sendTypingStatus(1L, "이신부", 1L, true);
            
            Thread.sleep(3000);
            
            // 5. 타이핑 중지 및 실제 메시지
            log.info("⏹️ 타이핑 중지 및 메시지 전송");
            chatProducer.sendTypingStatus(1L, "이신부", 1L, false);
            
            chatProducer.sendTextMessage(
                1L, 1L, "이신부",
                "참고로 예산은 200만원 정도로 생각하고 있어요"
            );
            
            Thread.sleep(2000);
            
            // 6. 공개 채팅방 알바 구인 메시지 (채팅방 6번)
            log.info("💼 알바 구인 메시지 전송 (채팅방 6번)");
            chatProducer.sendTextMessage(
                6L, 1L, "이신부",
                "🔔 웨딩 당일 도우미 구해요!\n" +
                "📅 날짜: 12월 15일 토요일\n" +
                "⏰ 시간: 오전 9시 ~ 오후 6시\n" +
                "📍 장소: 강남구 ○○호텔\n" +
                "💰 시급: 15,000원\n" +
                "연락 주세요!"
            );
            
            Thread.sleep(2000);
            
            // 7. 시스템 메시지
            log.info("🔔 시스템 메시지 전송");
            chatProducer.sendSystemMessage(6L, "새로운 알바 공고가 등록되었습니다.");
            
            log.info("✅ 모든 테스트 메시지 전송 완료!");
            log.info("🎯 카프카 UI에서 확인: http://localhost:8090");
            log.info("📊 토픽: wedding-chat-messages");
            
        } catch (Exception e) {
            log.error("❌ 테스트 메시지 전송 실패", e);
        }
    }
}
