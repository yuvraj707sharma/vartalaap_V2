'use client'

import { motion } from 'framer-motion'

interface VoiceOrbProps {
  isListening: boolean
  isSpeaking: boolean
}

export default function VoiceOrb({ isListening, isSpeaking }: VoiceOrbProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-64 h-64">
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary opacity-20"
          animate={{
            scale: isListening || isSpeaking ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: isListening || isSpeaking ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
        
        {/* Middle ring */}
        <motion.div
          className="absolute inset-4 rounded-full bg-primary opacity-30"
          animate={{
            scale: isListening || isSpeaking ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 1.5,
            repeat: isListening || isSpeaking ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
        
        {/* Inner core */}
        <motion.div
          className="absolute inset-8 rounded-full bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center"
          animate={{
            scale: isListening ? [1, 1.05, 1] : isSpeaking ? [1, 0.95, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isListening || isSpeaking ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          {/* Visual indicator */}
          <div className="text-white text-4xl">
            {isListening ? '🎤' : isSpeaking ? '🔊' : '⭕'}
          </div>
        </motion.div>
        
        {/* Pulse effect when speaking */}
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500 opacity-40"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}
      </div>
    </div>
  )
}
