package wedding.alba.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 🚀 성능 최적화된 메시지 브로커 설정
        config.enableSimpleBroker("/topic", "/queue")
                .setHeartbeatValue(new long[]{10000, 10000}) // 하트비트 간격 (클라이언트, 서버)
                .setTaskScheduler(heartbeatTaskScheduler()); // TaskScheduler 설정
        
        // 클라이언트에서 서버로 메시지 보낼 때 사용할 경로
        config.setApplicationDestinationPrefixes("/app");
        
        // 개별 사용자에게 메시지 보낼 때 사용
        config.setUserDestinationPrefix("/user");
        
        // 🚀 메시지 크기 제한 및 캐시 설정
        config.setCacheLimit(1024); // 캐시 크기
        config.setPreservePublishOrder(true); // 메시지 순서 보장
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 🚀 WebSocket 연결 엔드포인트 최적화
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS()
                .setSessionCookieNeeded(false) // 쿠키 비활성화로 성능 향상
                .setHeartbeatTime(25000) // SockJS 하트비트
                .setDisconnectDelay(5000) // 연결 해제 지연 시간
                .setStreamBytesLimit(128 * 1024) // 스트림 크기 제한 (128KB)
                .setHttpMessageCacheSize(1000); // HTTP 메시지 캐시 크기
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        // 🚀 WebSocket 전송 최적화
        registration
                .setMessageSizeLimit(128 * 1024) // 메시지 크기 제한 (128KB)
                .setSendBufferSizeLimit(512 * 1024) // 송신 버퍼 크기 (512KB)
                .setSendTimeLimit(20 * 1000) // 송신 시간 제한 (20초)
                .setTimeToFirstMessage(30 * 1000); // 첫 메시지까지 대기 시간 (30초)
    }

    @Bean
    public TaskScheduler heartbeatTaskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(10);
        scheduler.setThreadNamePrefix("websocket-heartbeat-");
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        scheduler.setAwaitTerminationSeconds(60);
        scheduler.initialize();
        return scheduler;
    }
}
