package wedding.alba.kafka.config;

import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaAdmin;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaTopicConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public KafkaAdmin kafkaAdmin() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        return new KafkaAdmin(configs);
    }

    // 채팅 메시지 토픽
    @Bean
    public NewTopic chatMessageTopic() {
        return new NewTopic("chat-messages", 3, (short) 1);
    }

    // 알림 토픽
    @Bean
    public NewTopic notificationTopic() {
        return new NewTopic("notifications", 3, (short) 1);
    }

    // 사용자 상태 토픽 (온라인/오프라인)
    @Bean
    public NewTopic userStatusTopic() {
        return new NewTopic("user-status", 1, (short) 1);
    }

    // 시스템 이벤트 토픽 (결혼식 신청, 승인 등)
    @Bean
    public NewTopic systemEventTopic() {
        return new NewTopic("system-events", 2, (short) 1);
    }
}
