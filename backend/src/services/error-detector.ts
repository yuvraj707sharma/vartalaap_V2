import { ErrorDetection } from '../types';
import { detectGrammarError } from '../rules/english';
import { LLMRouter, getSystemPrompt } from './llm-router';

export class ErrorDetectorService {
  private llmRouter: LLMRouter;
  private nativeLanguage: string;

  constructor(nativeLanguage: string = 'Hindi') {
    this.nativeLanguage = nativeLanguage;
    this.llmRouter = new LLMRouter(nativeLanguage);
  }

  async detectError(text: string): Promise<ErrorDetection> {
    // Layer 1: Rule-based detection (fastest ~10ms)
    const ruleResult = detectGrammarError(text);
    
    if (ruleResult.hasError && ruleResult.rule) {
      const startTime = Date.now();
      const latencyMs = Date.now() - startTime;
      
      return {
        hasError: true,
        originalText: ruleResult.match?.[0] || text,
        correctedText: ruleResult.rule.correction,
        errorType: ruleResult.rule.type,
        explanation: `Use "${ruleResult.rule.correction}" instead`,
        explanationNative: ruleResult.rule.explanation_hi,
        detectionMethod: 'rule',
        latencyMs,
      };
    }

    // Layer 2-4: LLM detection (Groq → GPT → Gemini)
    // Only use LLM for complex cases that rules didn't catch
    if (text.split(' ').length > 3) { // Only check longer phrases with LLM
      try {
        const systemPrompt = getSystemPrompt(this.nativeLanguage);
        const llmResult = await this.llmRouter.detectError(text, systemPrompt);
        return llmResult;
      } catch (error) {
        console.error('LLM detection failed:', error);
      }
    }

    // No error detected
    return {
      hasError: false,
      originalText: text,
      detectionMethod: 'rule',
      latencyMs: 0,
    };
  }

  // Quick filler detection for real-time interruption
  detectFillers(text: string): string[] {
    const fillers = ['umm', 'uhh', 'aah', 'uh', 'hmm', 'like', 'you know', 'basically'];
    const detected: string[] = [];
    
    const lowerText = text.toLowerCase();
    for (const filler of fillers) {
      if (lowerText.includes(filler)) {
        detected.push(filler);
      }
    }
    
    return detected;
  }
}
