'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { VoiceOrb } from '@/components/VoiceOrb';
import { TranscriptDisplay } from '@/components/TranscriptDisplay';
import { ErrorCorrectionDisplay } from '@/components/ErrorCorrection';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useVoice } from '@/hooks/useVoice';
import { Mode, Language, Domain } from '@/types';

function PracticeContent() {
  const searchParams = useSearchParams();
  
  // Get mode and domain from URL parameters
  const urlMode = searchParams.get('mode') as Mode | null;
  const urlDomain = searchParams.get('domain') as Domain | null;
  
  const [mode, setMode] = useState<Mode>(urlMode || 'english_practice');
  const [domain, setDomain] = useState<Domain | undefined>(urlDomain || undefined);
  const [nativeLanguage, setNativeLanguage] = useState<Language>('Hindi');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  const { isConnected, transcript, corrections, startSession, endSession, sendAudio } = useWebSocket();
  const { isRecording, startRecording, stopRecording, error: voiceError } = useVoice();

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const handleStart = async () => {
    // Start WebSocket session
    startSession({
      mode,
      domain,
      nativeLanguage,
      targetLanguage: 'en',
    });

    // Start voice recording
    await startRecording((audioData) => {
      sendAudio(audioData);
    });

    setIsSessionActive(true);
  };

  const handleStop = () => {
    stopRecording();
    endSession();
    setIsSessionActive(false);
    setSessionTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
            {mode === 'interview' && domain ? `${domain.toUpperCase()} Interview Practice` : 'Vartalaap AI 2.0'}
          </h1>
          <p className="text-slate-400">
            {mode === 'interview' 
              ? 'Domain-specific mock interview with real-time corrections'
              : 'Real-time English Learning with Live Corrections'
            }
          </p>
        </div>

        {/* Mode Selection */}
        {!isSessionActive && (
          <Card className="max-w-2xl mx-auto mb-8">
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">Choose Your Mode</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                variant={mode === 'english_practice' ? 'default' : 'outline'}
                onClick={() => setMode('english_practice')}
              >
                🗣️ English Practice
              </Button>
              <Button
                variant={mode === 'interview' ? 'default' : 'outline'}
                onClick={() => setMode('interview')}
              >
                🎯 Interview Prep
              </Button>
              <Button
                variant={mode === 'language_learning' ? 'default' : 'outline'}
                onClick={() => setMode('language_learning')}
              >
                🌐 Language Learning
              </Button>
              <Button
                variant={mode === 'roleplay' ? 'default' : 'outline'}
                onClick={() => setMode('roleplay')}
              >
                🎭 Roleplay
              </Button>
            </div>

            <h3 className="text-lg font-semibold text-cyan-400 mb-3">Your Native Language</h3>
            <select
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value as Language)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
            >
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Marathi">Marathi</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Bengali">Bengali</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Kannada">Kannada</option>
              <option value="Malayalam">Malayalam</option>
              <option value="Haryanvi">Haryanvi</option>
            </select>
          </Card>
        )}

        {/* Voice Orb */}
        <div className="mb-8">
          <VoiceOrb isActive={isRecording} isSpeaking={false} />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          {!isSessionActive ? (
            <Button size="lg" onClick={handleStart}>
              Start Practice
            </Button>
          ) : (
            <>
              <Button size="lg" variant="outline" onClick={handleStop}>
                Stop Session
              </Button>
              <div className="flex items-center gap-2 px-6 py-3 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-cyan-400">⏱️</span>
                <span className="font-mono text-xl">{formatTime(sessionTime)}</span>
              </div>
            </>
          )}
        </div>

        {voiceError && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="bg-red-950/30 border-red-800">
              <p className="text-red-400">{voiceError}</p>
            </Card>
          </div>
        )}

        {/* Connection Status */}
        {isSessionActive && (
          <div className="max-w-2xl mx-auto mb-8 flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-slate-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        )}

        {/* Content Area */}
        {isSessionActive && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Transcript */}
            <TranscriptDisplay transcript={transcript} />

            {/* Corrections */}
            {corrections.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-cyan-400">Live Corrections</h3>
                {corrections.slice(-5).reverse().map((correction, index) => (
                  <ErrorCorrectionDisplay key={index} correction={correction} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Features Info */}
        {!isSessionActive && (
          <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
            <Card>
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Real-Time Interruption</h3>
              <p className="text-sm text-slate-400">
                AI interrupts mid-sentence to correct mistakes instantly (&lt; 300ms)
              </p>
            </Card>
            <Card>
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Native Language Support</h3>
              <p className="text-sm text-slate-400">
                Get explanations in Hindi, Tamil, Telugu, and 7+ Indian languages
              </p>
            </Card>
            <Card>
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Domain-Specific</h3>
              <p className="text-sm text-slate-400">
                Practice for UPSC, Tech interviews, Finance, and more
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Loading...
          </div>
        </div>
      </div>
    }>
      <PracticeContent />
    </Suspense>
  );
}
