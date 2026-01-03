import Groq from 'groq-sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ErrorDetection } from '../types';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export class LLMRouter {
  private nativeLanguage: string;

  constructor(nativeLanguage: string = 'Hindi') {
    this.nativeLanguage = nativeLanguage;
  }

  async detectWithGroq(text: string, systemPrompt: string): Promise<ErrorDetection> {
    const startTime = Date.now();
    
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this text for grammar errors: "${text}"` }
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.3,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content || '';
      const latencyMs = Date.now() - startTime;

      return this.parseResponse(response, 'groq', latencyMs);
    } catch (error) {
      console.error('Groq error:', error);
      throw error;
    }
  }

  async detectWithGPT(text: string, systemPrompt: string): Promise<ErrorDetection> {
    const startTime = Date.now();
    
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this text for grammar errors: "${text}"` }
        ],
        model: 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content || '';
      const latencyMs = Date.now() - startTime;

      return this.parseResponse(response, 'gpt', latencyMs);
    } catch (error) {
      console.error('GPT error:', error);
      throw error;
    }
  }

  async detectWithGemini(text: string, systemPrompt: string): Promise<ErrorDetection> {
    const startTime = Date.now();
    
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(
        `${systemPrompt}\n\nAnalyze this text for grammar errors: "${text}"`
      );
      
      const response = result.response.text();
      const latencyMs = Date.now() - startTime;

      return this.parseResponse(response, 'gemini', latencyMs);
    } catch (error) {
      console.error('Gemini error:', error);
      throw error;
    }
  }

  async detectError(text: string, systemPrompt: string): Promise<ErrorDetection> {
    // Layer 2: Try Groq first (fastest LLM, ~100ms)
    try {
      const result = await this.detectWithGroq(text, systemPrompt);
      if (result.hasError) return result;
    } catch (error) {
      console.log('Groq failed, trying GPT...');
    }

    // Layer 3: Try GPT-4o-mini (~500ms)
    try {
      const result = await this.detectWithGPT(text, systemPrompt);
      if (result.hasError) return result;
    } catch (error) {
      console.log('GPT failed, trying Gemini...');
    }

    // Layer 4: Fallback to Gemini
    try {
      return await this.detectWithGemini(text, systemPrompt);
    } catch (error) {
      console.error('All LLMs failed');
      return {
        hasError: false,
        originalText: text,
        detectionMethod: 'groq',
        latencyMs: 0,
      };
    }
  }

  private parseResponse(response: string, method: 'groq' | 'gpt' | 'gemini', latencyMs: number): ErrorDetection {
    // Try to parse JSON response if formatted as such
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          hasError: parsed.hasError || false,
          originalText: parsed.originalText || '',
          correctedText: parsed.correctedText,
          errorType: parsed.errorType,
          explanation: parsed.explanation,
          explanationNative: parsed.explanationNative || parsed[`explanation_${this.nativeLanguage.toLowerCase()}`],
          detectionMethod: method,
          latencyMs,
        };
      }
    } catch (e) {
      // If JSON parsing fails, try to extract information from text
    }

    // Simple text parsing fallback
    const hasError = response.toLowerCase().includes('error') || 
                     response.toLowerCase().includes('incorrect') ||
                     response.toLowerCase().includes('mistake');

    return {
      hasError,
      originalText: '',
      correctedText: hasError ? 'See explanation' : undefined,
      errorType: hasError ? 'grammar' : undefined,
      explanation: response,
      explanationNative: response,
      detectionMethod: method,
      latencyMs,
    };
  }
}

export function getSystemPrompt(nativeLanguage: string = 'Hindi'): string {
  return `You are an expert English grammar teacher for Indian students. 
Your job is to detect grammar errors in real-time and provide corrections.

Response format (JSON):
{
  "hasError": boolean,
  "originalText": "the incorrect text",
  "correctedText": "the correct version",
  "errorType": "grammar|tense|article|preposition|filler|indianism",
  "explanation": "Brief explanation in English",
  "explanationNative": "Explanation in ${nativeLanguage}"
}

Focus on:
- Subject-verb agreement
- Tense errors (especially with 'since', 'for', past tense)
- Indianisms ('do the needful', 'revert back', 'prepone', etc.)
- Article errors (a/an/the)
- Preposition mistakes
- Filler words (umm, aah, like, you know)

Be quick and concise. Only detect actual errors, not stylistic preferences.`;
}
