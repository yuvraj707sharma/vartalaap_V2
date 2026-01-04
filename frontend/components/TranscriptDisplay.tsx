'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface TranscriptMessage {
  type: 'user' | 'system' | 'error'
  text: string
  timestamp: number
  errorInfo?: {
    original: string
    corrected: string
    error_type: string
    explanation_native: string
  }
}

interface TranscriptDisplayProps {
  messages: TranscriptMessage[]
}

export default function TranscriptDisplay({ messages }: TranscriptDisplayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-lg p-6 h-96 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Transcript</h2>
      
      <AnimatePresence>
        {messages.length === 0 ? (
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
                    : message.type === 'error'
                    ? 'bg-red-900 bg-opacity-30 border border-red-500'
                    : 'bg-primary bg-opacity-20 text-primary'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">
                    {message.type === 'user' ? 'You' : message.type === 'error' ? '❌ Error' : '🤖 AI'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <p className="text-lg">{message.text}</p>
                
                {message.errorInfo && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-1">
                      <span className="font-semibold">Error Type:</span> {message.errorInfo.error_type}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-red-400">Original:</span>{' '}
                      <span className="line-through">{message.errorInfo.original}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-green-400">Corrected:</span>{' '}
                      {message.errorInfo.corrected}
                    </p>
                    <p className="text-sm mt-2 text-primary">
                      💡 {message.errorInfo.explanation_native}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
