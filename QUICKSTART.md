# Quick Start Guide

Get Vartalaap AI 2.0 up and running in 5 minutes!

## Prerequisites

- **Go 1.21+** ([Download](https://golang.org/dl/))
- **Node.js 20+** ([Download](https://nodejs.org/))
- **Docker & Docker Compose** (optional but recommended)

## Option 1: Docker (Recommended)

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
DEEPGRAM_API_KEY=your_key_here
GROQ_API_KEY=your_key_here  # Or OpenAI or Gemini
SUPABASE_URL=your_url_here
SUPABASE_ANON_KEY=your_key_here
```

### 3. Run with Docker

```bash
docker-compose up --build
```

That's it! Access:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080

## Option 2: Manual Setup

### Backend

```bash
cd backend
go mod download
go run cmd/server/main.go
```

Backend will run on http://localhost:8080

### Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:3000

## First Steps

### 1. Test the Backend

```bash
# Health check
curl http://localhost:8080/health

# Grammar check
curl -X POST http://localhost:8080/api/v1/check-grammar \
  -H "Content-Type: application/json" \
  -d '{"text": "I has a book", "native_language": "Hindi"}'
```

### 2. Open the Frontend

Visit http://localhost:3000

### 3. Try a Practice Session

1. Click "Start Practicing"
2. Select your native language (e.g., Hindi)
3. Click "Connect to Server"
4. Click "Start Session"
5. Click "Start Speaking"
6. Speak English (the app will use your browser's speech recognition)
7. Make an intentional error like "I has a book"
8. See the correction appear instantly!

## Example Test Sentences

Try these common errors:

### Subject-Verb Agreement
- "I has a book" → "I have a book"
- "He have a car" → "He has a car"
- "They is coming" → "They are coming"

### Tense Errors
- "Yesterday I go to market" → "Yesterday I went to market"
- "Tomorrow I went there" → "Tomorrow I will go there"

### Indianisms
- "Please do the needful" → "Please take necessary action"
- "I want to prepone the meeting" → "I want to reschedule earlier"
- "I am out of station" → "I am out of town"

### Common Mistakes
- "Could of done better" → "Could have done better"
- "Alot of people" → "A lot of people"
- "Your going" → "You're going"

## Troubleshooting

### Backend won't start

**Error: Port 8080 already in use**
```bash
lsof -ti:8080 | xargs kill -9
```

**Error: Module not found**
```bash
cd backend
go mod tidy
go mod download
```

### Frontend won't start

**Error: Cannot find module**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Error: Port 3000 already in use**
```bash
# The error message will suggest using a different port
# Press Y to use the suggested port
```

### No API Keys

Without API keys, you can still:
- ✅ Use rule-based grammar detection (50+ rules)
- ✅ Test the frontend UI
- ✅ Test WebSocket connections
- ❌ Won't work: Deepgram STT/TTS, LLM-based corrections

For testing without keys, use the grammar check API directly with text input.

## What's Next?

### Explore the Platform

- **Dashboard**: View your practice statistics at `/dashboard`
- **Different Modes**: Try interview modes for UPSC, Tech, Finance, etc.
- **Languages**: Test corrections in different Indian languages

### Read the Documentation

- [API Documentation](API.md) - REST and WebSocket API reference
- [Testing Guide](TESTING.md) - Comprehensive testing instructions
- [Contributing](CONTRIBUTING.md) - Help improve the platform

### Customize

- Add more grammar rules in `backend/internal/rules/english.go`
- Add language translations in `backend/internal/services/grammar_detector.go`
- Customize the UI in `frontend/app/` and `frontend/components/`

## Getting Help

- **Issues**: Found a bug? [Open an issue](https://github.com/yuvraj707sharma/vartalaap_V2/issues)
- **Discussions**: Have questions? [Start a discussion](https://github.com/yuvraj707sharma/vartalaap_V2/discussions)
- **Email**: support@vartalaap.ai

## Features Overview

✅ **Real-Time Corrections** - < 300ms interruption when you make errors
✅ **50+ Grammar Rules** - Comprehensive error detection
✅ **9 Indian Languages** - Explanations in your native language
✅ **Interview Modes** - Practice for Tech, UPSC, MBA, and more
✅ **Animated Voice Orb** - ChatGPT-style visual feedback
✅ **Progress Tracking** - Dashboard with statistics
✅ **Free Tier** - 30 minutes/day practice

## Development Mode

For active development:

```bash
# Backend (with auto-reload using air or similar)
cd backend
go run cmd/server/main.go

# Frontend (with hot reload)
cd frontend
npm run dev

# Watch logs
# Backend logs in the terminal
# Frontend logs in browser console (F12)
```

## Production Deployment

See the [README](README.md) for production deployment instructions.

---

**Happy Learning! 🎉**

Start improving your English speaking skills with real-time AI feedback!
