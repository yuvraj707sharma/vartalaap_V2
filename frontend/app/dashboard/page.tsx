'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock data - in real app, this would come from Supabase
  const stats = {
    totalMinutes: 125,
    minutesRemaining: 30,
    sessionsCompleted: 15,
    errorsDetected: 247,
    correctionsMade: 189,
    grammarScore: 78,
    fluencyScore: 82,
  };

  const recentSessions = [
    {
      id: '1',
      mode: 'English Practice',
      duration: '15:32',
      errors: 12,
      corrections: 10,
      date: '2024-01-03',
      grammarScore: 85,
    },
    {
      id: '2',
      mode: 'Tech Interview',
      duration: '22:15',
      errors: 18,
      corrections: 15,
      date: '2024-01-02',
      grammarScore: 75,
    },
    {
      id: '3',
      mode: 'English Practice',
      duration: '10:45',
      errors: 8,
      corrections: 7,
      date: '2024-01-01',
      grammarScore: 88,
    },
  ];

  const commonErrors = [
    { type: 'Subject-Verb Agreement', count: 45, percentage: 18 },
    { type: 'Tense Errors', count: 38, percentage: 15 },
    { type: 'Filler Words', count: 52, percentage: 21 },
    { type: 'Indianisms', count: 28, percentage: 11 },
    { type: 'Articles', count: 34, percentage: 14 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
              Your Dashboard
            </h1>
            <p className="text-slate-400">Track your English learning progress</p>
          </div>
          <Link href="/practice">
            <Button size="lg">Start New Session</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-3xl font-bold text-cyan-400">{stats.totalMinutes}</div>
            <p className="text-sm text-slate-400 mt-1">Total Minutes</p>
          </Card>
          <Card className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-3xl font-bold text-cyan-400">{stats.sessionsCompleted}</div>
            <p className="text-sm text-slate-400 mt-1">Sessions Completed</p>
          </Card>
          <Card className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-3xl font-bold text-cyan-400">{stats.grammarScore}%</div>
            <p className="text-sm text-slate-400 mt-1">Grammar Score</p>
          </Card>
          <Card className="text-center">
            <div className="text-3xl mb-2">🎤</div>
            <div className="text-3xl font-bold text-cyan-400">{stats.fluencyScore}%</div>
            <p className="text-sm text-slate-400 mt-1">Fluency Score</p>
          </Card>
        </div>

        {/* Minutes Remaining */}
        <Card className="mb-8 bg-gradient-to-r from-cyan-900/30 to-teal-900/30 border-cyan-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">Free Minutes Remaining</h3>
              <p className="text-3xl font-bold">{stats.minutesRemaining} minutes</p>
              <p className="text-sm text-slate-400 mt-2">
                Resets daily • Watch ads to earn more minutes
              </p>
            </div>
            <div>
              <Button variant="outline" size="lg">
                Watch Ad for +5 Minutes
              </Button>
            </div>
          </div>
        </Card>

        {/* Progress and Errors */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Chart */}
          <Card>
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Grammar Score</span>
                  <span className="text-cyan-400">{stats.grammarScore}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 h-3 rounded-full transition-all"
                    style={{ width: `${stats.grammarScore}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Fluency Score</span>
                  <span className="text-cyan-400">{stats.fluencyScore}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 h-3 rounded-full transition-all"
                    style={{ width: `${stats.fluencyScore}%` }}
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400">
                  📈 You've improved by <span className="text-cyan-400 font-semibold">12%</span> this week!
                </p>
              </div>
            </div>
          </Card>

          {/* Common Errors */}
          <Card>
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Your Error Patterns</h3>
            <div className="space-y-3">
              {commonErrors.map((error) => (
                <div key={error.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{error.type}</span>
                    <span className="text-slate-400">{error.count} times</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${error.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400 mt-4">
              💡 Focus on reducing filler words in your next session
            </p>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card>
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">Recent Sessions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 text-left">
                  <th className="py-3 px-4 text-slate-400 font-medium">Mode</th>
                  <th className="py-3 px-4 text-slate-400 font-medium">Duration</th>
                  <th className="py-3 px-4 text-slate-400 font-medium">Errors</th>
                  <th className="py-3 px-4 text-slate-400 font-medium">Corrections</th>
                  <th className="py-3 px-4 text-slate-400 font-medium">Score</th>
                  <th className="py-3 px-4 text-slate-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session) => (
                  <tr key={session.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 px-4">{session.mode}</td>
                    <td className="py-3 px-4 text-slate-300">{session.duration}</td>
                    <td className="py-3 px-4 text-red-400">{session.errors}</td>
                    <td className="py-3 px-4 text-green-400">{session.corrections}</td>
                    <td className="py-3 px-4">
                      <span className="text-cyan-400 font-semibold">{session.grammarScore}%</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{session.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Premium Upgrade */}
        <Card className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-purple-300 mb-2">Upgrade to Premium</h3>
              <p className="text-slate-300 mb-3">
                Get unlimited practice minutes, advanced analytics, and priority support
              </p>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>✓ Unlimited practice time</li>
                <li>✓ Advanced progress analytics</li>
                <li>✓ Custom interview scenarios</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-300 mb-2">₹99</div>
              <p className="text-sm text-slate-400 mb-4">per month</p>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Upgrade Now
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
