import { useState, useEffect, useCallback } from 'react';

// 채팅방 캐시 (메모리 캐시)
const chatRoomCache = new Map();
const chatMessageCache = new Map();

// 캐시 유효 시간 (5분)
const CACHE_DURATION = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const useChatCache = () => {
  // 캐시에서 데이터 가져오기
  const getCachedData = useCallback(<T>(key: string): T | null => {
    const entry = chatRoomCache.get(key) as CacheEntry<T> | undefined;
    
    if (entry && (Date.now() - entry.timestamp) < CACHE_DURATION) {
      return entry.data;
    }
    
    // 만료된 캐시 삭제
    if (entry) {
      chatRoomCache.delete(key);
    }
    
    return null;
  }, []);

  // 캐시에 데이터 저장
  const setCachedData = useCallback(<T>(key: string, data: T): void => {
    chatRoomCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }, []);

  // 메시지 캐시 (채팅방별)
  const getCachedMessages = useCallback((chatRoomId: number) => {
    return getCachedData(`messages_${chatRoomId}`);
  }, [getCachedData]);

  const setCachedMessages = useCallback((chatRoomId: number, messages: any[]) => {
    setCachedData(`messages_${chatRoomId}`, messages);
  }, [setCachedData]);

  // 채팅방 정보 캐시
  const getCachedChatRoom = useCallback((chatRoomId: number) => {
    return getCachedData(`room_${chatRoomId}`);
  }, [getCachedData]);

  const setCachedChatRoom = useCallback((chatRoomId: number, room: any) => {
    setCachedData(`room_${chatRoomId}`, room);
  }, [setCachedData]);

  // 캐시 전체 삭제
  const clearCache = useCallback(() => {
    chatRoomCache.clear();
    chatMessageCache.clear();
  }, []);

  return {
    getCachedMessages,
    setCachedMessages,
    getCachedChatRoom,
    setCachedChatRoom,
    clearCache
  };
};

// 프리로딩 훅
export const useChatPreloader = () => {
  const [preloadedRooms, setPreloadedRooms] = useState<Set<number>>(new Set());

  // 채팅방 목록 미리 로드
  const preloadChatRooms = useCallback(async (userId: number) => {
    // 백그라운드에서 사용자의 채팅방 목록 미리 로드
    // 실제 구현은 chatApi를 사용
  }, []);

  // 메시지 미리 로드
  const preloadMessages = useCallback(async (chatRoomId: number) => {
    if (preloadedRooms.has(chatRoomId)) return;

    try {
      // 백그라운드에서 메시지 미리 로드
      setPreloadedRooms(prev => new Set([...prev, chatRoomId]));
    } catch (err) {
      console.warn(`채팅방 ${chatRoomId} 프리로드 실패:`, err);
    }
  }, [preloadedRooms]);

  return {
    preloadChatRooms,
    preloadMessages,
    isPreloaded: (chatRoomId: number) => preloadedRooms.has(chatRoomId)
  };
};
