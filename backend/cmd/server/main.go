package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	fiberws "github.com/gofiber/websocket/v2"
	"github.com/joho/godotenv"
	
	"github.com/yuvraj707sharma/vartalaap_V2/backend/internal/services"
	"github.com/yuvraj707sharma/vartalaap_V2/backend/internal/websocket"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found")
	}

	// Initialize services
	llmRouter := services.NewLLMRouter()
	grammarDetector := services.NewGrammarDetector(llmRouter)
	deepgramService := services.NewDeepgramService()

	// Initialize WebSocket hub
	hub := websocket.NewHub()
	go hub.Run()

	wsHandler := websocket.NewHandler(hub, grammarDetector, deepgramService)

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName: "Vartalaap AI 2.0",
	})

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("FRONTEND_URL"),
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":         "ok",
			"active_clients": hub.GetClientCount(),
		})
	})

	// WebSocket upgrade middleware
	app.Use("/ws", func(c *fiber.Ctx) error {
		if fiberws.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	// WebSocket endpoint
	app.Get("/ws", fiberws.New(func(c *fiberws.Conn) {
		// This won't be called with our custom handler
		// We use the gorilla websocket handler directly
	}))

	// We need to use native http handler for gorilla websocket
	// Override the /ws route with native handler
	app.Get("/ws/practice", func(c *fiber.Ctx) error {
		// Upgrade to WebSocket using gorilla
		wsHandler.ServeWs(c.Context().Response().BodyWriter().(http.ResponseWriter), c.Context().Request())
		return nil
	})

	// API routes
	api := app.Group("/api/v1")

	// Grammar check endpoint (for testing)
	api.Post("/check-grammar", func(c *fiber.Ctx) error {
		var request struct {
			Text           string `json:"text"`
			NativeLanguage string `json:"native_language"`
		}

		if err := c.BodyParser(&request); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		if request.NativeLanguage == "" {
			request.NativeLanguage = "Hindi"
		}

		result, err := grammarDetector.DetectGrammarError(request.Text, request.NativeLanguage)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		if result == nil {
			return c.JSON(fiber.Map{
				"has_error": false,
				"message":   "No grammar errors detected",
			})
		}

		return c.JSON(fiber.Map{
			"has_error": true,
			"result":    result,
		})
	})

	// Interview modes endpoint
	api.Get("/interview-modes", func(c *fiber.Ctx) error {
		modes := []string{"Tech", "Finance", "UPSC", "SSC", "NDA", "CDS", "Business/MBA"}
		return c.JSON(fiber.Map{
			"modes": modes,
		})
	})

	// Supported languages endpoint
	api.Get("/languages", func(c *fiber.Ctx) error {
		languages := []string{
			"Hindi", "Tamil", "Telugu", "Marathi", 
			"Punjabi", "Bengali", "Gujarati", "Kannada", "Malayalam",
		}
		return c.JSON(fiber.Map{
			"languages": languages,
		})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Vartalaap AI 2.0 server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}

// Need to import http for the native http.ResponseWriter
import "net/http"
