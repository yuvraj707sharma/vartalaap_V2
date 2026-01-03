package websocket

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/yuvraj707sharma/vartalaap_V2/backend/internal/services"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Allow all origins for development
		// In production, restrict to your frontend domain
		return true
	},
}

// Handler handles WebSocket connections
type Handler struct {
	hub             *Hub
	grammarDetector *services.GrammarDetector
	deepgramService *services.DeepgramService
}

// NewHandler creates a new WebSocket handler
func NewHandler(hub *Hub, grammarDetector *services.GrammarDetector, deepgramService *services.DeepgramService) *Handler {
	return &Handler{
		hub:             hub,
		grammarDetector: grammarDetector,
		deepgramService: deepgramService,
	}
}

// ServeWs handles WebSocket requests from clients
func (h *Handler) ServeWs(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}

	// Get user info from query params
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		userID = "anonymous"
	}

	nativeLanguage := r.URL.Query().Get("native_language")
	if nativeLanguage == "" {
		nativeLanguage = "Hindi"
	}

	// Create new client
	client := NewClient(h.hub, conn, userID, nativeLanguage, h.grammarDetector, h.deepgramService)
	client.hub.register <- client

	// Start client goroutines
	go client.WritePump()
	go client.ReadPump()

	log.Printf("New WebSocket connection: user_id=%s, native_language=%s", userID, nativeLanguage)
}
