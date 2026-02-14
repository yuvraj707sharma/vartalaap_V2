package services

import (
	"strings"
	"sync"

	"github.com/yuvraj707sharma/vartalaap_V2/backend/internal/rules"
)

// ChunkAnalyzer analyzes streaming speech chunks for grammar errors in real-time
type ChunkAnalyzer struct {
	grammarDetector *GrammarDetector
	sessions        map[string]*AnalysisSession
	mu              sync.RWMutex
}

// AnalysisSession represents an active analysis session
type AnalysisSession struct {
	sessionID       string
	slidingWindow   []string // Last ~10 words
	detectedErrors  map[string]bool // Track which errors we've already flagged
	fullTranscript  string
	nativeLanguage  string
	mu              sync.Mutex
}

// ChunkError represents an error detected in a chunk
type ChunkError struct {
	ChunkText      string  `json:"chunk_text"`
	ErrorResult    *ErrorResult `json:"error"`
	WordPosition   int     `json:"word_position"`
	IsNewError     bool    `json:"is_new_error"`
}

// NewChunkAnalyzer creates a new chunk analyzer
func NewChunkAnalyzer(grammarDetector *GrammarDetector) *ChunkAnalyzer {
	return &ChunkAnalyzer{
		grammarDetector: grammarDetector,
		sessions:        make(map[string]*AnalysisSession),
	}
}

// StartSession initializes a new analysis session
func (ca *ChunkAnalyzer) StartSession(sessionID, nativeLanguage string) {
	ca.mu.Lock()
	defer ca.mu.Unlock()

	ca.sessions[sessionID] = &AnalysisSession{
		sessionID:      sessionID,
		slidingWindow:  make([]string, 0, 10),
		detectedErrors: make(map[string]bool),
		fullTranscript: "",
		nativeLanguage: nativeLanguage,
	}
}

// AnalyzeChunk processes an interim or final transcript chunk
func (ca *ChunkAnalyzer) AnalyzeChunk(sessionID, chunkText string, isFinal bool) (*ChunkError, error) {
	ca.mu.RLock()
	session, exists := ca.sessions[sessionID]
	ca.mu.RUnlock()

	if !exists {
		// Auto-create session if it doesn't exist
		ca.StartSession(sessionID, "Hindi")
		ca.mu.RLock()
		session = ca.sessions[sessionID]
		ca.mu.RUnlock()
	}

	session.mu.Lock()
	defer session.mu.Unlock()

	// Update full transcript
	if isFinal {
		if session.fullTranscript != "" {
			session.fullTranscript += " " + chunkText
		} else {
			session.fullTranscript = chunkText
		}
	}

	// Add words to sliding window
	words := strings.Fields(chunkText)
	for _, word := range words {
		session.slidingWindow = append(session.slidingWindow, word)
		// Keep only last 10 words in the window
		if len(session.slidingWindow) > 10 {
			session.slidingWindow = session.slidingWindow[1:]
		}
	}

	// Get the text to analyze (last 5-10 words from sliding window)
	analyzeText := strings.Join(session.slidingWindow, " ")
	
	// Also analyze the new chunk itself
	if len(words) >= 2 {
		// Check the new chunk for errors
		errorResult, err := ca.grammarDetector.DetectGrammarError(chunkText, session.nativeLanguage)
		if err != nil {
			return nil, err
		}

		if errorResult != nil {
			// Create a unique key for this error to avoid double-flagging
			errorKey := errorResult.RuleID + ":" + errorResult.Original
			
			// Check if we've already flagged this exact error
			if !session.detectedErrors[errorKey] {
				session.detectedErrors[errorKey] = true
				
				return &ChunkError{
					ChunkText:    chunkText,
					ErrorResult:  errorResult,
					WordPosition: len(session.slidingWindow) - len(words),
					IsNewError:   true,
				}, nil
			}
		}
	}

	// Also check the sliding window context for errors
	if len(session.slidingWindow) >= 3 {
		windowText := strings.Join(session.slidingWindow[len(session.slidingWindow)-5:], " ")
		errorResult, err := ca.grammarDetector.DetectGrammarError(windowText, session.nativeLanguage)
		if err != nil {
			return nil, err
		}

		if errorResult != nil {
			errorKey := errorResult.RuleID + ":" + errorResult.Original
			
			if !session.detectedErrors[errorKey] {
				session.detectedErrors[errorKey] = true
				
				return &ChunkError{
					ChunkText:    windowText,
					ErrorResult:  errorResult,
					WordPosition: len(session.slidingWindow) - 5,
					IsNewError:   true,
				}, nil
			}
		}
	}

	return nil, nil
}

// GetFullTranscript returns the complete transcript for a session
func (ca *ChunkAnalyzer) GetFullTranscript(sessionID string) string {
	ca.mu.RLock()
	session, exists := ca.sessions[sessionID]
	ca.mu.RUnlock()

	if !exists {
		return ""
	}

	session.mu.Lock()
	defer session.mu.Unlock()
	
	return session.fullTranscript
}

// GetErrorCount returns the number of unique errors detected in a session
func (ca *ChunkAnalyzer) GetErrorCount(sessionID string) int {
	ca.mu.RLock()
	session, exists := ca.sessions[sessionID]
	ca.mu.RUnlock()

	if !exists {
		return 0
	}

	session.mu.Lock()
	defer session.mu.Unlock()
	
	return len(session.detectedErrors)
}

// ResetErrorTracking clears the detected errors for a session (useful for new attempts)
func (ca *ChunkAnalyzer) ResetErrorTracking(sessionID string) {
	ca.mu.RLock()
	session, exists := ca.sessions[sessionID]
	ca.mu.RUnlock()

	if !exists {
		return
	}

	session.mu.Lock()
	defer session.mu.Unlock()
	
	session.detectedErrors = make(map[string]bool)
}

// EndSession removes a session from memory
func (ca *ChunkAnalyzer) EndSession(sessionID string) {
	ca.mu.Lock()
	defer ca.mu.Unlock()
	
	delete(ca.sessions, sessionID)
}

// AnalyzeInterimText is optimized for analyzing interim (non-final) transcripts
// It focuses on the most recent words to minimize false positives
func (ca *ChunkAnalyzer) AnalyzeInterimText(sessionID, interimText string) ([]*ChunkError, error) {
	ca.mu.RLock()
	session, exists := ca.sessions[sessionID]
	ca.mu.RUnlock()

	if !exists {
		return nil, nil
	}

	session.mu.Lock()
	defer session.mu.Unlock()

	// For interim text, only check for obvious patterns
	// Extract last few words that form a complete phrase
	words := strings.Fields(interimText)
	if len(words) < 2 {
		return nil, nil
	}

	errors := make([]*ChunkError, 0)

	// Check common patterns that appear in real-time speech
	// Focus on subject-verb agreement, tense, and common errors
	commonPatterns := []struct {
		pattern string
		check   func(string) (*rules.GrammarRule, string)
	}{
		{"subject-verb", func(text string) (*rules.GrammarRule, string) {
			// Check for "I has", "he have", etc.
			return rules.DetectError(text)
		}},
	}

	for _, pattern := range commonPatterns {
		// Check last 3-5 words
		for i := len(words) - 5; i < len(words); i++ {
			if i < 0 {
				continue
			}
			
			phrase := strings.Join(words[i:], " ")
			if len(phrase) < 4 {
				continue
			}

			rule, corrected := pattern.check(phrase)
			if rule != nil {
				errorKey := rule.ID + ":" + phrase
				if !session.detectedErrors[errorKey] {
					// Don't mark as detected yet for interim results
					// Only mark when final
					
					errorResult := &ErrorResult{
						Original:           phrase,
						Corrected:          corrected,
						ErrorType:          rule.ErrorType,
						ExplanationEnglish: rule.Description,
						ExplanationNative:  ca.grammarDetector.generateNativeExplanation(rule.Description, session.nativeLanguage),
						RuleID:             rule.ID,
						Confidence:         0.9, // Slightly lower for interim
					}

					errors = append(errors, &ChunkError{
						ChunkText:    phrase,
						ErrorResult:  errorResult,
						WordPosition: i,
						IsNewError:   true,
					})
				}
			}
		}
	}

	return errors, nil
}

// GetSessionStats returns statistics for a session
func (ca *ChunkAnalyzer) GetSessionStats(sessionID string) map[string]interface{} {
	ca.mu.RLock()
	session, exists := ca.sessions[sessionID]
	ca.mu.RUnlock()

	if !exists {
		return map[string]interface{}{
			"error": "session not found",
		}
	}

	session.mu.Lock()
	defer session.mu.Unlock()

	// Calculate word count
	wordCount := len(strings.Fields(session.fullTranscript))

	// Calculate error rate
	errorRate := 0.0
	if wordCount > 0 {
		errorRate = float64(len(session.detectedErrors)) / float64(wordCount) * 100
	}

	return map[string]interface{}{
		"session_id":      session.sessionID,
		"word_count":      wordCount,
		"error_count":     len(session.detectedErrors),
		"error_rate":      errorRate,
		"full_transcript": session.fullTranscript,
		"errors_detected": ca.getErrorsList(session),
	}
}

// getErrorsList returns a list of all errors detected in a session
func (ca *ChunkAnalyzer) getErrorsList(session *AnalysisSession) []string {
	errors := make([]string, 0, len(session.detectedErrors))
	for errorKey := range session.detectedErrors {
		errors = append(errors, errorKey)
	}
	return errors
}
