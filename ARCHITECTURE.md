# Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js 14 Frontend (React)                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐   │  │
│  │  │   Pages    │  │ Components │  │      Hooks       │   │  │
│  │  │            │  │            │  │                  │   │  │
│  │  │ - Home     │  │ - VoiceOrb │  │ - useWebSocket   │   │  │
│  │  │ - Practice │  │ - Navbar   │  │ - useVoice       │   │  │
│  │  │ - Interview│  │ - Cards    │  │ - useAuth        │   │  │
│  │  │ - Dashboard│  │ - Buttons  │  │                  │   │  │
│  │  └────────────┘  └────────────┘  └──────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                    │                   │              │
│         │ HTTP               │ WebSocket         │ MediaStream  │
│         ▼                    ▼                   ▼              │
└─────────────────────────────────────────────────────────────────┘
          │                    │                   │
          │                    │                   │
          ▼                    ▼                   │
┌─────────────────────┐ ┌──────────────────────┐  │
│   Vercel (CDN)      │ │  Backend Server      │  │
│   Static Assets     │ │  (Railway/Render)    │  │
└─────────────────────┘ │                      │  │
                        │  ┌────────────────┐  │  │
                        │  │  Express +     │  │  │
                        │  │  WebSocket     │  │  │
                        │  └────────┬───────┘  │  │
                        │           │          │  │
                        │           ▼          │  │
                        │  ┌────────────────┐  │  │
                        │  │   WS Handler   │◄─┼──┘
                        │  │                │  │  Audio
                        │  │ - Session Mgmt │  │
                        │  │ - Audio Router │  │
                        │  └────────┬───────┘  │
                        │           │          │
                        │           ▼          │
                        │  ┌────────────────┐  │
                        │  │ Error Detector │  │
                        │  │                │  │
                        │  │ Layer 1: Rules │  │ ~10ms
                        │  │ Layer 2: Groq  │  │ ~100ms
                        │  │ Layer 3: GPT   │  │ ~500ms
                        │  │ Layer 4: Gemini│  │ Fallback
                        │  └────┬───────┬───┘  │
                        │       │       │      │
                        │       ▼       ▼      │
                        │  ┌─────┐  ┌──────┐  │
                        │  │ STT │  │ TTS  │  │
                        │  │     │  │      │  │
                        └──┴──┬──┴──┴───┬──┴──┘
                              │         │
                              ▼         ▼
                        ┌──────────────────┐
                        │  Deepgram API    │
                        │  - Speech to Text│
                        │  - Text to Speech│
                        └──────────────────┘
                              
          ┌────────────────────────────────────┐
          │         LLM Services               │
          │  ┌────────┐  ┌──────┐  ┌────────┐ │
          │  │ Groq   │  │ GPT  │  │ Gemini │ │
          │  │ LLaMA  │  │ 4o   │  │  Pro   │ │
          │  │ 3.1 70B│  │ mini │  │        │ │
          │  └────────┘  └──────┘  └────────┘ │
          └────────────────────────────────────┘
          
          ┌────────────────────────────────────┐
          │      Supabase (PostgreSQL)         │
          │  ┌──────────────────────────────┐  │
          │  │  Tables:                     │  │
          │  │  - users                     │  │
          │  │  - sessions                  │  │
          │  │  - errors                    │  │
          │  │  - subscriptions             │  │
          │  │  - ad_rewards                │  │
          │  └──────────────────────────────┘  │
          │  ┌──────────────────────────────┐  │
          │  │  Auth & RLS                  │  │
          │  └──────────────────────────────┘  │
          └────────────────────────────────────┘
```

## Data Flow

### 1. Session Initialization
```
User → Frontend → WebSocket → Backend
                              ↓
                        Create Session
                              ↓
                        Initialize Deepgram
                              ↓
                        Setup Error Detector
                              ↓
                        Send Session ID → Frontend
```

### 2. Voice Processing Pipeline
```
User Speech
    ↓
Microphone (MediaRecorder)
    ↓
Audio Chunks (250ms intervals)
    ↓
WebSocket (Base64)
    ↓
Backend Receiver
    ↓
Deepgram Live Transcription
    ↓
Interim Results ───────────┐
    ↓                      │
Final Results              │
    ↓                      │
Error Detection ←──────────┘
    │
    ├─ Layer 1: Rule Check (~10ms)
    │  ├─ Match? → Correction
    │  └─ No Match → Continue
    │
    ├─ Layer 2: Groq LLM (~100ms)
    │  ├─ Success → Correction
    │  └─ Fail → Continue
    │
    ├─ Layer 3: GPT-4o-mini (~500ms)
    │  ├─ Success → Correction
    │  └─ Fail → Continue
    │
    └─ Layer 4: Gemini Pro
       └─ Final Attempt
    
If Error Detected:
    ↓
Generate Correction
    ↓
Send to Frontend (WebSocket)
    ↓
Generate TTS Audio
    ↓
Send Audio to Frontend
    ↓
Play Correction Audio
```

### 3. Error Detection Logic
```typescript
async function detectError(text: string) {
  // Layer 1: Rule-based (fastest)
  const ruleResult = checkGrammarRules(text);
  if (ruleResult.hasError) {
    return ruleResult; // ~10ms
  }
  
  // Layer 2: Groq LLaMA 3.1 70B
  try {
    const groqResult = await groq.detect(text);
    if (groqResult.hasError) {
      return groqResult; // ~100ms
    }
  } catch (error) {
    console.log('Groq failed, trying GPT...');
  }
  
  // Layer 3: GPT-4o-mini
  try {
    const gptResult = await gpt.detect(text);
    if (gptResult.hasError) {
      return gptResult; // ~500ms
    }
  } catch (error) {
    console.log('GPT failed, trying Gemini...');
  }
  
  // Layer 4: Gemini Pro (fallback)
  return await gemini.detect(text);
}
```

## Component Relationships

```
App Layout
├── Navbar
│   ├── Logo
│   ├── Navigation Links
│   └── Auth Buttons
│
├── Pages
│   ├── Home (Landing)
│   │   ├── Hero Section
│   │   ├── Features Grid
│   │   ├── Comparison Table
│   │   └── CTA Buttons
│   │
│   ├── Practice
│   │   ├── Mode Selector
│   │   ├── Language Selector
│   │   ├── Voice Orb (animated)
│   │   ├── Transcript Display
│   │   ├── Error Corrections List
│   │   └── Control Buttons
│   │
│   ├── Interview
│   │   ├── Domain Selector
│   │   └── Interview Config
│   │
│   ├── Dashboard
│   │   ├── Stats Cards
│   │   ├── Progress Charts
│   │   ├── Error Patterns
│   │   ├── Session History
│   │   └── Premium Upgrade
│   │
│   └── Auth
│       ├── Login
│       └── Signup
│
└── Shared Components
    ├── Button
    ├── Card
    ├── Modal
    └── Loading States
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks
- **Real-time**: WebSocket
- **Audio**: MediaRecorder API

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express
- **Language**: TypeScript
- **WebSocket**: ws library
- **STT/TTS**: Deepgram SDK
- **LLMs**: 
  - Groq SDK (LLaMA 3.1 70B)
  - OpenAI SDK (GPT-4o-mini)
  - Google Generative AI (Gemini Pro)

### Database
- **Service**: Supabase
- **Database**: PostgreSQL
- **Auth**: Supabase Auth
- **Storage**: Row Level Security (RLS)

### Deployment
- **Frontend**: Vercel (Edge Network)
- **Backend**: Railway/Render
- **Database**: Supabase Cloud

## Performance Optimizations

1. **Multi-Layer Detection**
   - Rules first (10ms)
   - LLMs as fallback
   - Total latency < 300ms

2. **Streaming Audio**
   - 250ms chunks
   - Interim transcription results
   - Real-time processing

3. **Caching**
   - Common corrections cached
   - Session data in memory
   - Static assets on CDN

4. **Connection Management**
   - WebSocket keep-alive
   - Automatic reconnection
   - Connection pooling

## Security

1. **API Keys**
   - Environment variables only
   - Never in client code
   - Rotated regularly

2. **Authentication**
   - Supabase Auth
   - Row Level Security
   - JWT tokens

3. **Data Privacy**
   - No PII logging
   - Encrypted connections (WSS/HTTPS)
   - GDPR compliant

## Scalability

1. **Frontend**
   - Edge caching
   - Static generation
   - CDN distribution

2. **Backend**
   - Horizontal scaling
   - Stateless design
   - Load balancing

3. **Database**
   - Connection pooling
   - Read replicas
   - Indexed queries
