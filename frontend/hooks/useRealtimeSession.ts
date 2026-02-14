'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { WebSocketClient } from '@/lib/websocket'

interface TranscriptMessage {
  type: 'user' | 'system' | 'error' | 'correction'
  text: string
  timestamp: number
  errorInfo?: any
}

interface RealtimeSessionOptions {
  userId: string
  nativeLanguage: string
  interviewMode: string
}

export function useRealtimeSession() {
  const [isConnected, setIsConnected] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<TranscriptMessage[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [errorCount, setErrorCount] = useState(0)
  
  const wsClient = useRef<WebSocketClient | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioContext = useRef<AudioContext | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)

  const connect = useCallback(async (options: RealtimeSessionOptions) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'ws://localhost:8080'
      const wsUrl = `${backendUrl}/ws/practice`
      
      wsClient.current = new WebSocketClient(wsUrl)
      await wsClient.current.connect(options.userId, options.nativeLanguage)
      
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
        addMessage('system', data.payload.opening_message || 'Session started. You can start speaking now.', {})
        break
        
      case 'interruption':
        setIsSpeaking(true)
        setErrorCount(prev => prev + 1)
        
        const error = data.payload.error
        const correctionText = `❌ You said: "${error.original}"\n✅ Correct: "${error.corrected}"\n📚 ${error.explanation_native}`
        
        addMessage('correction', correctionText, error)
        
        // Play audio response if available
        if (data.payload.audio) {
          playAudio(data.payload.audio)
        }
        
        setTimeout(() => setIsSpeaking(false), 3000)
        break
      
      case 'interim_update':
        // Update interim transcript for real-time UI display
        setInterimTranscript(data.payload.text)
        break
      
      case 'correction_voice':
        // AI is speaking a correction
        setIsSpeaking(true)
        if (data.payload.audio) {
          playAudio(data.payload.audio)
        }
        break
        
      case 'nudge':
        // Gentle nudge when user pauses too long
        addMessage('system', data.payload.message, {})
        break
        
      case 'session_ended':
        addMessage('system', `Session ended. Total errors corrected: ${data.payload.error_count}`, {})
        setSessionId(null)
        break
      
      case 'thinking_pause_detected':
        // User is thinking, show indicator
        break
        
      default:
        console.log('Unknown message type:', data.type)
    }
  }, [])

  const addMessage = (type: 'user' | 'system' | 'error' | 'correction', text: string, errorInfo?: any) => {
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

  const startSession = useCallback((mode: string = 'General') => {
    if (!wsClient.current) return
    
    const newSessionId = `session_${Date.now()}`
    wsClient.current.send('start_session', {
      session_id: newSessionId,
      mode,
      interview_mode: mode,
    })
    
    setErrorCount(0)
    setMessages([])
  }, [])

  const endSession = useCallback(async () => {
    if (!wsClient.current || !sessionId) return
    
    wsClient.current.send('end_session', {
      session_id: sessionId,
    })
    
    // Get session summary
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/session/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
        }),
      })
      
      if (response.ok) {
        const summary = await response.json()
        console.log('Session summary:', summary)
        // Could display this in UI
      }
    } catch (error) {
      console.error('Failed to get session summary:', error)
    }
    
    stopListening()
  }, [sessionId])

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      })
      
      audioStreamRef.current = stream
      
      // Start Web Speech Recognition for interim results
      if ('webkitSpeechRecognition' in window) {
        startWebSpeechRecognition()
      }
      
      // Also start MediaRecorder for raw audio (future use with OpenAI Realtime)
      mediaRecorder.current = new MediaRecorder(stream)
      const audioChunks: Blob[] = []
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
          // In future, can send chunks to backend via WebSocket binary
          // wsClient.current?.sendBinary(event.data)
        }
      }
      
      mediaRecorder.current.start(100) // Capture chunks every 100ms
      setIsListening(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
    }
    
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop())
    }
    
    setIsListening(false)
    setInterimTranscript('')
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
    recognition.maxAlternatives = 1
    
    recognition.onresult = (event: any) => {
      let interimText = ''
      let finalText = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        
        if (event.results[i].isFinal) {
          finalText += transcript
        } else {
          interimText += transcript
        }
      }
      
      // Send interim transcripts for real-time analysis
      if (interimText && wsClient.current) {
        setInterimTranscript(interimText)
        wsClient.current.send('interim_transcript', {
          text: interimText,
          is_final: false,
        })
      }
      
      // Send final transcripts
      if (finalText && wsClient.current) {
        addMessage('user', finalText, {})
        setInterimTranscript('')
        wsClient.current.send('interim_transcript', {
          text: finalText,
          is_final: true,
        })
      }
    }
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'no-speech') {
        // User paused, send thinking_pause event
        if (wsClient.current) {
          wsClient.current.send('thinking_pause', {
            pause_duration_ms: 3000,
          })
        }
      }
    }
    
    recognition.onend = () => {
      // Auto-restart if still listening
      if (isListening) {
        recognition.start()
      }
    }
    
    recognition.start()
  }, [isListening])

  const playAudio = useCallback(async (audioBase64: string) => {
    try {
      // Initialize audio context if needed
      if (!audioContext.current) {
        audioContext.current = new AudioContext()
      }
      
      // Decode base64 audio
      const audioData = atob(audioBase64)
      const arrayBuffer = new ArrayBuffer(audioData.length)
      const view = new Uint8Array(arrayBuffer)
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i)
      }
      
      // Decode and play
      const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer)
      const source = audioContext.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.current.destination)
      source.start(0)
    } catch (error) {
      console.error('Error playing audio:', error)
      // Fallback to simple audio element
      const audio = new Audio(`data:audio/wav;base64,${audioBase64}`)
      audio.play()
    }
  }, [])

  const disconnect = useCallback(() => {
    stopListening()
    
    if (wsClient.current) {
      wsClient.current.disconnect()
      wsClient.current = null
    }
    
    setIsConnected(false)
  }, [stopListening])

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
    interimTranscript,
    errorCount,
    connect,
    disconnect,
    startSession,
    endSession,
    startListening,
    stopListening,
  }
}
