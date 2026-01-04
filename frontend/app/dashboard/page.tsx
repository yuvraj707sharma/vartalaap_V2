'use client'

import { motion } from 'framer-motion'

export default function DashboardPage() {
  // Mock data - in production, fetch from Supabase
  const stats = {
    totalSessions: 12,
    totalMinutes: 145,
    errorsCount: 34,
    grammarScore: 82.5,
    minutesRemaining: 18,
  }

  const recentErrors = [
    {
      id: 1,
      original: 'I has a book',
      corrected: 'I have a book',
      error_type: 'Subject-Verb Agreement',
      date: '2024-01-03',
    },
    {
      id: 2,
      original: 'Yesterday I go to market',
      corrected: 'Yesterday I went to market',
      error_type: 'Tense Error',
      date: '2024-01-03',
    },
    {
      id: 3,
      original: 'Do the needful',
      corrected: 'Please take necessary action',
      error_type: 'Indianism',
      date: '2024-01-02',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-primary">Dashboard</h1>
          <p className="text-gray-400">Track your English learning progress</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 rounded-lg p-6"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
            <div className="text-sm text-gray-400">Total Sessions</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-lg p-6"
          >
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-primary">{stats.totalMinutes}</div>
            <div className="text-sm text-gray-400">Total Minutes</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-lg p-6"
          >
            <div className="text-3xl mb-2">❌</div>
            <div className="text-2xl font-bold text-red-400">{stats.errorsCount}</div>
            <div className="text-sm text-gray-400">Errors Fixed</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 rounded-lg p-6"
          >
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-green-400">{stats.grammarScore}%</div>
            <div className="text-sm text-gray-400">Grammar Score</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900 rounded-lg p-6"
          >
            <div className="text-3xl mb-2">🕒</div>
            <div className="text-2xl font-bold text-yellow-400">{stats.minutesRemaining}</div>
            <div className="text-sm text-gray-400">Minutes Left Today</div>
          </motion.div>
        </div>

        {/* Recent Errors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900 rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Recent Errors</h2>
          
          <div className="space-y-4">
            {recentErrors.map((error, index) => (
              <motion.div
                key={error.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-1 bg-red-900 bg-opacity-30 text-red-400 text-xs rounded">
                    {error.error_type}
                  </span>
                  <span className="text-xs text-gray-400">{error.date}</span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-400">Original: </span>
                    <span className="text-sm line-through text-red-400">{error.original}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Corrected: </span>
                    <span className="text-sm text-green-400">{error.corrected}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-900 rounded-lg p-6 mt-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Progress Over Time</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart visualization would go here
            <br />
            (Can be implemented with Chart.js or Recharts)
          </div>
        </motion.div>
      </div>
    </div>
  )
}
