'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { WebSocketClient } from '@/lib/websocket'

interface TranscriptMessage {
  type: 'user' | 'system' | 'error'
  text: string
  timestamp: number
  errorInfo?: any
}

export function useVoiceSession() {
  const [isConnected, setIsConnected] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<TranscriptMessage[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  const wsClient = useRef<WebSocketClient | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioContext = useRef<AudioContext | null>(null)

  const connect = useCallback(async (userId: string, nativeLanguage: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'ws://localhost:8080'
      const wsUrl = `${backendUrl}/ws/practice`
      
      wsClient.current = new WebSocketClient(wsUrl)
      await wsClient.current.connect(userId, nativeLanguage)
      
      wsClient.current.onMessage((data) => {
        handleWebSocketMessage(data)
      })
      
      setIsConnected(true)
    } catch (error) {
      console.error('Failed to connect:', error)
      setIsConnected(false)
    }
  }, [])

  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'session_started':
        setSessionId(data.payload.session_id)
        addMessage('system', 'Session started. You can start speaking now.', {})
        break
        
      case 'interruption':
        setIsSpeaking(true)
        const error = data.payload.error
        addMessage('error', `Grammar error detected: ${error.error_type}`, error)
        
        // Play audio response if available
        if (data.payload.audio) {
          playAudio(data.payload.audio)
        }
        
        setTimeout(() => setIsSpeaking(false), 3000)
        break
      
      case 'interim_update':
        // Handle real-time transcript updates (don't add to messages, just for UI display)
        // Frontend can use this to show live transcription
        break
        
      case 'nudge':
        // Handle nudge messages when user pauses too long
        addMessage('system', data.payload.message, {})
        break
        
      case 'session_ended':
        addMessage('system', `Session ended. Total errors: ${data.payload.error_count}`, {})
        setSessionId(null)
        break
        
      default:
        console.log('Unknown message type:', data.type)
    }
  }, [])

  const addMessage = (type: 'user' | 'system' | 'error', text: string, errorInfo?: any) => {
    setMessages((prev) => [
      ...prev,
      {
        type,
        text,
        timestamp: Date.now(),
        errorInfo,
      },
    ])
  }

  const startSession = useCallback((mode: string = 'practice', domain: string = 'General') => {
    if (!wsClient.current) return
    
    const newSessionId = `session_${Date.now()}`
    wsClient.current.send('start_session', {
      session_id: newSessionId,
      mode,
      domain,
    })
  }, [])

  const endSession = useCallback(() => {
    if (!wsClient.current || !sessionId) return
    
    wsClient.current.send('end_session', {
      session_id: sessionId,
    })
  }, [sessionId])

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      mediaRecorder.current = new MediaRecorder(stream)
      const audioChunks: Blob[] = []
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }
      
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        
        // Here you would send audio to backend for STT
        // For now, we'll use Web Speech API as a fallback
        if ('webkitSpeechRecognition' in window) {
          startWebSpeechRecognition()
        }
      }
      
      mediaRecorder.current.start()
      setIsListening(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
    }
    setIsListening(false)
  }, [])

  const startWebSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Web Speech API not supported')
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('')
      
      const isFinal = event.results[event.results.length - 1].isFinal
      
      // Send BOTH interim and final transcripts to backend for real-time analysis
      if (wsClient.current) {
        wsClient.current.send('interim_transcript', {
          text: transcript,
          is_final: isFinal,
        })
      }
      
      // Only add to messages when final
      if (isFinal) {
        addMessage('user', transcript, {})
      }
    }
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
    }
    
    recognition.start()
    setIsListening(true)
  }, [])

  const playAudio = useCallback((audioBase64: string) => {
    // Convert base64 to audio and play
    const audio = new Audio(`data:audio/wav;base64,${audioBase64}`)
    audio.play()
  }, [])

  const disconnect = useCallback(() => {
    if (wsClient.current) {
      wsClient.current.disconnect()
      wsClient.current = null
    }
    setIsConnected(false)
  }, [])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    isConnected,
    isListening,
    isSpeaking,
    messages,
    sessionId,
    connect,
    disconnect,
    startSession,
    endSession,
    startListening,
    stopListening,
  }
}
