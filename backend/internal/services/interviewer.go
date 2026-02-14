package services

import (
	"fmt"
)

// InterviewerService manages interview personas and behaviors
type InterviewerService struct {
	personas map[string]*InterviewerPersona
}

// InterviewerPersona represents an interview mode configuration
type InterviewerPersona struct {
	Mode                  string
	Name                  string
	Description           string
	SystemPrompt          string
	SilenceThresholdMs    int     // How long to wait before nudging
	InterruptionThreshold float64 // How aggressive to interrupt (0.0-1.0)
	StrictnessLevel       int     // 1-5, how strict the interviewer is
	FocusAreas            []string
}

// NewInterviewerService creates a new interviewer service
func NewInterviewerService() *InterviewerService {
	service := &InterviewerService{
		personas: make(map[string]*InterviewerPersona),
	}
	
	// Initialize all personas
	service.initializePersonas()
	
	return service
}

// initializePersonas sets up all interviewer personas
func (is *InterviewerService) initializePersonas() {
	// NDA/SSB Persona
	is.personas["NDA"] = &InterviewerPersona{
		Mode:                  "NDA",
		Name:                  "Defence Services Interviewer",
		Description:           "Simulates National Defence Academy interview board",
		SilenceThresholdMs:    5000,
		InterruptionThreshold: 0.7,
		StrictnessLevel:       4,
		FocusAreas: []string{
			"Leadership qualities",
			"Current affairs and general knowledge",
			"Physical fitness awareness",
			"Motivation for armed forces",
			"Decision-making under pressure",
		},
		SystemPrompt: `You are a member of the National Defence Academy interview board. Your role is to assess candidates for officer positions in the Indian Armed Forces.

INTERVIEW STYLE:
- Be formal but fair
- Test leadership qualities through hypothetical scenarios
- Ask about current affairs, especially defence-related news
- Evaluate clarity of thought and decision-making
- Look for honesty, integrity, and patriotic spirit

COMMON QUESTIONS:
- "Why do you want to join the Armed Forces?"
- "Tell me about a situation where you showed leadership"
- "What would you do if your subordinate refuses to follow your order?"
- "What are your views on [current defence issue]?"

STRICTNESS:
- Interrupt for grammar errors but be respectful
- Push for clear, confident answers
- Challenge vague responses with "That's not specific enough. Give me a real example."
`,
	}

	is.personas["SSB"] = &InterviewerPersona{
		Mode:                  "SSB",
		Name:                  "Services Selection Board Interviewer",
		Description:           "Comprehensive SSB interview simulation",
		SilenceThresholdMs:    4500,
		InterruptionThreshold: 0.75,
		StrictnessLevel:       5,
		FocusAreas: []string{
			"Officer Like Qualities (OLQs)",
			"Planning and organizing",
			"Social adjustment",
			"Self-confidence",
			"Effective intelligence",
		},
		SystemPrompt: `You are conducting a Services Selection Board interview, assessing Officer Like Qualities.

ASSESSMENT AREAS:
1. Effective Intelligence - Reasoning, practical intelligence
2. Planning & Organizing - Systematic approach to problems
3. Social Adjustment - Cooperation, teamwork
4. Dynamism - Initiative, courage, determination
5. Self-Confidence - Decisiveness, mental robustness

INTERVIEW TECHNIQUE:
- Ask about family background, education, hobbies in detail
- Present Situation Reaction Tests (SRT): "You are a team leader and your team refuses to work. What would you do?"
- Evaluate every answer for OLQs
- Challenge inconsistencies politely but firmly

STRICTNESS:
- Very strict on grammar - officers must communicate clearly
- Interrupt immediately on errors
- Expect well-structured, confident responses
`,
	}

	is.personas["Tech"] = &InterviewerPersona{
		Mode:                  "Tech",
		Name:                  "Technical Interviewer",
		Description:           "Software/IT technical interview",
		SilenceThresholdMs:    6000,
		InterruptionThreshold: 0.6,
		StrictnessLevel:       3,
		FocusAreas: []string{
			"Programming languages and frameworks",
			"Problem-solving approach",
			"System design thinking",
			"Past projects and technical challenges",
			"Coding best practices",
		},
		SystemPrompt: `You are a senior software engineer conducting a technical interview.

FOCUS AREAS:
- Programming skills and language proficiency
- Problem-solving and algorithmic thinking
- System design and architecture
- Code quality and best practices
- Past project experience

INTERVIEW STYLE:
- Ask about technical stack and experience
- Present coding problems: "How would you design a scalable notification system?"
- Discuss trade-offs in technical decisions
- Ask about debugging and optimization experiences

STRICTNESS:
- Moderate on grammar - focus more on technical clarity
- Interrupt on errors but be understanding
- Value clear technical communication
`,
	}

	is.personas["HR"] = &InterviewerPersona{
		Mode:                  "HR",
		Name:                  "HR Interviewer",
		Description:           "Human Resources behavioral interview",
		SilenceThresholdMs:    4000,
		InterruptionThreshold: 0.8,
		StrictnessLevel:       4,
		FocusAreas: []string{
			"Behavioral questions (STAR method)",
			"Cultural fit",
			"Strengths and weaknesses",
			"Career goals",
			"Conflict resolution",
		},
		SystemPrompt: `You are an HR manager conducting a behavioral interview.

FOCUS AREAS:
- Behavioral questions using STAR method (Situation, Task, Action, Result)
- Cultural fit and values alignment
- Communication and interpersonal skills
- Career aspirations and growth mindset
- Team dynamics and conflict resolution

COMMON QUESTIONS:
- "Tell me about a time you faced a conflict at work"
- "What are your strengths and weaknesses?"
- "Where do you see yourself in 5 years?"
- "Describe a situation where you showed leadership"

STRICTNESS:
- High importance on clear communication
- Interrupt on grammar errors - communication is key for most roles
- Push for STAR format in answers
- Challenge generic responses
`,
	}

	is.personas["MBA"] = &InterviewerPersona{
		Mode:                  "MBA",
		Name:                  "MBA Interview Panel",
		Description:           "Business school admission interview",
		SilenceThresholdMs:    5000,
		InterruptionThreshold: 0.75,
		StrictnessLevel:       4,
		FocusAreas: []string{
			"Leadership and management experience",
			"Business acumen",
			"Analytical thinking",
			"Why MBA and career goals",
			"Case study discussions",
		},
		SystemPrompt: `You are a member of the MBA admissions committee interviewing a candidate.

ASSESSMENT FOCUS:
- Leadership and managerial potential
- Business understanding and commercial awareness
- Analytical and problem-solving skills
- Communication and presentation abilities
- Motivation and career clarity

INTERVIEW APPROACH:
- Ask about work experience and achievements
- Present business case studies: "A company is losing market share. What would you do?"
- Discuss career goals and why MBA
- Evaluate strategic thinking

STRICTNESS:
- High standards for communication - MBA requires excellent English
- Interrupt on grammar errors professionally
- Expect well-reasoned, structured answers
- Challenge assumptions in business cases
`,
	}

	is.personas["UPSC"] = &InterviewerPersona{
		Mode:                  "UPSC",
		Name:                  "UPSC Interview Board",
		Description:           "Civil Services Personality Test",
		SilenceThresholdMs:    6000,
		InterruptionThreshold: 0.8,
		StrictnessLevel:       5,
		FocusAreas: []string{
			"Current affairs and governance",
			"Ethics and integrity",
			"Administrative aptitude",
			"Public service motivation",
			"Social awareness",
		},
		SystemPrompt: `You are a member of the UPSC Civil Services Interview Board conducting the Personality Test.

ASSESSMENT AREAS:
- General knowledge and current affairs
- Mental alertness and critical thinking
- Social cohesion and diversity appreciation
- Ethical and moral integrity
- Administrative capability

INTERVIEW STYLE:
- Ask about current social/political issues
- Test ethical reasoning with dilemma situations
- Evaluate administrative decision-making
- Assess public service motivation
- Cover diverse topics - from hobbies to international relations

STRICTNESS:
- Very high standards - civil servants must communicate effectively
- Interrupt on grammar but remain dignified
- Expect thoughtful, balanced answers
- Challenge superficial knowledge
`,
	}

	is.personas["General"] = &InterviewerPersona{
		Mode:                  "General",
		Name:                  "General Practice Partner",
		Description:           "Friendly conversation practice",
		SilenceThresholdMs:    4000,
		InterruptionThreshold: 0.6,
		StrictnessLevel:       2,
		FocusAreas: []string{
			"Everyday conversation",
			"Hobbies and interests",
			"Work and education",
			"Travel and experiences",
			"Family and culture",
		},
		SystemPrompt: `You are a friendly conversation partner helping someone practice English.

CONVERSATION STYLE:
- Engage in natural, everyday conversations
- Cover various topics: hobbies, work, travel, family
- Ask open-ended questions to encourage speaking
- Be supportive and encouraging

TOPICS:
- "Tell me about your hobbies"
- "What do you do for work?"
- "Have you traveled anywhere interesting?"
- "What's your favorite food?"
- "Tell me about your family"

STRICTNESS:
- Gentle corrections - focus on encouragement
- Interrupt on clear errors but be friendly
- Help build confidence while improving grammar
`,
	}
}

// GetPersona returns the persona for a given mode
func (is *InterviewerService) GetPersona(mode string) *InterviewerPersona {
	persona, exists := is.personas[mode]
	if !exists {
		return is.personas["General"]
	}
	return persona
}

// GetAllPersonas returns all available personas
func (is *InterviewerService) GetAllPersonas() []*InterviewerPersona {
	personas := make([]*InterviewerPersona, 0, len(is.personas))
	for _, persona := range is.personas {
		personas = append(personas, persona)
	}
	return personas
}

// GenerateInterruptionMessage creates a grammar interruption message in the interviewer's style
func (is *InterviewerService) GenerateInterruptionMessage(mode, nativeLanguage string, errorResult *ErrorResult) string {
	persona := is.GetPersona(mode)
	
	// Base interruption in English
	englishInterruption := fmt.Sprintf("Wait! You said '%s'. The correct form is '%s'.",
		errorResult.Original,
		errorResult.Corrected,
	)

	// Add native language explanation
	nativeExplanation := errorResult.ExplanationNative

	// Mode-specific tone
	var tone string
	switch persona.StrictnessLevel {
	case 5:
		tone = "That's a significant error. "
	case 4:
		tone = "Let me correct that. "
	case 3:
		tone = "Just a small correction here. "
	default:
		tone = "Let me help you with that. "
	}

	// Construct full message
	fullMessage := fmt.Sprintf("%s%s In %s: %s. Now, please repeat the whole sentence correctly.",
		tone,
		englishInterruption,
		nativeLanguage,
		nativeExplanation,
	)

	return fullMessage
}

// GenerateNudgeMessage creates a message to nudge the user when they pause too long
func (is *InterviewerService) GenerateNudgeMessage(mode string, pauseDurationMs int) string {
	persona := is.GetPersona(mode)
	
	if pauseDurationMs < persona.SilenceThresholdMs {
		// Still within thinking time
		return ""
	}

	// Generate mode-appropriate nudge
	nudges := map[string][]string{
		"NDA": {
			"Take your time to think, but I need a clear answer.",
			"An officer must be decisive. What's your response?",
		},
		"SSB": {
			"We're waiting for your answer. Please continue.",
			"An officer should be confident in their responses. Go ahead.",
		},
		"Tech": {
			"Take a moment to structure your thoughts, then explain.",
			"Would you like me to rephrase the question?",
		},
		"HR": {
			"It's okay to take a moment. Please share your thoughts.",
			"I'm listening. Please continue when you're ready.",
		},
		"MBA": {
			"I'd like to hear your perspective. Please go ahead.",
			"Take your time to formulate a structured response.",
		},
		"UPSC": {
			"We appreciate thoughtful answers. Please continue when ready.",
			"Your response, please?",
		},
		"General": {
			"Don't worry! Take your time and continue when you're ready.",
			"I'm here. Please continue!",
		},
	}

	modeNudges := nudges[mode]
	if len(modeNudges) == 0 {
		modeNudges = nudges["General"]
	}

	// Return first nudge (in real implementation, could rotate)
	return modeNudges[0]
}

// ShouldInterrupt determines if the interviewer should interrupt based on persona
func (is *InterviewerService) ShouldInterrupt(mode string, errorConfidence float64) bool {
	persona := is.GetPersona(mode)
	return errorConfidence >= persona.InterruptionThreshold
}

// FormatPersonaCard returns a formatted description of a persona for the UI
func (is *InterviewerService) FormatPersonaCard(mode string) map[string]interface{} {
	persona := is.GetPersona(mode)
	
	// Map strictness level to display text
	strictnessText := []string{"Very Gentle", "Gentle", "Moderate", "Strict", "Very Strict"}
	strictnessIndex := persona.StrictnessLevel - 1
	if strictnessIndex < 0 {
		strictnessIndex = 0
	}
	if strictnessIndex >= len(strictnessText) {
		strictnessIndex = len(strictnessText) - 1
	}

	return map[string]interface{}{
		"mode":         persona.Mode,
		"name":         persona.Name,
		"description":  persona.Description,
		"strictness":   strictnessText[strictnessIndex],
		"focus_areas":  persona.FocusAreas,
		"patience_ms":  persona.SilenceThresholdMs,
	}
}

// GetAvailableModes returns a list of all available interview modes
func (is *InterviewerService) GetAvailableModes() []string {
	modes := make([]string, 0, len(is.personas))
	for mode := range is.personas {
		modes = append(modes, mode)
	}
	return modes
}

// ValidateMode checks if a mode is valid
func (is *InterviewerService) ValidateMode(mode string) bool {
	_, exists := is.personas[mode]
	return exists
}

// GetSystemPrompt returns the full system prompt for a mode with native language support
func (is *InterviewerService) GetSystemPrompt(mode, nativeLanguage string) string {
	persona := is.GetPersona(mode)
	
	// Add native language instruction
	nativeLanguageInstruction := fmt.Sprintf(`
LANGUAGE INSTRUCTIONS:
- The user's native language is %s
- When correcting grammar, always provide explanation in %s
- Use this format for corrections: "Wait! [Error explanation in English]. In %s: [Explanation in native language]. Now repeat correctly."
`, nativeLanguage, nativeLanguage, nativeLanguage)

	return persona.SystemPrompt + nativeLanguageInstruction
}

// GetQuickStartMessage returns an opening message for the interview
func (is *InterviewerService) GetQuickStartMessage(mode string) string {
	messages := map[string]string{
		"NDA":     "Welcome, candidate. Let's begin the interview. Please introduce yourself and tell me why you want to join the Armed Forces.",
		"SSB":     "Good morning. Please have a seat. Let's start with your personal background. Tell me about yourself.",
		"Tech":    "Hi! Thanks for taking the time to interview with us. Let's start with your technical background. Can you tell me about your experience?",
		"HR":      "Hello! Thanks for coming in today. Let's get to know you better. Please tell me about yourself and your career journey so far.",
		"MBA":     "Good afternoon. Welcome to our MBA program interview. Let's begin by discussing your professional background and why you want to pursue an MBA.",
		"UPSC":    "Good morning. Please be seated. Let's start with your educational background and optional subject choice.",
		"General": "Hello! I'm here to help you practice English conversation. Let's start with something simple - tell me about yourself and what you enjoy doing.",
	}

	msg, exists := messages[mode]
	if !exists {
		return messages["General"]
	}
	return msg
}
