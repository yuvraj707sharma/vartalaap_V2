package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

// LLMRouter handles LLM requests with fallback mechanism: Groq -> OpenAI -> Gemini
type LLMRouter struct {
	groqAPIKey   string
	openAIAPIKey string
	geminiAPIKey string
	httpClient   *http.Client
}

// NewLLMRouter creates a new LLM router
func NewLLMRouter() *LLMRouter {
	return &LLMRouter{
		groqAPIKey:   os.Getenv("GROQ_API_KEY"),
		openAIAPIKey: os.Getenv("OPENAI_API_KEY"),
		geminiAPIKey: os.Getenv("GEMINI_API_KEY"),
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// Generate generates text using LLM with fallback
func (lr *LLMRouter) Generate(prompt string) (string, error) {
	// Try Groq first (fastest)
	if lr.groqAPIKey != "" {
		response, err := lr.callGroq(prompt)
		if err == nil {
			return response, nil
		}
		fmt.Printf("Groq failed: %v, falling back to OpenAI\n", err)
	}

	// Fallback to OpenAI
	if lr.openAIAPIKey != "" {
		response, err := lr.callOpenAI(prompt)
		if err == nil {
			return response, nil
		}
		fmt.Printf("OpenAI failed: %v, falling back to Gemini\n", err)
	}

	// Fallback to Gemini
	if lr.geminiAPIKey != "" {
		response, err := lr.callGemini(prompt)
		if err == nil {
			return response, nil
		}
		fmt.Printf("Gemini failed: %v\n", err)
	}

	return "", fmt.Errorf("all LLM providers failed")
}

// callGroq calls Groq API
func (lr *LLMRouter) callGroq(prompt string) (string, error) {
	url := "https://api.groq.com/openai/v1/chat/completions"

	requestBody := map[string]interface{}{
		"model": "mixtral-8x7b-32768",
		"messages": []map[string]string{
			{
				"role":    "user",
				"content": prompt,
			},
		},
		"temperature": 0.3,
		"max_tokens":  500,
	}

	return lr.makeRequest(url, lr.groqAPIKey, requestBody, "groq")
}

// callOpenAI calls OpenAI API
func (lr *LLMRouter) callOpenAI(prompt string) (string, error) {
	url := "https://api.openai.com/v1/chat/completions"

	requestBody := map[string]interface{}{
		"model": "gpt-3.5-turbo",
		"messages": []map[string]string{
			{
				"role":    "user",
				"content": prompt,
			},
		},
		"temperature": 0.3,
		"max_tokens":  500,
	}

	return lr.makeRequest(url, lr.openAIAPIKey, requestBody, "openai")
}

// callGemini calls Google Gemini API
func (lr *LLMRouter) callGemini(prompt string) (string, error) {
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=%s", lr.geminiAPIKey)

	requestBody := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]string{
					{
						"text": prompt,
					},
				},
			},
		},
		"generationConfig": map[string]interface{}{
			"temperature":  0.3,
			"maxOutputTokens": 500,
		},
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := lr.httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("gemini API error: %s", string(body))
	}

	var response struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return "", err
	}

	if len(response.Candidates) > 0 && len(response.Candidates[0].Content.Parts) > 0 {
		return response.Candidates[0].Content.Parts[0].Text, nil
	}

	return "", fmt.Errorf("no response from Gemini")
}

// makeRequest makes HTTP request to LLM API
func (lr *LLMRouter) makeRequest(url string, apiKey string, requestBody map[string]interface{}, provider string) (string, error) {
	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	resp, err := lr.httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("%s API error: %s", provider, string(body))
	}

	var response struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return "", err
	}

	if len(response.Choices) > 0 {
		return response.Choices[0].Message.Content, nil
	}

	return "", fmt.Errorf("no response from %s", provider)
}
