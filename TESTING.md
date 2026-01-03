# Testing Guide

This document provides instructions for testing the Vartalaap AI 2.0 platform.

## Backend Tests

### 1. Grammar Detection Test

Test all 50+ grammar rules:

```bash
cd backend
go run cmd/test_grammar/main.go
```

Expected output: Detection of common errors like:
- Subject-verb agreement errors
- Tense errors
- Indianisms
- Common mistakes
- Plural/singular mismatches

### 2. API Endpoint Tests

Start the backend server:

```bash
cd backend
go run cmd/server/main.go
```

Test the REST API endpoints:

```bash
# Health check
curl http://localhost:8080/health

# Grammar check
curl -X POST http://localhost:8080/api/v1/check-grammar \
  -H "Content-Type: application/json" \
  -d '{"text": "I has a book", "native_language": "Hindi"}'

# Get supported languages
curl http://localhost:8080/api/v1/languages

# Get interview modes
curl http://localhost:8080/api/v1/interview-modes
```

### 3. WebSocket Connection Test

You can test WebSocket connections using a WebSocket client tool or the frontend.

WebSocket URL: `ws://localhost:8080/ws/practice?user_id=test&native_language=Hindi`

Expected message flow:
1. Connect to WebSocket
2. Send `start_session` message
3. Send `transcript` messages with text
4. Receive `interruption` messages when errors are detected
5. Send `end_session` message

## Frontend Tests

### 1. Development Server

Start the frontend development server:

```bash
cd frontend
npm install
npm run dev
```

Access: http://localhost:3000

### 2. Page Tests

Test each page:
- **Landing Page** (`/`): Verify features, pricing, and navigation
- **Practice Page** (`/practice`): Test voice session flow
- **Dashboard** (`/dashboard`): Verify stats and error display
- **Login** (`/auth/login`): Test authentication flow

### 3. Voice Session Test

On the practice page:
1. Select native language
2. Choose mode and domain
3. Click "Connect to Server"
4. Click "Start Session"
5. Click "Start Speaking"
6. Speak English with intentional errors
7. Verify real-time corrections appear

### 4. Build Test

Test production build:

```bash
cd frontend
npm run build
npm start
```

## Integration Tests

### 1. Full Stack Test with Docker

Build and run the entire stack:

```bash
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

### 2. End-to-End Test Flow

1. Open frontend at http://localhost:3000
2. Navigate to Practice page
3. Configure session settings
4. Connect to WebSocket
5. Start a practice session
6. Speak with grammar errors
7. Verify interruptions occur within 300ms
8. End session
9. Check dashboard for stats

## Performance Tests

### 1. Grammar Detection Latency

The rule-based grammar detection should complete in < 5ms:

```bash
cd backend
go test -bench=. ./internal/rules/
```

### 2. WebSocket Latency

Test WebSocket round-trip time:
- Should be < 50ms for message delivery
- Interruption latency should be < 300ms (including STT + grammar check + TTS)

### 3. API Response Time

All REST endpoints should respond in < 100µs for simple queries.

## Test Data

### Sample Grammar Errors

Use these test sentences:

**Subject-Verb Agreement:**
- "I has a book" → "I have a book"
- "He have a car" → "He has a car"
- "They is coming" → "They are coming"

**Tense Errors:**
- "Yesterday I go to market" → "Yesterday I went to market"
- "Tomorrow I went there" → "Tomorrow I will go there"

**Indianisms:**
- "Please do the needful" → "Please take necessary action"
- "I want to prepone the meeting" → "I want to reschedule earlier"
- "I am out of station" → "I am out of town"

**Common Mistakes:**
- "Could of done better" → "Could have done better"
- "Alot of people" → "A lot of people"
- "Your going there" → "You're going there"

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
lsof -ti:8080 | xargs kill -9
```

**Dependencies not found:**
```bash
cd backend
go mod tidy
go mod download
```

### Frontend Issues

**Node modules issues:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
cd frontend
npm run lint
```

## Continuous Integration

For CI/CD pipelines, use:

```bash
# Backend
cd backend
go test ./...
go build ./cmd/server

# Frontend
cd frontend
npm ci
npm run lint
npm run build
```

## Security Testing

Before deploying to production:
1. Ensure all API keys are in environment variables
2. Test CORS configuration
3. Validate input sanitization
4. Check rate limiting on API endpoints
5. Verify WebSocket authentication

## Load Testing

For production readiness:
1. Test with 100+ concurrent WebSocket connections
2. Monitor memory usage under load
3. Check database query performance
4. Validate error handling under stress
