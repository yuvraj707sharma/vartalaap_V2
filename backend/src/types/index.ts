export interface GrammarRule {
  pattern: RegExp;
  correction: string;
  type: string;
  explanation_hi: string;
  explanation_ta?: string;
  explanation_te?: string;
}

export interface ErrorDetection {
  hasError: boolean;
  originalText: string;
  correctedText?: string;
  errorType?: string;
  explanation?: string;
  explanationNative?: string;
  detectionMethod: 'rule' | 'groq' | 'gpt' | 'gemini';
  latencyMs: number;
}

export interface SessionData {
  sessionId: string;
  userId?: string;
  mode: 'english_practice' | 'interview' | 'language_learning' | 'roleplay';
  domain?: string;
  targetLanguage: string;
  nativeLanguage: string;
  startTime: Date;
  errorsCount: number;
  correctionsCount: number;
}

export interface WebSocketMessage {
  type: 'audio' | 'transcript' | 'error' | 'correction' | 'system';
  data: any;
  timestamp: Date;
}

export interface InterviewQuestion {
  domain: string;
  question: string;
  expectedTopics: string[];
}
