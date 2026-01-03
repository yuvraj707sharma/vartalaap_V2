'use client';

import { ErrorCorrection } from '@/types';
import { Card } from './ui/Card';

interface ErrorCorrectionProps {
  correction: ErrorCorrection;
}

export function ErrorCorrectionDisplay({ correction }: ErrorCorrectionProps) {
  return (
    <Card className="bg-red-950/30 border-red-800">
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <span className="text-2xl">🛑</span>
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-1">Original:</p>
            <p className="text-red-400 line-through">{correction.originalText}</p>
          </div>
        </div>
        
        {correction.correctedText && (
          <div className="flex items-start gap-2">
            <span className="text-2xl">✅</span>
            <div className="flex-1">
              <p className="text-sm text-slate-400 mb-1">Correction:</p>
              <p className="text-green-400 font-medium">{correction.correctedText}</p>
            </div>
          </div>
        )}
        
        {correction.explanation && (
          <div className="mt-3 pt-3 border-t border-slate-700">
            <p className="text-sm text-slate-300">{correction.explanation}</p>
          </div>
        )}
        
        {correction.explanationNative && (
          <div className="mt-2 p-3 bg-cyan-950/30 rounded-lg border border-cyan-800/30">
            <p className="text-sm text-cyan-300">{correction.explanationNative}</p>
          </div>
        )}
        
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
          <span>Type: {correction.errorType}</span>
          <span>•</span>
          <span>Detected by: {correction.detectionMethod}</span>
          {correction.latencyMs !== undefined && (
            <>
              <span>•</span>
              <span>{correction.latencyMs}ms</span>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
