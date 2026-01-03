export type Mode = 'english_practice' | 'interview' | 'language_learning' | 'roleplay';

export type Domain = 'tech' | 'finance' | 'upsc' | 'ssc' | 'business' | 'nda' | 'cds' | 'railway';

export type Language = 
  | 'Hindi' 
  | 'Tamil' 
  | 'Telugu' 
  | 'Marathi' 
  | 'Punjabi' 
  | 'Bengali' 
  | 'Gujarati' 
  | 'Kannada' 
  | 'Malayalam' 
  | 'Haryanvi';

export interface ErrorCorrection {
  hasError: boolean;
  originalText: string;
  correctedText?: string;
  errorType?: string;
  explanation?: string;
  explanationNative?: string;
  detectionMethod?: 'rule' | 'groq' | 'gpt' | 'gemini';
  latencyMs?: number;
}

export interface TranscriptSegment {
  text: string;
  isFinal: boolean;
  timestamp: Date;
}

export interface SessionConfig {
  mode: Mode;
  domain?: Domain;
  targetLanguage: string;
  nativeLanguage: Language;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  nativeLanguage: Language;
  subscriptionTier: 'free' | 'premium';
  minutesRemaining: number;
  totalPracticeMinutes: number;
}

export interface SessionStats {
  duration: number;
  errorsCount: number;
  correctionsCount: number;
  grammarScore?: number;
  fluencyScore?: number;
}
