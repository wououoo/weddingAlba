  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !isConnected) {
      DEBUG.warn('메시지 전송 조건 미충족', { hasContent: !!content.trim(), isConnected });
      return;
    }
    
    try {
      // 👍 낙관적 업데이트 비활성화 (중복 방지를 위해 서버 응답만 사용)
      // const optimisticMessage: ChatMessage = {
      //   messageId: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      //   chatRoomId: chatRoomIdRef.current,
      //   senderId: userIdRef.current,
      //   senderName: userNameRef.current || '사용자',
      //   content: content.trim(),
      //   messageType: 'CHAT',
      //   timestamp: new Date().toISOString(),
      //   attachmentUrl: null,
      //   attachmentType: null,
      //   mentionUserId: null,
      //   senderProfileImage: null
      // };
      // 
      // setMessages(prev => [...prev, optimisticMessage]);
      
      // 실제 WebSocket 전송만 수행
      chatWebSocketService.sendMessage(content.trim());
      DEBUG.log('메시지 전송 완료 (서버 응답 대기)', { contentLength: content.trim().length });
    } catch (err) {
      DEBUG.error('메시지 전송 실패', err);
      setError('메시지 전송에 실패했습니다.');
    }
  }, [isConnected]);
