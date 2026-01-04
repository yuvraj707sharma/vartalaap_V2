package services

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/yuvraj707sharma/vartalaap_V2/backend/internal/rules"
)

// GrammarDetector handles real-time grammar detection
type GrammarDetector struct {
	llmRouter *LLMRouter
}

// ErrorResult represents a detected error
type ErrorResult struct {
	Original          string `json:"original"`
	Corrected         string `json:"corrected"`
	ErrorType         string `json:"error_type"`
	ExplanationEnglish string `json:"explanation_english"`
	ExplanationNative string `json:"explanation_native"`
	RuleID            string `json:"rule_id"`
	Confidence        float64 `json:"confidence"`
}

// NewGrammarDetector creates a new grammar detector
func NewGrammarDetector(llmRouter *LLMRouter) *GrammarDetector {
	return &GrammarDetector{
		llmRouter: llmRouter,
	}
}

// DetectGrammarError checks for grammar errors with < 5ms latency for rule-based detection
func (gd *GrammarDetector) DetectGrammarError(text string, nativeLanguage string) (*ErrorResult, error) {
	// First, try rule-based detection (ultra-fast, ~1-5ms)
	if rule, corrected := rules.DetectError(text); rule != nil {
		explanation := gd.generateNativeExplanation(rule.Description, nativeLanguage)
		
		return &ErrorResult{
			Original:          text,
			Corrected:         corrected,
			ErrorType:         rule.ErrorType,
			ExplanationEnglish: rule.Description,
			ExplanationNative: explanation,
			RuleID:            rule.ID,
			Confidence:        0.95,
		}, nil
	}

	// If no rule matched and text is long enough, use LLM fallback for complex errors
	if len(strings.Fields(text)) >= 5 {
		return gd.detectWithLLM(text, nativeLanguage)
	}

	return nil, nil
}

// detectWithLLM uses LLM for complex grammar detection
func (gd *GrammarDetector) detectWithLLM(text string, nativeLanguage string) (*ErrorResult, error) {
	prompt := fmt.Sprintf(`Analyze this English text for grammar errors: "%s"

If there's a grammar error:
1. Provide the corrected version
2. Explain the error type
3. Give a brief explanation

Respond in JSON format:
{
  "has_error": true/false,
  "corrected": "corrected text",
  "error_type": "type of error",
  "explanation": "brief explanation"
}`, text)

	response, err := gd.llmRouter.Generate(prompt)
	if err != nil {
		return nil, err
	}

	var llmResult struct {
		HasError    bool   `json:"has_error"`
		Corrected   string `json:"corrected"`
		ErrorType   string `json:"error_type"`
		Explanation string `json:"explanation"`
	}

	if err := json.Unmarshal([]byte(response), &llmResult); err != nil {
		return nil, err
	}

	if !llmResult.HasError {
		return nil, nil
	}

	explanation := gd.generateNativeExplanation(llmResult.Explanation, nativeLanguage)

	return &ErrorResult{
		Original:          text,
		Corrected:         llmResult.Corrected,
		ErrorType:         llmResult.ErrorType,
		ExplanationEnglish: llmResult.Explanation,
		ExplanationNative: explanation,
		RuleID:            "LLM_DETECTED",
		Confidence:        0.85,
	}, nil
}

// generateNativeExplanation generates explanation in user's native language
func (gd *GrammarDetector) generateNativeExplanation(englishExplanation string, nativeLanguage string) string {
	// Quick translations for common explanations
	translations := map[string]map[string]string{
		"Hindi": {
			"Use 'have' with 'I', not 'has'": "'I' के साथ 'have' का उपयोग करें, 'has' नहीं",
			"Use 'has' with 'he/she/it', not 'have'": "'he/she/it' के साथ 'has' का उपयोग करें, 'have' नहीं",
			"Use 'are' with 'they', not 'is'": "'they' के साथ 'are' का उपयोग करें, 'is' नहीं",
			"Use past tense 'went' with 'yesterday'": "'yesterday' के साथ भूतकाल 'went' का उपयोग करें",
		},
		"Tamil": {
			"Use 'have' with 'I', not 'has'": "'I' உடன் 'have' பயன்படுத்தவும், 'has' அல்ல",
			"Use 'has' with 'he/she/it', not 'have'": "'he/she/it' உடன் 'has' பயன்படுத்தவும், 'have' அல்ல",
		},
		"Telugu": {
			"Use 'have' with 'I', not 'has'": "'I' తో 'have' ఉపయోగించండి, 'has' కాదు",
			"Use 'has' with 'he/she/it', not 'have'": "'he/she/it' తో 'has' ఉపయోగించండి, 'have' కాదు",
		},
	}

	// Check if translation exists
	if langMap, ok := translations[nativeLanguage]; ok {
		if translation, ok := langMap[englishExplanation]; ok {
			return translation
		}
	}

	// Fallback: use LLM for translation if not in quick translations
	if gd.llmRouter != nil {
		prompt := fmt.Sprintf(`Translate this English explanation to %s (keep it concise, under 20 words):
"%s"

Only provide the translation, no other text.`, nativeLanguage, englishExplanation)

		translation, err := gd.llmRouter.Generate(prompt)
		if err == nil && translation != "" {
			return strings.TrimSpace(translation)
		}
	}

	// Ultimate fallback: return English
	return englishExplanation
}
