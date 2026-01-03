# API Documentation

## WebSocket API

### Connection
Connect to WebSocket server at: `ws://localhost:3001` (development)

### Message Format
All messages are JSON formatted:
```json
{
  "type": "message_type",
  "data": { ... },
  "timestamp": "2024-01-03T12:00:00.000Z"
}
```

## Client → Server Messages

### 1. Start Session
```json
{
  "type": "start_session",
  "userId": "user-uuid",
  "mode": "english_practice | interview | language_learning | roleplay",
  "domain": "tech | finance | upsc | business | etc.",
  "targetLanguage": "en",
  "nativeLanguage": "Hindi"
}
```

### 2. Send Audio
```json
{
  "type": "audio",
  "data": "base64-encoded-audio-data"
}
```

### 3. End Session
```json
{
  "type": "end_session"
}
```

## Server → Client Messages

### 1. Session Started
```json
{
  "type": "session_started",
  "data": {
    "sessionId": "session-uuid"
  },
  "timestamp": "2024-01-03T12:00:00.000Z"
}
```

### 2. Transcript
Real-time speech transcription (interim and final results)
```json
{
  "type": "transcript",
  "data": {
    "text": "I has going to market",
    "isFinal": false
  },
  "timestamp": "2024-01-03T12:00:00.000Z"
}
```

### 3. Correction
Grammar error detected with correction
```json
{
  "type": "correction",
  "data": {
    "hasError": true,
    "originalText": "I has going",
    "correctedText": "I was going / I am going",
    "errorType": "subject-verb",
    "explanation": "Use 'was' or 'am' with past/present continuous",
    "explanationNative": "'I' के साथ 'has' नहीं, 'was' या 'am' use करो",
    "detectionMethod": "rule",
    "latencyMs": 8
  },
  "timestamp": "2024-01-03T12:00:00.000Z"
}
```

### 4. Audio Correction
TTS audio of the correction
```json
{
  "type": "audio_correction",
  "data": "base64-encoded-wav-audio",
  "timestamp": "2024-01-03T12:00:00.000Z"
}
```

### 5. Error
```json
{
  "type": "error",
  "data": {
    "message": "Error description",
    "error": "detailed error info"
  },
  "timestamp": "2024-01-03T12:00:00.000Z"
}
```

### 6. Session Ended
```json
{
  "type": "session_ended",
  "data": {
    "sessionId": "session-uuid",
    "duration": 600,
    "errorsCount": 15,
    "correctionsCount": 12
  },
  "timestamp": "2024-01-03T12:00:00.000Z"
}
```

## Error Detection Methods

### 1. Rule-based (Layer 1)
- Fastest: ~10ms latency
- 50+ predefined grammar rules
- Detects common errors instantly
- Method: `"rule"`

### 2. Groq LLaMA (Layer 2)
- Fast LLM: ~100-150ms latency
- Complex grammar analysis
- Contextual understanding
- Method: `"groq"`

### 3. GPT-4o-mini (Layer 3)
- Fallback LLM: ~500ms latency
- High accuracy
- Nuanced corrections
- Method: `"gpt"`

### 4. Gemini Pro (Layer 4)
- Last resort fallback
- Reliable backup
- Method: `"gemini"`

## Error Types

- `subject-verb` - Subject-verb agreement errors
- `tense` - Tense mistakes
- `article` - Article (a/an/the) errors
- `preposition` - Preposition mistakes
- `filler` - Filler words (umm, aah, like)
- `indianism` - Indian English specific phrases
- `comparative` - Comparative/superlative errors
- `quantifier` - Much/many, less/fewer mistakes
- `negation` - Negation errors
- `auxiliary` - Auxiliary verb errors
- `verb` - General verb errors
- `plural` - Singular/plural mistakes

## Supported Languages

**Native Language Support** (for explanations):
- Hindi
- Tamil
- Telugu
- Marathi
- Punjabi
- Bengali
- Gujarati
- Kannada
- Malayalam
- Haryanvi

## Interview Domains

- `tech` - Software Engineering, Data Science, DevOps
- `finance` - Banking, Investment, Accounting
- `upsc` - Civil Services, IAS, IPS
- `business` - MBA, Marketing, HR
- `ssc` - SSC CGL, CHSL
- `railway` - Railway exams
- `nda` - National Defence Academy
- `cds` - Combined Defence Services

## Practice Modes

- `english_practice` - General English conversation
- `interview` - Domain-specific mock interviews
- `language_learning` - Learn Indian languages
- `roleplay` - Real-life scenario practice
