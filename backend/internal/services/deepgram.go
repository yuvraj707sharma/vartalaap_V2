package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

// DeepgramService handles STT and TTS with Deepgram
type DeepgramService struct {
	apiKey     string
	httpClient *http.Client
}

// TranscriptResult represents STT result
type TranscriptResult struct {
	Text       string  `json:"text"`
	Confidence float64 `json:"confidence"`
	IsFinal    bool    `json:"is_final"`
}

// NewDeepgramService creates a new Deepgram service
func NewDeepgramService() *DeepgramService {
	return &DeepgramService{
		apiKey: os.Getenv("DEEPGRAM_API_KEY"),
		httpClient: &http.Client{},
	}
}

// TranscribeAudio transcribes audio to text using Deepgram
func (ds *DeepgramService) TranscribeAudio(audioData []byte) (*TranscriptResult, error) {
	url := "https://api.deepgram.com/v1/listen?model=nova-2&language=en&punctuate=true&interim_results=true"

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(audioData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Token "+ds.apiKey)
	req.Header.Set("Content-Type", "audio/wav")

	resp, err := ds.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("deepgram API error: %s", string(body))
	}

	var response struct {
		Results struct {
			Channels []struct {
				Alternatives []struct {
					Transcript string  `json:"transcript"`
					Confidence float64 `json:"confidence"`
				} `json:"alternatives"`
			} `json:"channels"`
		} `json:"results"`
		Metadata struct {
			IsFinal bool `json:"is_final"`
		} `json:"metadata"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, err
	}

	if len(response.Results.Channels) > 0 && len(response.Results.Channels[0].Alternatives) > 0 {
		alt := response.Results.Channels[0].Alternatives[0]
		return &TranscriptResult{
			Text:       alt.Transcript,
			Confidence: alt.Confidence,
			IsFinal:    response.Metadata.IsFinal,
		}, nil
	}

	return nil, fmt.Errorf("no transcription result")
}

// TextToSpeech converts text to speech using Deepgram
func (ds *DeepgramService) TextToSpeech(text string) ([]byte, error) {
	url := "https://api.deepgram.com/v1/speak?model=aura-asteria-en"

	requestBody := map[string]string{
		"text": text,
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Token "+ds.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := ds.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("deepgram TTS error: %s", string(body))
	}

	audioData, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return audioData, nil
}

// GetWebSocketURL returns the WebSocket URL for real-time streaming
func (ds *DeepgramService) GetWebSocketURL() string {
	return fmt.Sprintf("wss://api.deepgram.com/v1/listen?model=nova-2&language=en&punctuate=true&interim_results=true&encoding=linear16&sample_rate=16000")
}

// GetAuthHeader returns the authorization header for WebSocket
func (ds *DeepgramService) GetAuthHeader() string {
	return "Token " + ds.apiKey
}
