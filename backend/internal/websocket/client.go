package websocket

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	fiberws "github.com/gofiber/websocket/v2"
	"github.com/yuvraj707sharma/vartalaap_V2/backend/internal/services"
)

const (
	// Time allowed to write a message to the peer
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer
	pongWait = 60 * time.Second

	// Send pings to peer with this period (must be less than pongWait)
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer
	maxMessageSize = 512 * 1024 // 512KB for audio chunks
)

// Client represents a WebSocket client
type Client struct {
	hub *Hub

	// WebSocket connection (Fiber)
	conn *fiberws.Conn

	// Buffered channel of outbound messages
	send chan []byte

	// User information
	userID         string
	nativeLanguage string
	sessionID      string

	// Services
	grammarDetector *services.GrammarDetector
	deepgramService *services.DeepgramService

	// Session state
	currentTranscript string
	errorCount        int
}

// Message represents WebSocket messages
type Message struct {
	Type    string                 `json:"type"`
	Payload map[string]interface{} `json:"payload"`
}

// NewFiberClient creates a new Client instance with Fiber WebSocket
func NewFiberClient(hub *Hub, conn *fiberws.Conn, userID string, nativeLanguage string, grammarDetector *services.GrammarDetector, deepgramService *services.DeepgramService) *Client {
	return &Client{
		hub:             hub,
		conn:            conn,
		send:            make(chan []byte, 256),
		userID:          userID,
		nativeLanguage:  nativeLanguage,
		grammarDetector: grammarDetector,
		deepgramService: deepgramService,
		errorCount:      0,
	}
}

// readPump pumps messages from the WebSocket connection to the hub
func (c *Client) ReadPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, messageData, err := c.conn.ReadMessage()
		if err != nil {
			log.Printf("WebSocket read error: %v", err)
			break
		}

		// Process the message
		c.processMessage(messageData)
	}
}

// writePump pumps messages from the hub to the WebSocket connection
func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(fiberws.CloseMessage, []byte{})
				return
			}

			if err := c.conn.WriteMessage(fiberws.TextMessage, message); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(fiberws.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// processMessage processes incoming WebSocket messages
func (c *Client) processMessage(data []byte) {
	var msg Message
	if err := json.Unmarshal(data, &msg); err != nil {
		log.Printf("Error unmarshaling message: %v", err)
		return
	}

	switch msg.Type {
	case "audio":
		c.handleAudioMessage(msg.Payload)
	case "transcript":
		c.handleTranscriptMessage(msg.Payload)
	case "start_session":
		c.handleStartSession(msg.Payload)
	case "end_session":
		c.handleEndSession(msg.Payload)
	default:
		log.Printf("Unknown message type: %s", msg.Type)
	}
}

// handleAudioMessage processes audio data from the client
func (c *Client) handleAudioMessage(payload map[string]interface{}) {
	// In production, you would stream this to Deepgram WebSocket
	// For now, we'll handle transcript messages directly
	log.Printf("Received audio chunk from user %s", c.userID)
}

// handleTranscriptMessage processes transcript from STT
func (c *Client) handleTranscriptMessage(payload map[string]interface{}) {
	transcript, ok := payload["text"].(string)
	if !ok {
		return
	}

	isFinal, _ := payload["is_final"].(bool)
	
	c.currentTranscript = transcript

	// Check for grammar errors (this happens in < 5ms for rule-based)
	errorResult, err := c.grammarDetector.DetectGrammarError(transcript, c.nativeLanguage)
	if err != nil {
		log.Printf("Error detecting grammar: %v", err)
		return
	}

	if errorResult != nil && isFinal {
		// Interrupt user with error correction
		c.errorCount++
		
		// Generate audio response
		audioResponse, err := c.deepgramService.TextToSpeech(errorResult.ExplanationNative)
		if err != nil {
			log.Printf("Error generating TTS: %v", err)
		}

		// Send interruption message
		response := Message{
			Type: "interruption",
			Payload: map[string]interface{}{
				"error":           errorResult,
				"audio":           audioResponse,
				"timestamp":       time.Now().UnixMilli(),
				"latency_ms":      "< 300", // Our target latency
			},
		}

		responseData, _ := json.Marshal(response)
		c.send <- responseData
	}
}

// handleStartSession starts a new practice session
func (c *Client) handleStartSession(payload map[string]interface{}) {
	sessionID, _ := payload["session_id"].(string)
	c.sessionID = sessionID
	c.errorCount = 0

	response := Message{
		Type: "session_started",
		Payload: map[string]interface{}{
			"session_id": sessionID,
			"message":    "Session started successfully",
		},
	}

	responseData, _ := json.Marshal(response)
	c.send <- responseData
}

// handleEndSession ends the current practice session
func (c *Client) handleEndSession(payload map[string]interface{}) {
	response := Message{
		Type: "session_ended",
		Payload: map[string]interface{}{
			"session_id":  c.sessionID,
			"error_count": c.errorCount,
			"message":     "Session ended successfully",
		},
	}

	responseData, _ := json.Marshal(response)
	c.send <- responseData

	// Reset session
	c.sessionID = ""
	c.errorCount = 0
	c.currentTranscript = ""
}

// SendMessage sends a message to the client
func (c *Client) SendMessage(msgType string, payload map[string]interface{}) error {
	msg := Message{
		Type:    msgType,
		Payload: payload,
	}

	data, err := json.Marshal(msg)
	if err != nil {
		return fmt.Errorf("error marshaling message: %w", err)
	}

	select {
	case c.send <- data:
		return nil
	default:
		return fmt.Errorf("client send buffer full")
	}
}
