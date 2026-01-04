# API Documentation

## REST API Endpoints

### Base URL
```
http://localhost:8080/api/v1
```

---

### 1. Health Check

**Endpoint:** `GET /health`

**Description:** Check server health and active WebSocket connections.

**Response:**
```json
{
  "status": "ok",
  "active_clients": 5
}
```

---

### 2. Check Grammar

**Endpoint:** `POST /api/v1/check-grammar`

**Description:** Check text for grammar errors.

**Request Body:**
```json
{
  "text": "I has a book",
  "native_language": "Hindi"
}
```

**Response (Error Found):**
```json
{
  "has_error": true,
  "result": {
    "original": "I has a book",
    "corrected": "I have a book",
    "error_type": "Subject-Verb Agreement",
    "explanation_english": "Use 'have' with 'I', not 'has'",
    "explanation_native": "'I' के साथ 'have' का उपयोग करें, 'has' नहीं",
    "rule_id": "I_HAS",
    "confidence": 0.95
  }
}
```

**Response (No Error):**
```json
{
  "has_error": false,
  "message": "No grammar errors detected"
}
```

---

### 3. Get Supported Languages

**Endpoint:** `GET /api/v1/languages`

**Description:** Get list of supported native languages for explanations.

**Response:**
```json
{
  "languages": [
    "Hindi",
    "Tamil",
    "Telugu",
    "Marathi",
    "Punjabi",
    "Bengali",
    "Gujarati",
    "Kannada",
    "Malayalam"
  ]
}
```

---

### 4. Get Interview Modes

**Endpoint:** `GET /api/v1/interview-modes`

**Description:** Get list of available interview practice modes.

**Response:**
```json
{
  "modes": [
    "Tech",
    "Finance",
    "UPSC",
    "SSC",
    "NDA",
    "CDS",
    "Business/MBA"
  ]
}
```

---

## WebSocket API

### Connection

**Endpoint:** `ws://localhost:8080/ws/practice`

**Query Parameters:**
- `user_id` (string, required): Unique user identifier
- `native_language` (string, optional): User's native language (default: "Hindi")

**Example:**
```javascript
const ws = new WebSocket('ws://localhost:8080/ws/practice?user_id=user123&native_language=Hindi');
```

---

### Message Format

All WebSocket messages follow this JSON format:

```json
{
  "type": "message_type",
  "payload": {
    // Message-specific data
  }
}
```

---

### Client → Server Messages

#### 1. Start Session

**Type:** `start_session`

**Payload:**
```json
{
  "session_id": "session_123",
  "mode": "practice",
  "domain": "General"
}
```

**Modes:** `"practice"`, `"interview"`

**Domains:** `"General"`, `"Tech"`, `"Finance"`, `"UPSC"`, `"SSC"`, `"NDA"`, `"CDS"`, `"Business/MBA"`

---

#### 2. Send Transcript

**Type:** `transcript`

**Payload:**
```json
{
  "text": "I has a book",
  "is_final": true
}
```

- `text` (string): Transcribed speech text
- `is_final` (boolean): Whether this is the final version of the transcript

---

#### 3. Send Audio

**Type:** `audio`

**Payload:**
```json
{
  "audio_data": "base64_encoded_audio",
  "format": "wav",
  "sample_rate": 16000
}
```

---

#### 4. End Session

**Type:** `end_session`

**Payload:**
```json
{
  "session_id": "session_123"
}
```

---

### Server → Client Messages

#### 1. Session Started

**Type:** `session_started`

**Payload:**
```json
{
  "session_id": "session_123",
  "message": "Session started successfully"
}
```

---

#### 2. Interruption (Grammar Error)

**Type:** `interruption`

**Payload:**
```json
{
  "error": {
    "original": "I has a book",
    "corrected": "I have a book",
    "error_type": "Subject-Verb Agreement",
    "explanation_english": "Use 'have' with 'I', not 'has'",
    "explanation_native": "'I' के साथ 'have' का उपयोग करें, 'has' नहीं",
    "rule_id": "I_HAS",
    "confidence": 0.95
  },
  "audio": "base64_encoded_audio_response",
  "timestamp": 1704311234567,
  "latency_ms": "< 300"
}
```

The `audio` field contains base64-encoded audio of the explanation in the user's native language.

---

#### 3. Session Ended

**Type:** `session_ended`

**Payload:**
```json
{
  "session_id": "session_123",
  "error_count": 5,
  "message": "Session ended successfully"
}
```

---

## Grammar Rules

### Error Types

The system detects 50+ grammar error types:

1. **Subject-Verb Agreement** (8 rules)
   - I has/have
   - He/She/It have/has
   - They is/are
   - We was/were
   - Everyone/Somebody are/is

2. **Tense Errors** (6 rules)
   - Yesterday + present tense
   - Tomorrow + past tense
   - Since/For + wrong tense
   - Last week/month/year + present tense

3. **Indianisms** (10 rules)
   - Do the needful
   - Prepone
   - Revert back
   - Out of station
   - Pass out (graduate)
   - Good name
   - Updation

4. **Articles** (2 rules)
   - Missing articles (a/an/the)
   - Unnecessary articles

5. **Prepositions** (3 rules)
   - Different than/from
   - Married with/to
   - Discuss about

6. **Common Mistakes** (15+ rules)
   - Could/Would/Should of
   - Alot
   - Your/You're
   - Its/It's
   - Their/There/They're
   - Then/Than
   - Affect/Effect

7. **Plural/Singular** (2 rules)
   - This/These
   - Less/Fewer

8. **Redundancies** (4 rules)
   - Repeat again
   - Return back
   - Revert back

9. **Fillers** (3 rules)
   - Umm, uhh
   - Like (excessive)
   - You know

---

## Rate Limiting

**Free Tier:**
- 30 minutes/day
- Unlimited grammar checks
- 100 WebSocket connections/hour

**Premium Tier:**
- Unlimited practice time
- Unlimited grammar checks
- 1000 WebSocket connections/hour

---

## Error Handling

### HTTP Status Codes

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request body or parameters
- `404 Not Found`: Endpoint not found
- `500 Internal Server Error`: Server error
- `101 Switching Protocols`: WebSocket upgrade successful
- `426 Upgrade Required`: WebSocket upgrade required for /ws endpoints

### Error Response Format

```json
{
  "error": "Error message description"
}
```

---

## Performance Metrics

### Response Times

- **Grammar Check API**: < 100µs (rule-based), < 500ms (LLM fallback)
- **WebSocket Message**: < 50ms round trip
- **Interruption Latency**: < 300ms (total: STT + grammar check + TTS)

### Grammar Detection

- **Rule-based**: ~5ms average
- **LLM fallback**: ~200-500ms (varies by provider)

---

## Examples

### Complete WebSocket Session

```javascript
// Connect
const ws = new WebSocket('ws://localhost:8080/ws/practice?user_id=user123&native_language=Hindi');

ws.onopen = () => {
  // Start session
  ws.send(JSON.stringify({
    type: 'start_session',
    payload: {
      session_id: 'session_' + Date.now(),
      mode: 'practice',
      domain: 'General'
    }
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === 'session_started') {
    console.log('Session started:', message.payload.session_id);
    
    // Send transcript
    ws.send(JSON.stringify({
      type: 'transcript',
      payload: {
        text: 'I has a book',
        is_final: true
      }
    }));
  }
  
  if (message.type === 'interruption') {
    console.log('Error detected:', message.payload.error);
    // Play audio response
    const audio = new Audio('data:audio/wav;base64,' + message.payload.audio);
    audio.play();
  }
  
  if (message.type === 'session_ended') {
    console.log('Session ended. Errors:', message.payload.error_count);
  }
};

// Later, end session
ws.send(JSON.stringify({
  type: 'end_session',
  payload: {
    session_id: 'session_123'
  }
}));
```

---

## Authentication

**Current:** No authentication required (development mode)

**Production:** 
- Use JWT tokens for WebSocket connections
- Add `Authorization` header to REST API calls
- Implement user session management

---

## CORS

**Development:**
```
Allow-Origin: *
```

**Production:**
Set `FRONTEND_URL` environment variable to restrict origins:
```
FRONTEND_URL=https://yourdomain.com
```
