'use client';

import { Card } from './ui/Card';

interface TranscriptDisplayProps {
  transcript: string;
}

export function TranscriptDisplay({ transcript }: TranscriptDisplayProps) {
  return (
    <Card className="min-h-[200px]">
      <h3 className="text-lg font-semibold text-cyan-400 mb-4">Your Speech</h3>
      <div className="text-slate-300 leading-relaxed">
        {transcript || <span className="text-slate-500 italic">Start speaking to see transcript...</span>}
      </div>
    </Card>
  );
}
