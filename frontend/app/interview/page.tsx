'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Domain } from '@/types';

const interviewDomains = [
  {
    id: 'tech' as Domain,
    title: '👨‍💻 Tech Interviews',
    description: 'Software Engineer, Data Science, DevOps, Product Manager',
    topics: ['DSA', 'System Design', 'OOP', 'Databases', 'Cloud & DevOps'],
  },
  {
    id: 'upsc' as Domain,
    title: '🏛️ UPSC Civil Services',
    description: 'IAS, IPS, IFS and other civil services',
    topics: ['Current Affairs', 'Polity', 'Economy', 'Ethics', 'Geography'],
  },
  {
    id: 'finance' as Domain,
    title: '💰 Finance & Banking',
    description: 'Banking, Investment, CA, Financial Analysis',
    topics: ['Financial Markets', 'Banking Ops', 'Accounting', 'Risk Management'],
  },
  {
    id: 'business' as Domain,
    title: '💼 Business & MBA',
    description: 'MBA, Marketing, HR, Sales, Strategy',
    topics: ['Leadership', 'Marketing', 'Case Studies', 'Business Strategy'],
  },
  {
    id: 'ssc' as Domain,
    title: '📝 SSC & Railway',
    description: 'SSC CGL, CHSL, Railway exams',
    topics: ['General Awareness', 'Reasoning', 'English', 'Current Affairs'],
  },
  {
    id: 'nda' as Domain,
    title: '🎖️ NDA & CDS',
    description: 'National Defence Academy, Combined Defence Services',
    topics: ['General Knowledge', 'Current Affairs', 'Mathematics', 'English'],
  },
];

export default function InterviewPage() {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
            Interview Preparation
          </h1>
          <p className="text-slate-400">Domain-specific mock interviews with real-time corrections</p>
        </div>

        {/* Domain Selection */}
        {!selectedDomain ? (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-6 text-center">
              Choose Your Interview Domain
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviewDomains.map((domain) => (
                <Card
                  key={domain.id}
                  className="cursor-pointer hover:border-cyan-500 transition-all hover:scale-105"
                  onClick={() => setSelectedDomain(domain.id)}
                >
                  <h3 className="text-xl font-semibold mb-3">{domain.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">{domain.description}</p>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 font-semibold">Key Topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {domain.topics.map((topic) => (
                        <span
                          key={topic}
                          className="text-xs px-2 py-1 bg-slate-700 rounded-full text-cyan-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/">
                <Button variant="outline">← Back to Home</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                {interviewDomains.find(d => d.id === selectedDomain)?.title}
              </h2>
              <p className="text-slate-300 mb-6">
                You've selected {interviewDomains.find(d => d.id === selectedDomain)?.description}.
                The AI will conduct a mock interview with domain-specific questions while correcting
                your English grammar in real-time.
              </p>

              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-cyan-400">What to expect:</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>Domain-specific interview questions tailored to {selectedDomain}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>Real-time grammar corrections mid-sentence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>Explanations in your native language</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>Professional interview atmosphere</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>Feedback on both content and language</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Link href={`/practice?mode=interview&domain=${selectedDomain}`} className="flex-1">
                  <Button size="lg" className="w-full">
                    Start Interview Practice
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setSelectedDomain(null)}
                >
                  Change Domain
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Tips Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-6 text-center">
            Interview Preparation Tips
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <div className="text-3xl mb-3">🎤</div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Speak Clearly</h3>
              <p className="text-sm text-slate-400">
                Take your time and speak clearly. The AI will wait for you to finish your thought before correcting.
              </p>
            </Card>
            <Card>
              <div className="text-3xl mb-3">📝</div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Structure Your Answers</h3>
              <p className="text-sm text-slate-400">
                Use the STAR method (Situation, Task, Action, Result) for behavioral questions.
              </p>
            </Card>
            <Card>
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Practice Regularly</h3>
              <p className="text-sm text-slate-400">
                Regular practice helps build confidence and improve fluency. Aim for 15-30 minutes daily.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
