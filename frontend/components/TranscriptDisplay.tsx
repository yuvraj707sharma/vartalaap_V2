'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface TranscriptMessage {
  type: 'user' | 'system' | 'error' | 'correction'
  text: string
  timestamp: number
  errorInfo?: {
    original: string
    corrected: string
    error_type: string
    explanation_english: string
    explanation_native: string
    rule_id?: string
  }
}

interface TranscriptDisplayProps {
  messages: TranscriptMessage[]
  interimTranscript?: string
  showInterim?: boolean
}

export default function TranscriptDisplay({ 
  messages, 
  interimTranscript = '', 
  showInterim = true 
}: TranscriptDisplayProps) {
  const [highlightedText, setHighlightedText] = useState<string>('')

  // Highlight errors in real-time
  const highlightErrors = (text: string, errors: any[]) => {
    let highlightedText = text
    
    errors.forEach(error => {
      const errorPhrase = error.original
      // Replace error phrases with highlighted version
      highlightedText = highlightedText.replace(
        new RegExp(errorPhrase, 'gi'),
        `<mark class="bg-red-500 text-white px-1 rounded">${errorPhrase}</mark>`
      )
    })
    
    return highlightedText
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-lg p-6 h-96 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Transcript</h2>
      
      <AnimatePresence>
        {messages.length === 0 && !interimTranscript ? (
          <p className="text-gray-500 text-center">Start speaking to see transcript...</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-gray-800 text-white'
                    : message.type === 'error' || message.type === 'correction'
                    ? 'bg-red-900 bg-opacity-30 border border-red-500'
                    : 'bg-primary bg-opacity-20 text-primary'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">
                    {message.type === 'user' 
                      ? '🗣️ You' 
                      : message.type === 'error' || message.type === 'correction'
                      ? '❌ Grammar Correction' 
                      : '🤖 AI'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <p className="text-lg whitespace-pre-line">{message.text}</p>
                
                {message.errorInfo && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-gray-700"
                  >
                    <div className="bg-gray-800 rounded-lg p-3 space-y-2">
                      <p className="text-xs text-gray-400 uppercase font-semibold">
                        {message.errorInfo.error_type}
                      </p>
                      
                      <div className="flex items-start gap-2">
                        <span className="text-red-400 font-bold">❌</span>
                        <p className="text-sm flex-1">
                          <span className="line-through text-red-400">{message.errorInfo.original}</span>
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 font-bold">✅</span>
                        <p className="text-sm flex-1">
                          <span className="text-green-400 font-semibold">{message.errorInfo.corrected}</span>
                        </p>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-700">
                        <p className="text-xs text-gray-400 mb-1">Explanation (English):</p>
                        <p className="text-sm text-gray-300">
                          {message.errorInfo.explanation_english}
                        </p>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-700">
                        <p className="text-xs text-gray-400 mb-1">Explanation (Native):</p>
                        <p className="text-sm text-primary font-medium">
                          💡 {message.errorInfo.explanation_native}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
            
            {/* Show interim transcript */}
            {showInterim && interimTranscript && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-lg bg-blue-900 bg-opacity-20 border border-blue-500 border-dashed"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-blue-400">
                    🎤 Speaking...
                  </span>
                  <span className="text-xs text-gray-400">
                    Live
                  </span>
                </div>
                <p className="text-lg italic text-blue-300">{interimTranscript}</p>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

