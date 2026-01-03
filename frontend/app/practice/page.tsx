'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import VoiceOrb from '@/components/VoiceOrb'
import TranscriptDisplay from '@/components/TranscriptDisplay'
import { useVoiceSession } from '@/hooks/useVoiceSession'

export default function PracticePage() {
  const [userId] = useState('test-user-' + Date.now())
  const [nativeLanguage, setNativeLanguage] = useState('Hindi')
  const [mode, setMode] = useState('practice')
  const [domain, setDomain] = useState('General')
  
  const {
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
  } = useVoiceSession()

  const languages = [
    'Hindi', 'Tamil', 'Telugu', 'Marathi',
    'Punjabi', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam'
  ]

  const modes = ['practice', 'interview']
  const domains = ['General', 'Tech', 'Finance', 'UPSC', 'SSC', 'NDA', 'CDS', 'Business/MBA']

  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect()
      }
    }
  }, [isConnected, disconnect])

  const handleConnect = async () => {
    await connect(userId, nativeLanguage)
  }

  const handleStartSession = () => {
    startSession(mode, domain)
  }

  const handleEndSession = () => {
    endSession()
    stopListening()
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 text-primary">Voice Practice Session</h1>
          <p className="text-gray-400">Practice English speaking with real-time feedback</p>
        </motion.div>

        {/* Settings */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Session Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Native Language</label>
              <select
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                disabled={isConnected}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                disabled={sessionId !== null}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
              >
                {modes.map((m) => (
                  <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={sessionId !== null}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
              >
                {domains.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
              >
                Connect to Server
              </button>
            ) : (
              <>
                {!sessionId ? (
                  <button
                    onClick={handleStartSession}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Start Session
                  </button>
                ) : (
                  <button
                    onClick={handleEndSession}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    End Session
                  </button>
                )}
                
                <button
                  onClick={disconnect}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </>
            )}
          </div>
        </div>

        {/* Voice Orb */}
        <div className="mb-8">
          <VoiceOrb isListening={isListening} isSpeaking={isSpeaking} />
          
          <div className="text-center mt-6">
            {sessionId && (
              <button
                onClick={toggleListening}
                className={`px-8 py-4 font-semibold rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                {isListening ? '🛑 Stop Speaking' : '🎤 Start Speaking'}
              </button>
            )}
            
            <div className="mt-4 text-sm text-gray-400">
              {!isConnected && 'Connect to server to start'}
              {isConnected && !sessionId && 'Start a session to begin practicing'}
              {sessionId && !isListening && 'Click the button to start speaking'}
              {isListening && 'Listening... Speak clearly'}
              {isSpeaking && '🔊 AI is speaking...'}
            </div>
          </div>
        </div>

        {/* Transcript */}
        <TranscriptDisplay messages={messages} />
      </div>
    </div>
  )
}
