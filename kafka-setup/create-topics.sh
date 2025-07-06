#!/bin/bash

# Wait for Kafka to be ready
echo "Waiting for Kafka to be ready..."
sleep 30

# Create topics for Wedding Alba project
echo "Creating Wedding Alba topics..."

# 알바 지원 관련 토픽
kafka-topics --create --bootstrap-server kafka:29092 --replication-factor 1 --partitions 3 --topic wedding-job-applications
kafka-topics --create --bootstrap-server kafka:29092 --replication-factor 1 --partitions 3 --topic wedding-job-assignments
kafka-topics --create --bootstrap-server kafka:29092 --replication-factor 1 --partitions 1 --topic wedding-job-notifications

# 웨딩 예약 관련 토픽
kafka-topics --create --bootstrap-server kafka:29092 --replication-factor 1 --partitions 3 --topic wedding-reservations
kafka-topics --create --bootstrap-server kafka:29092 --replication-factor 1 --partitions 1 --topic wedding-reservation-confirmations

# 채팅 관련 토픽
kafka-topics --create --bootstrap-server kafka:29092 --replication-factor 1 --partitions 5 --topic wedding-chat-messages
kafka-topics --create --bootstrap-server kafka:29092 --replication-factor 1 --partitions 1 --topic wedding-chat-notifications

# 결제 관련 토픽
kafka-topics --create --bootstrap-server kafka:29092 --replication-factor 1 --partitions 3 --topic wedding-payments
kafka-topics --create --bootstrap-server kafka:29092 --replication-factor 1 --partitions 1 --topic wedding-payment-confirmations

# 알림 시스템 토픽
kafka-topics --create --bootstrap-server kafka:29092 --replication-factor 1 --partitions 1 --topic wedding-system-notifications
kafka-topics --create --bootstrap-server kafka:29092 --replication-factor 1 --partitions 1 --topic wedding-email-notifications
kafka-topics --create --bootstrap-server kafka:29092 --replication-factor 1 --partitions 1 --topic wedding-sms-notifications

echo "All Wedding Alba topics created successfully!"

# List all topics
echo "Current topics:"
kafka-topics --list --bootstrap-server kafka:29092
