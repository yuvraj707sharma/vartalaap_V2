package services

import (
	"fmt"
	"log"
	"os"
	"sync"

	"github.com/fasthttp/websocket"
)

// OpenAIRealtimeService handles OpenAI Realtime API WebSocket connections
type OpenAIRealtimeService struct {
	apiKey      string
	model       string
	connections map[string]*RealtimeConnection
	mu          sync.RWMutex
}

// RealtimeConnection represents a connection to OpenAI Realtime API
type RealtimeConnection struct {
	conn           *websocket.Conn
	sessionID      string
	interviewMode  string
	nativeLanguage string
	stopChan       chan bool
}

// ServerVADConfig represents server-side VAD configuration
type ServerVADConfig struct {
	Type              string `json:"type"`
	Threshold         float64 `json:"threshold"`
	PrefixPaddingMs   int    `json:"prefix_padding_ms"`
	SilenceDurationMs int    `json:"silence_duration_ms"`
}

// NewOpenAIRealtimeService creates a new OpenAI Realtime API service
func NewOpenAIRealtimeService() *OpenAIRealtimeService {
	apiKey := os.Getenv("OPENAI_API_KEY")
	model := os.Getenv("OPENAI_REALTIME_MODEL")
	if model == "" {
		model = "gpt-4o-realtime-preview-2024-10-01"
	}

	return &OpenAIRealtimeService{
		apiKey:      apiKey,
		model:       model,
		connections: make(map[string]*RealtimeConnection),
	}
}

// Connect establishes a WebSocket connection to OpenAI Realtime API
func (s *OpenAIRealtimeService) Connect(sessionID, interviewMode, nativeLanguage string) (*RealtimeConnection, error) {
	if s.apiKey == "" {
		return nil, fmt.Errorf("OPENAI_API_KEY not configured")
	}

	// WebSocket URL for OpenAI Realtime API
	url := fmt.Sprintf("wss://api.openai.com/v1/realtime?model=%s", s.model)
	
	// Set up headers with API key
	headers := map[string][]string{
		"Authorization": {fmt.Sprintf("Bearer %s", s.apiKey)},
		"OpenAI-Beta":   {"realtime=v1"},
	}

	dialer := websocket.Dialer{}
	conn, _, err := dialer.Dial(url, headers)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to OpenAI Realtime API: %w", err)
	}

	rtConn := &RealtimeConnection{
		conn:           conn,
		sessionID:      sessionID,
		interviewMode:  interviewMode,
		nativeLanguage: nativeLanguage,
		stopChan:       make(chan bool),
	}

	// Store connection
	s.mu.Lock()
	s.connections[sessionID] = rtConn
	s.mu.Unlock()

	// Configure the session
	if err := s.configureSession(rtConn); err != nil {
		conn.Close()
		return nil, fmt.Errorf("failed to configure session: %w", err)
	}

	log.Printf("OpenAI Realtime connection established for session %s", sessionID)
	return rtConn, nil
}

// configureSession sends initial configuration to OpenAI Realtime API
func (s *OpenAIRealtimeService) configureSession(rtConn *RealtimeConnection) error {
	// Configure server-side VAD with thinking-pause awareness
	vadConfig := ServerVADConfig{
		Type:              "server_vad",
		Threshold:         0.5,
		PrefixPaddingMs:   300,
		SilenceDurationMs: 4000, // 4 seconds for thinking pauses
	}

	// Get interviewer system prompt based on mode
	systemPrompt := s.getInterviewerPrompt(rtConn.interviewMode, rtConn.nativeLanguage)

	// Session update message
	sessionUpdate := map[string]interface{}{
		"type": "session.update",
		"session": map[string]interface{}{
			"modalities":          []string{"text", "audio"},
			"instructions":        systemPrompt,
			"voice":              "alloy",
			"input_audio_format":  "pcm16",
			"output_audio_format": "pcm16",
			"input_audio_transcription": map[string]interface{}{
				"model": "whisper-1",
			},
			"turn_detection": vadConfig,
			"tools": []map[string]interface{}{
				{
					"type": "function",
					"name": "check_grammar",
					"description": "Check a piece of text for grammar errors using the fast rule-based grammar detector",
					"parameters": map[string]interface{}{
						"type": "object",
						"properties": map[string]interface{}{
							"text": map[string]interface{}{
								"type": "string",
								"description": "The text to check for grammar errors",
							},
						},
						"required": []string{"text"},
					},
				},
			},
		},
	}

	return rtConn.conn.WriteJSON(sessionUpdate)
}

// getInterviewerPrompt returns the system prompt for the interviewer based on mode
func (s *OpenAIRealtimeService) getInterviewerPrompt(mode, nativeLanguage string) string {
	basePrompt := fmt.Sprintf(`You are a STRICT English conversation interviewer helping a user practice fluent English speaking. The user's native language is %s.

CORE BEHAVIOR:
1. You are PATIENT when the user is thinking (pauses up to 4 seconds are normal)
2. You INTERRUPT IMMEDIATELY when you hear a grammar error
3. When you interrupt, provide:
   - The correction in English
   - A brief explanation in %s (their native language)
   - Then ask them to repeat the sentence correctly

4. You are STRICT but ENCOURAGING - like a tough but caring teacher
5. Push back on vague answers with "That's too vague. Be specific."
6. Ask follow-up questions to simulate real interview pressure

INTERRUPTION FORMAT (when error detected):
"Wait! You said [wrong phrase]. The correct way is [corrected phrase]. In %s: [explanation]. Now, please repeat the whole sentence correctly."

EXAMPLE:
User: "Hello my name is Aloo and I lives in Dausa"
You: "Ruko! You said 'I lives'. The correct form is 'I live'. In %s: Subject singular hai toh verb bhi singular hoga, lekin 'I' ke saath hamesha 'live' use karte hain, 'lives' nahi. Now repeat the sentence: 'Hello my name is Aloo and I live in Dausa.'"
`, nativeLanguage, nativeLanguage, nativeLanguage, nativeLanguage)

	// Add mode-specific prompts
	modePrompts := map[string]string{
		"NDA": `
INTERVIEW MODE: National Defence Academy (NDA) Interview
- Focus on leadership qualities, current affairs, and general knowledge
- Ask about motivation to join armed forces
- Test decision-making in hypothetical military scenarios
- Evaluate communication clarity and confidence
`,
		"SSB": `
INTERVIEW MODE: Services Selection Board (SSB) Interview
- Conduct structured interview covering Officer Like Qualities (OLQs)
- Ask about family background, education, hobbies
- Present situation reaction tests (SRT)
- Evaluate planning and organizing ability
`,
		"Tech": `
INTERVIEW MODE: Technical Interview (Software/IT)
- Ask about programming languages and frameworks
- Present coding problems and discuss solutions
- Evaluate problem-solving approach
- Ask about past projects and technical challenges
`,
		"HR": `
INTERVIEW MODE: HR Interview
- Ask behavioral questions (STAR method)
- Discuss strengths, weaknesses, and career goals
- Evaluate cultural fit and soft skills
- Ask about conflict resolution and teamwork
`,
		"MBA": `
INTERVIEW MODE: MBA Interview
- Discuss academic background and work experience
- Ask about leadership experiences and business scenarios
- Evaluate analytical thinking and communication
- Present case studies for business problem-solving
`,
		"UPSC": `
INTERVIEW MODE: UPSC Civil Services Interview
- Test knowledge of current affairs and governance
- Ask about ethics, integrity, and social issues
- Evaluate administrative aptitude
- Discuss policy matters and public service motivation
`,
		"General": `
INTERVIEW MODE: General Practice
- Engage in natural conversation on everyday topics
- Cover a variety of subjects: hobbies, work, travel, family
- Ask open-ended questions to encourage speaking
`,
	}

	if modePrompt, ok := modePrompts[mode]; ok {
		return basePrompt + modePrompt
	}

	return basePrompt + modePrompts["General"]
}

// SendAudio sends audio data to OpenAI Realtime API
func (s *OpenAIRealtimeService) SendAudio(sessionID string, audioData []byte) error {
	s.mu.RLock()
	rtConn, exists := s.connections[sessionID]
	s.mu.RUnlock()

	if !exists {
		return fmt.Errorf("session not found: %s", sessionID)
	}

	// Send audio data as input_audio_buffer.append
	message := map[string]interface{}{
		"type":  "input_audio_buffer.append",
		"audio": audioData, // base64 encoded PCM16 audio
	}

	return rtConn.conn.WriteJSON(message)
}

// CommitAudio commits the audio buffer (signals end of user speech)
func (s *OpenAIRealtimeService) CommitAudio(sessionID string) error {
	s.mu.RLock()
	rtConn, exists := s.connections[sessionID]
	s.mu.RUnlock()

	if !exists {
		return fmt.Errorf("session not found: %s", sessionID)
	}

	message := map[string]interface{}{
		"type": "input_audio_buffer.commit",
	}

	return rtConn.conn.WriteJSON(message)
}

// ReadMessage reads a message from OpenAI Realtime API
func (s *OpenAIRealtimeService) ReadMessage(sessionID string) (map[string]interface{}, error) {
	s.mu.RLock()
	rtConn, exists := s.connections[sessionID]
	s.mu.RUnlock()

	if !exists {
		return nil, fmt.Errorf("session not found: %s", sessionID)
	}

	var message map[string]interface{}
	err := rtConn.conn.ReadJSON(&message)
	return message, err
}

// TriggerFunctionCall sends a function call result back to OpenAI
func (s *OpenAIRealtimeService) TriggerFunctionCall(sessionID, callID string, result interface{}) error {
	s.mu.RLock()
	rtConn, exists := s.connections[sessionID]
	s.mu.RUnlock()

	if !exists {
		return fmt.Errorf("session not found: %s", sessionID)
	}

	message := map[string]interface{}{
		"type":    "conversation.item.create",
		"item": map[string]interface{}{
			"type":    "function_call_output",
			"call_id": callID,
			"output":  result,
		},
	}

	return rtConn.conn.WriteJSON(message)
}

// Disconnect closes the connection to OpenAI Realtime API
func (s *OpenAIRealtimeService) Disconnect(sessionID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	rtConn, exists := s.connections[sessionID]
	if !exists {
		return fmt.Errorf("session not found: %s", sessionID)
	}

	close(rtConn.stopChan)
	rtConn.conn.Close()
	delete(s.connections, sessionID)

	log.Printf("OpenAI Realtime connection closed for session %s", sessionID)
	return nil
}

// IsConfigured checks if OpenAI API key is configured
func (s *OpenAIRealtimeService) IsConfigured() bool {
	return s.apiKey != ""
}

// StartRelay starts relaying messages between browser and OpenAI
func (s *OpenAIRealtimeService) StartRelay(sessionID string, outputChan chan<- map[string]interface{}) {
	s.mu.RLock()
	rtConn, exists := s.connections[sessionID]
	s.mu.RUnlock()

	if !exists {
		log.Printf("Cannot start relay: session %s not found", sessionID)
		return
	}

	go func() {
		for {
			select {
			case <-rtConn.stopChan:
				return
			default:
				message, err := s.ReadMessage(sessionID)
				if err != nil {
					log.Printf("Error reading from OpenAI Realtime: %v", err)
					return
				}

				// Forward message to output channel
				outputChan <- message
			}
		}
	}()
}

// ParseRealtimeEvent parses OpenAI Realtime API events
func ParseRealtimeEvent(message map[string]interface{}) string {
	eventType, _ := message["type"].(string)
	return eventType
}
