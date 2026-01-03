# Vartalaap AI 2.0 🚀

**Real-Time Voice-Based English Learning & Interview Preparation Platform**

A revolutionary platform that **interrupts users mid-sentence** to correct grammar mistakes, explains in their native Indian language, and provides domain-specific interview practice.

## 🌟 Key Features

### 1. **Real-Time Interruption System** (HERO FEATURE)
- AI detects and corrects errors **BEFORE** you finish speaking (&lt; 300ms latency)
- Multi-layer detection:
  - **Layer 1**: Rule-based grammar detection (~10ms) - 50+ common errors
  - **Layer 2**: Groq LLaMA 3.1 70B (~100ms) for complex errors
  - **Layer 3**: GPT-4o-mini fallback (~500ms)
  - **Layer 4**: Gemini Pro for redundancy

### 2. **Multi-Mode Learning**
- 🗣️ **English Practice** - Free conversation with real-time corrections
- 🎯 **Interview Prep** - Domain-specific mock interviews
- 🌐 **Language Learning** - Learn Hindi, Tamil, Marathi, Punjabi, etc.
- 🎭 **Roleplay** - Real-life scenarios (restaurant, airport, office)

### 3. **Interview Domains**
- **Tech**: Software Engineer, Data Science, DevOps, Product Manager
- **Finance**: Banking, Investment, CA, Accounting
- **Government**: UPSC, NDA, CDS, SSC, Railway, State PSC
- **Business**: MBA, Marketing, HR, Sales

### 4. **10+ Indian Languages Support**
Hindi, Tamil, Telugu, Marathi, Punjabi, Bengali, Gujarati, Kannada, Malayalam, Haryanvi
- All corrections explained in your native language
- Option to learn/practice these languages

### 5. **Filler Word Detection**
Detects and corrects: "umm", "aah", "like", "you know", etc.

## 🏗️ Architecture

```
Frontend (Next.js 14 + TypeScript)
         │
         ▼
Backend (Node.js + WebSocket)
         │
    ┌────┴────┐
    ▼         ▼
Deepgram    LLM Router
(STT/TTS)   (Groq → GPT → Gemini)
    │         │
    └────┬────┘
         ▼
    Supabase (Auth + DB)
```

## 📁 Project Structure

```
vartalaap_V2/
├── frontend/              # Next.js 14 App
│   ├── app/
│   │   ├── page.tsx      # Landing page
│   │   ├── practice/     # Voice practice page
│   │   ├── dashboard/    # User dashboard
│   │   ├── interview/    # Interview mode
│   │   └── auth/         # Authentication pages
│   ├── components/
│   │   ├── VoiceOrb.tsx           # Animated voice visualization
│   │   ├── TranscriptDisplay.tsx
│   │   ├── ErrorCorrection.tsx
│   │   └── ui/                    # Reusable components
│   ├── hooks/
│   │   ├── useVoice.ts           # Voice recording hook
│   │   └── useWebSocket.ts       # WebSocket hook
│   └── lib/
│
├── backend/               # Node.js Backend
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── websocket/
│   │   │   └── handler.ts        # WebSocket connection handler
│   │   ├── services/
│   │   │   ├── deepgram.ts       # Deepgram STT/TTS
│   │   │   ├── llm-router.ts     # Multi-LLM router
│   │   │   ├── error-detector.ts # Grammar detection
│   │   │   └── session.ts        # Session management
│   │   ├── rules/
│   │   │   └── english.ts        # 50+ grammar rules
│   │   └── prompts/
│   │       └── index.ts          # System prompts for modes
│   └── package.json
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── docker-compose.yml
└── .env.example
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database)
- API Keys:
  - Deepgram (for STT/TTS)
  - Groq API (for LLM)
  - OpenAI API (optional fallback)
  - Google AI API (optional fallback)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yuvraj707sharma/vartalaap_V2.git
cd vartalaap_V2
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env and add your API keys
```

3. **Install dependencies**

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

4. **Setup Database**
- Create a Supabase project
- Run the migration: `supabase/migrations/001_initial_schema.sql`
- Update `.env` with Supabase credentials

5. **Run in development**

Backend (in one terminal):
```bash
cd backend
npm run dev
```

Frontend (in another terminal):
```bash
cd frontend
npm run dev
```

6. **Open the app**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 🎨 UI Features

### Dark Mode Theme
- Cyan/Teal accent colors
- Animated voice orb (ChatGPT-style)
- Real-time transcript display
- Live error corrections with native language explanations

### Voice Practice Page
- Mode selector (English Practice, Interview, etc.)
- Language selector (10+ Indian languages)
- Timer showing session duration
- Start/Stop controls
- Real-time corrections display

## ⚡ Performance Targets

| Metric | Target |
|--------|--------|
| Interruption latency | &lt; 300ms |
| Audio-to-audio response | &lt; 500ms |
| Rule-based detection | &lt; 10ms |
| LLM detection (Groq) | &lt; 150ms |
| TTS generation | &lt; 200ms |

## 📊 Database Schema

- **users** - User profiles and subscription info
- **sessions** - Practice session records
- **errors** - Error tracking for analytics
- **subscriptions** - Premium subscriptions
- **ad_rewards** - Free minutes from watching ads

## 🔑 Environment Variables

See `.env.example` for required environment variables:
- `DEEPGRAM_API_KEY` - Deepgram API key
- `GROQ_API_KEY` - Groq API key
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `GOOGLE_AI_API_KEY` - Google AI API key (optional)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_WS_URL` - WebSocket server URL

## 🎯 Why Vartalaap AI > GPT/Gemini Voice?

| Feature | GPT/Gemini Voice | Vartalaap AI 2.0 |
|---------|-----------------|------------------|
| Real-time interruption | ❌ Waits for you | ✅ Interrupts mid-sentence |
| Native language | ❌ English only | ✅ 10+ Indian languages |
| Grammar focus | ❌ General chat | ✅ Built for learning |
| Interview prep | ❌ Generic | ✅ Domain-specific |
| Indian context | ❌ Western | ✅ Built for Indians |
| Latency | ~2-3 seconds | ✅ &lt; 300ms |
| Cost | $20/month | ✅ ₹99/month |

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- WebSocket client

**Backend:**
- Node.js + Express
- WebSocket (ws)
- TypeScript
- Deepgram SDK (STT/TTS)
- Groq SDK
- OpenAI SDK
- Google Generative AI

**Database:**
- Supabase (PostgreSQL)

**LLM Providers:**
- Groq (LLaMA 3.1 70B) - Primary
- OpenAI (GPT-4o-mini) - Fallback
- Google (Gemini Pro) - Fallback

## 📝 Common Grammar Rules

The system detects 50+ common Indian English errors:
- Subject-verb agreement ("I has" → "I have")
- Tense errors ("did went" → "did go")
- Indianisms ("do the needful" → "please help")
- Article errors ("I am engineer" → "I am an engineer")
- Preposition mistakes ("discuss about" → "discuss")
- Filler words ("umm", "aah", "like")

## 🚢 Deployment

**Frontend:** Deploy to Vercel
```bash
cd frontend
vercel deploy
```

**Backend:** Deploy to Railway/Render
```bash
cd backend
# Follow Railway/Render deployment guide
```

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read CONTRIBUTING.md for details.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for Indian students to master English speaking**
