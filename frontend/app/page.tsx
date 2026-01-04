'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-background to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          Vartalaap AI 2.0
        </h1>
        
        <p className="text-2xl mb-4 text-gray-300">
          Master English Speaking with Real-Time AI Feedback
        </p>
        
        <p className="text-lg mb-8 text-gray-400">
          Practice English and get instant corrections in your native language - Hindi, Tamil, Telugu, and more
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/practice"
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              Start Practicing
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              View Dashboard
            </Link>
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-gray-800 rounded-lg"
          >
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Ultra-Fast Interruption</h3>
            <p className="text-gray-400">Get corrected within 300ms when you make a mistake</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-gray-800 rounded-lg"
          >
            <div className="text-4xl mb-4">🌏</div>
            <h3 className="text-xl font-semibold mb-2">Multi-Language Support</h3>
            <p className="text-gray-400">Explanations in Hindi, Tamil, Telugu, and 6 more languages</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 bg-gray-800 rounded-lg"
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Interview Modes</h3>
            <p className="text-gray-400">Practice for Tech, UPSC, MBA, and other interviews</p>
          </motion.div>
        </div>

        {/* Pricing */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="p-6 border border-gray-700 rounded-lg">
            <h3 className="text-2xl font-semibold mb-2">Free</h3>
            <p className="text-4xl font-bold mb-4 text-primary">₹0</p>
            <ul className="text-left space-y-2 text-gray-400">
              <li>✓ 30 minutes/day</li>
              <li>✓ All grammar rules</li>
              <li>✓ Multi-language support</li>
              <li>✓ Basic analytics</li>
            </ul>
          </div>

          <div className="p-6 border-2 border-primary rounded-lg bg-gray-800">
            <h3 className="text-2xl font-semibold mb-2">Premium</h3>
            <p className="text-4xl font-bold mb-4 text-primary">₹99<span className="text-lg">/month</span></p>
            <ul className="text-left space-y-2 text-gray-400">
              <li>✓ Unlimited practice</li>
              <li>✓ All interview modes</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Priority support</li>
            </ul>
            <button className="mt-6 w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
