package websocket

import (
	"log"

	fiberws "github.com/gofiber/websocket/v2"
	"github.com/yuvraj707sharma/vartalaap_V2/backend/internal/services"
)

// Handler handles WebSocket connections
type Handler struct {
	hub             *Hub
	grammarDetector *services.GrammarDetector
	deepgramService *services.DeepgramService
	chunkAnalyzer   *services.ChunkAnalyzer
}

// NewHandler creates a new WebSocket handler
func NewHandler(hub *Hub, grammarDetector *services.GrammarDetector, deepgramService *services.DeepgramService, chunkAnalyzer *services.ChunkAnalyzer) *Handler {
	return &Handler{
		hub:             hub,
		grammarDetector: grammarDetector,
		deepgramService: deepgramService,
		chunkAnalyzer:   chunkAnalyzer,
	}
}

// ServeFiberWs handles Fiber WebSocket connections
func (h *Handler) ServeFiberWs(conn *fiberws.Conn, userID string, nativeLanguage string) {
	// Create new client with Fiber WebSocket connection
	client := NewFiberClient(h.hub, conn, userID, nativeLanguage, h.grammarDetector, h.deepgramService, h.chunkAnalyzer)
	client.hub.register <- client

	// Start client goroutines
	go client.WritePump()
	go client.ReadPump()

	log.Printf("New WebSocket connection: user_id=%s, native_language=%s", userID, nativeLanguage)
}
