# Vartalaap AI 2.0 - Real-Time Voice English Learning Platform

[![Go](https://img.shields.io/badge/Go-1.21-blue.svg)](https://golang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> **Ultra-low latency voice English learning platform with mid-sentence interruption for grammar corrections**

## 🎯 Overview

Vartalaap AI 2.0 is a real-time voice-based English learning platform that interrupts users **within < 300ms** when they make grammar mistakes. It provides instant feedback in the user's native Indian language (Hindi, Tamil, Telugu, etc.), helping them practice correct English.

### Key Features

- ⚡ **Ultra-Fast Interruption**: < 300ms latency for grammar corrections
- 🌏 **Multi-Language Support**: Explanations in 9 Indian languages
- 🎤 **Real-Time STT/TTS**: Powered by Deepgram
- 🤖 **AI-Powered**: LLM fallback with Groq → OpenAI → Gemini
- 📊 **50+ Grammar Rules**: Comprehensive rule-based detection
- 🎯 **Interview Modes**: Tech, Finance, UPSC, SSC, NDA, CDS, MBA
- 💎 **Freemium Model**: 30 min/day free, ₹99/month premium

## 🏗️ Architecture

```
┌─────────────┐         WebSocket          ┌──────────────┐
│   Next.js   │ ←────────────────────────→ │  Go Backend  │
│  Frontend   │    (Ultra-low latency)     │   (Fiber)    │
└─────────────┘                            └──────────────┘
      │                                            │
      │                                            ├─→ Deepgram STT/TTS
      │                                            ├─→ Grammar Detector
      │                                            │    (Rule-based ~5ms)
      │                                            └─→ LLM Router
      │                                                 (Groq/OpenAI/Gemini)
      ↓
┌─────────────┐
│  Supabase   │
│ PostgreSQL  │
└─────────────┘
```

## 📁 Project Structure

```
vartalaap_V2/
├── backend/                     # Go Backend (Fiber + WebSocket)
│   ├── cmd/server/
│   │   └── main.go             # Main server entry point
│   ├── internal/
│   │   ├── websocket/
│   │   │   ├── hub.go          # WebSocket hub
│   │   │   ├── client.go       # Client connection handler
│   │   │   └── handler.go      # WebSocket HTTP handler
│   │   ├── services/
│   │   │   ├── deepgram.go     # Deepgram STT/TTS integration
│   │   │   ├── llm_router.go   # LLM fallback router
│   │   │   └── grammar_detector.go  # Grammar detection service
│   │   └── rules/
│   │       └── english.go      # 50+ grammar rules
│   ├── go.mod
│   ├── go.sum
│   └── Dockerfile
│
├── frontend/                    # Next.js 14 Frontend
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles
│   │   ├── practice/page.tsx   # Voice practice page
│   │   ├── dashboard/page.tsx  # User dashboard
│   │   └── auth/login/page.tsx # Authentication
│   ├── components/
│   │   ├── VoiceOrb.tsx        # Animated voice orb
│   │   ├── TranscriptDisplay.tsx  # Transcript with errors
│   │   └── Navbar.tsx          # Navigation bar
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   └── websocket.ts        # WebSocket client
│   ├── hooks/
│   │   └── useVoiceSession.ts  # Voice session hook
│   ├── package.json
│   ├── tailwind.config.ts
│   └── Dockerfile
│
├── supabase/
│   └── migrations/
│       └── 001_schema.sql      # Database schema
│
├── docker-compose.yml           # Docker orchestration
├── .env.example                 # Environment variables template
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Go 1.21+
- Node.js 20+
- Docker & Docker Compose (optional)
- Deepgram API Key
- Groq/OpenAI/Gemini API Key (at least one)
- Supabase Account

### 1. Clone the Repository

```bash
git clone https://github.com/yuvraj707sharma/vartalaap_V2.git
cd vartalaap_V2
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Deepgram API Keys
DEEPGRAM_API_KEY=your_deepgram_api_key

# LLM API Keys (at least one required)
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Backend Configuration
PORT=8080
FRONTEND_URL=http://localhost:3000

# Frontend Configuration
NEXT_PUBLIC_BACKEND_URL=ws://localhost:8080
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database

Run the migration on your Supabase project:

```bash
# Using Supabase CLI
supabase db push

# Or manually execute the SQL in supabase/migrations/001_schema.sql
```

### 4. Run with Docker (Recommended)

```bash
docker-compose up --build
```

Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

### 5. Run Manually (Development)

#### Backend

```bash
cd backend
go mod download
go run cmd/server/main.go
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🎯 Usage

### 1. Select Your Native Language

Choose from 9 supported languages:
- Hindi (हिंदी)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Marathi (मराठी)
- Punjabi (ਪੰਜਾਬੀ)
- Bengali (বাংলা)
- Gujarati (ગુજરાતી)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)

### 2. Choose Practice Mode

- **Practice Mode**: General English conversation
- **Interview Mode**: Domain-specific practice
  - Tech Interviews
  - Finance Interviews
  - UPSC/SSC/NDA/CDS
  - Business/MBA

### 3. Start Speaking

1. Click "Start Session"
2. Click "Start Speaking"
3. Speak in English
4. Get instant corrections when you make mistakes

### 4. Review Your Progress

- View your dashboard for:
  - Total practice time
  - Errors made and corrected
  - Grammar score
  - Common error patterns

## 📚 Grammar Rules Covered

### Subject-Verb Agreement (8 rules)
- I has → I have
- He have → He has
- They is → They are

### Tense Errors (6 rules)
- Yesterday I go → Yesterday I went
- Tomorrow I went → Tomorrow I will go

### Indianisms (10 rules)
- Do the needful → Please take necessary action
- Prepone → Reschedule earlier
- Out of station → Out of town

### Common Mistakes (15+ rules)
- Could of → Could have
- Alot → A lot
- Your going → You're going

### Articles, Prepositions, Word Order (11+ rules)

**Total: 50+ comprehensive grammar rules**

## 🔧 API Endpoints

### WebSocket

```
ws://localhost:8080/ws/practice?user_id=USER_ID&native_language=LANGUAGE
```

#### Message Types

**Client → Server:**
```json
{
  "type": "start_session",
  "payload": {
    "session_id": "session_123",
    "mode": "practice",
    "domain": "General"
  }
}
```

```json
{
  "type": "transcript",
  "payload": {
    "text": "I has a book",
    "is_final": true
  }
}
```

**Server → Client:**
```json
{
  "type": "interruption",
  "payload": {
    "error": {
      "original": "I has a book",
      "corrected": "I have a book",
      "error_type": "Subject-Verb Agreement",
      "explanation_native": "'I' के साथ 'have' का उपयोग करें, 'has' नहीं"
    },
    "audio": "base64_audio_data",
    "latency_ms": "< 300"
  }
}
```

### REST API

**Health Check:**
```
GET /health
```

**Grammar Check:**
```
POST /api/v1/check-grammar
{
  "text": "I has a book",
  "native_language": "Hindi"
}
```

## 💰 Pricing

### Free Tier
- 30 minutes/day
- All grammar rules
- Multi-language support
- Basic analytics

### Premium (₹99/month or ₹999/year)
- Unlimited practice
- All interview modes
- Advanced analytics
- Priority support

## 🛠️ Tech Stack

### Backend
- **Language**: Go 1.21
- **Framework**: Fiber (HTTP)
- **WebSocket**: Gorilla WebSocket
- **Database**: PostgreSQL (Supabase)

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State**: React Hooks

### AI/ML Services
- **STT/TTS**: Deepgram
- **LLMs**: Groq (primary), OpenAI (fallback), Gemini (fallback)

### Infrastructure
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Docker + Docker Compose

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email: support@vartalaap.ai

## 🎉 Acknowledgments

- Deepgram for STT/TTS
- Groq for ultra-fast LLM inference
- Supabase for backend infrastructure
- Next.js team for the amazing framework

---

**Built with ❤️ for Indian English learners**