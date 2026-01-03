'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ErrorCorrection, SessionConfig } from '@/types';

interface UseWebSocketReturn {
  isConnected: boolean;
  transcript: string;
  corrections: ErrorCorrection[];
  startSession: (config: SessionConfig) => void;
  endSession: () => void;
  sendAudio: (audioData: ArrayBuffer) => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [corrections, setCorrections] = useState<ErrorCorrection[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const startSession = useCallback((config: SessionConfig) => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Start session
      ws.send(JSON.stringify({
        type: 'start_session',
        mode: config.mode,
        domain: config.domain,
        targetLanguage: config.targetLanguage,
        nativeLanguage: config.nativeLanguage,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'session_started':
            sessionIdRef.current = message.data.sessionId;
            console.log('Session started:', sessionIdRef.current);
            break;
          
          case 'transcript':
            if (message.data.isFinal) {
              setTranscript(prev => prev + ' ' + message.data.text);
            }
            break;
          
          case 'correction':
            setCorrections(prev => [...prev, message.data]);
            break;
          
          case 'audio_correction':
            // Play audio correction
            const audioData = Uint8Array.from(atob(message.data), c => c.charCodeAt(0));
            const audioBlob = new Blob([audioData], { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play().catch(err => console.error('Audio playback error:', err));
            break;
          
          case 'error':
            console.error('Server error:', message.data);
            break;
        }
      } catch (error) {
        console.error('Message parsing error:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current = ws;
  }, []);

  const endSession = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'end_session' }));
      wsRef.current.close();
    }
    setIsConnected(false);
    setTranscript('');
    setCorrections([]);
  }, []);

  const sendAudio = useCallback((audioData: ArrayBuffer) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const base64Audio = btoa(
        new Uint8Array(audioData).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      wsRef.current.send(JSON.stringify({
        type: 'audio',
        data: base64Audio,
      }));
    }
  }, []);

  return {
    isConnected,
    transcript,
    corrections,
    startSession,
    endSession,
    sendAudio,
  };
}
