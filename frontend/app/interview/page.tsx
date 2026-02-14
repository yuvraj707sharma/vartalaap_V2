'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRealtimeSession } from '@/hooks/useRealtimeSession'

interface InterviewMode {
  mode: string
  name: string
  description: string
  strictness: string
  focus_areas: string[]
  patience_ms: number
}

export default function InterviewPage() {
  const [modes, setModes] = useState<InterviewMode[]>([])
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [nativeLanguage, setNativeLanguage] = useState('Hindi')
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const {
    isConnected,
    isListening,
    isSpeaking,
    messages,
    interimTranscript,
    errorCount,
    connect,
    startSession,
    endSession,
    startListening,
    stopListening,
  } = useRealtimeSession()

  useEffect(() => {
    // Fetch available interview modes
    const fetchModes = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
        const response = await fetch(`${backendUrl}/api/v1/interview-modes`)
        const data = await response.json()
        setModes(data.modes || [])
      } catch (error) {
        console.error('Failed to fetch interview modes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchModes()
  }, [])

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode)
  }

  const handleStartInterview = async () => {
    if (!selectedMode) return
    
    // Connect to WebSocket
    await connect({
      userId: `user_${Date.now()}`,
      nativeLanguage,
      interviewMode: selectedMode,
    })
    
    // Start session
    startSession(selectedMode)
    
    // Start listening
    await startListening()
    
    setIsSessionActive(true)
  }

  const handleEndInterview = async () => {
    await endSession()
    setIsSessionActive(false)
    setSelectedMode(null)
  }

  const getModeColor = (mode: string) => {
    const colors: { [key: string]: string } = {
      'NDA': 'bg-green-600',
      'SSB': 'bg-green-700',
      'Tech': 'bg-blue-600',
      'HR': 'bg-purple-600',
      'MBA': 'bg-indigo-600',
      'UPSC': 'bg-red-600',
      'General': 'bg-gray-600',
    }
    return colors[mode] || 'bg-gray-600'
  }

  const getStrictnessColor = (strictness: string) => {
    const colors: { [key: string]: string } = {
      'Very Gentle': 'text-green-500',
      'Gentle': 'text-green-600',
      'Moderate': 'text-yellow-500',
      'Strict': 'text-orange-500',
      'Very Strict': 'text-red-500',
    }
    return colors[strictness] || 'text-gray-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interview modes...</p>
        </div>
      </div>
    )
  }

  if (isSessionActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {modes.find(m => m.mode === selectedMode)?.name}
                </h1>
                <p className="text-sm text-gray-600 mt-1">Interview in Progress</p>
              </div>
              <button
                onClick={handleEndInterview}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                End Interview
              </button>
            </div>
            
            {/* Stats */}
            <div className="mt-4 flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{errorCount}</p>
                <p className="text-xs text-gray-600">Errors Corrected</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{messages.length}</p>
                <p className="text-xs text-gray-600">Total Messages</p>
              </div>
              <div className="flex items-center gap-2">
                {isListening && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-gray-700">Listening</span>
                  </div>
                )}
                {isSpeaking && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-gray-700">AI Speaking</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Transcript Display */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Conversation</h2>
            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : msg.type === 'system'
                      ? 'bg-gray-50 border-l-4 border-gray-500'
                      : msg.type === 'correction'
                      ? 'bg-red-50 border-l-4 border-red-500'
                      : 'bg-red-50 border-l-4 border-red-500'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {msg.type === 'user' ? 'You' : msg.type === 'system' ? 'System' : 'Correction'}
                  </p>
                  <p className="text-sm text-gray-800 whitespace-pre-line">{msg.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
              
              {/* Interim transcript */}
              {interimTranscript && (
                <div className="p-3 rounded-lg bg-blue-100 border-l-4 border-blue-300 opacity-60">
                  <p className="text-sm font-medium text-gray-700 mb-1">You (speaking...)</p>
                  <p className="text-sm text-gray-700 italic">{interimTranscript}</p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex gap-4 justify-center">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  isListening
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isListening ? '🎤 Stop Speaking' : '🎤 Start Speaking'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Choose Your Interview Mode
          </h1>
          <p className="text-lg text-gray-600">
            Select an interview style to practice your English speaking skills
          </p>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Native Language
          </label>
          <select
            value={nativeLanguage}
            onChange={(e) => setNativeLanguage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
            <option value="Bengali">Bengali (বাংলা)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            <option value="Malayalam">Malayalam (മലയാളം)</option>
          </select>
        </div>

        {/* Interview Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modes.map((mode) => (
            <div
              key={mode.mode}
              onClick={() => handleModeSelect(mode.mode)}
              className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition transform hover:scale-105 ${
                selectedMode === mode.mode
                  ? 'ring-4 ring-blue-500'
                  : 'hover:shadow-xl'
              }`}
            >
              <div className={`${getModeColor(mode.mode)} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-4`}>
                {mode.mode[0]}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {mode.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                {mode.description}
              </p>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Strictness:</span>
                  <span className={`text-xs font-semibold ${getStrictnessColor(mode.strictness)}`}>
                    {mode.strictness}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Patience:</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {(mode.patience_ms / 1000).toFixed(1)}s
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Focus Areas:</p>
                <div className="flex flex-wrap gap-1">
                  {mode.focus_areas.slice(0, 3).map((area, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                    >
                      {area}
                    </span>
                  ))}
                  {mode.focus_areas.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      +{mode.focus_areas.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Start Button */}
        {selectedMode && (
          <div className="text-center">
            <button
              onClick={handleStartInterview}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
            >
              Start {modes.find(m => m.mode === selectedMode)?.name} Interview
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
