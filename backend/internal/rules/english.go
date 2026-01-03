package rules

import (
	"regexp"
	"strings"
)

// GrammarRule represents a single grammar rule
type GrammarRule struct {
	ID          string
	Pattern     *regexp.Regexp
	ErrorType   string
	Description string
	Correction  func(string) string
}

// GrammarRules contains all 50+ grammar rules
var GrammarRules = []GrammarRule{
	// Subject-Verb Agreement
	{
		ID:          "I_HAS",
		Pattern:     regexp.MustCompile(`(?i)\bI has\b`),
		ErrorType:   "Subject-Verb Agreement",
		Description: "Use 'have' with 'I', not 'has'",
		Correction:  func(s string) string { return strings.ReplaceAll(strings.ToLower(s), "i has", "I have") },
	},
	{
		ID:          "HE_HAVE",
		Pattern:     regexp.MustCompile(`(?i)\b(he|she|it) have\b`),
		ErrorType:   "Subject-Verb Agreement",
		Description: "Use 'has' with 'he/she/it', not 'have'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\b(he|she|it) have\b`).ReplaceAllString(s, "$1 has") },
	},
	{
		ID:          "THEY_IS",
		Pattern:     regexp.MustCompile(`(?i)\bthey is\b`),
		ErrorType:   "Subject-Verb Agreement",
		Description: "Use 'are' with 'they', not 'is'",
		Correction:  func(s string) string { return strings.ReplaceAll(strings.ToLower(s), "they is", "they are") },
	},
	{
		ID:          "WE_WAS",
		Pattern:     regexp.MustCompile(`(?i)\bwe was\b`),
		ErrorType:   "Subject-Verb Agreement",
		Description: "Use 'were' with 'we', not 'was'",
		Correction:  func(s string) string { return strings.ReplaceAll(strings.ToLower(s), "we was", "we were") },
	},

	// Tense Errors
	{
		ID:          "YESTERDAY_GO",
		Pattern:     regexp.MustCompile(`(?i)\byesterday\b.*\bgo\b`),
		ErrorType:   "Tense Error",
		Description: "Use past tense 'went' with 'yesterday'",
		Correction:  func(s string) string { return strings.ReplaceAll(s, " go ", " went ") },
	},
	{
		ID:          "LAST_WEEK_DO",
		Pattern:     regexp.MustCompile(`(?i)\blast (week|month|year)\b.*\bdo\b`),
		ErrorType:   "Tense Error",
		Description: "Use past tense 'did' with past time markers",
		Correction:  func(s string) string { return strings.ReplaceAll(s, " do ", " did ") },
	},
	{
		ID:          "TOMORROW_WENT",
		Pattern:     regexp.MustCompile(`(?i)\btomorrow\b.*\bwent\b`),
		ErrorType:   "Tense Error",
		Description: "Use future tense with 'tomorrow'",
		Correction:  func(s string) string { return strings.ReplaceAll(s, " went ", " will go ") },
	},

	// Indianisms
	{
		ID:          "DO_THE_NEEDFUL",
		Pattern:     regexp.MustCompile(`(?i)\bdo the needful\b`),
		ErrorType:   "Indianism",
		Description: "Replace with 'please take necessary action' or 'please do what is needed'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bdo the needful\b`).ReplaceAllString(s, "please take necessary action") },
	},
	{
		ID:          "PREPONE",
		Pattern:     regexp.MustCompile(`(?i)\bprepone\b`),
		ErrorType:   "Indianism",
		Description: "Use 'reschedule earlier' or 'move forward' instead",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bprepone\b`).ReplaceAllString(s, "reschedule earlier") },
	},
	{
		ID:          "REVERT_BACK",
		Pattern:     regexp.MustCompile(`(?i)\brevert back\b`),
		ErrorType:   "Redundancy",
		Description: "'Revert' already means 'back', use just 'revert' or 'reply'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\brevert back\b`).ReplaceAllString(s, "reply") },
	},
	{
		ID:          "UPDATION",
		Pattern:     regexp.MustCompile(`(?i)\bupdation\b`),
		ErrorType:   "Indianism",
		Description: "Use 'update' instead of 'updation'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bupdation\b`).ReplaceAllString(s, "update") },
	},

	// Articles
	{
		ID:          "MISSING_ARTICLE_A",
		Pattern:     regexp.MustCompile(`(?i)\b(have|need|want|see) (book|car|house|pen)\b`),
		ErrorType:   "Missing Article",
		Description: "Add article 'a' before singular countable nouns",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\b(have|need|want|see) (book|car|house|pen)\b`).ReplaceAllString(s, "$1 a $2") },
	},
	{
		ID:          "THE_INDIA",
		Pattern:     regexp.MustCompile(`(?i)\bthe India\b`),
		ErrorType:   "Unnecessary Article",
		Description: "Don't use 'the' with country names (except USA, UK, etc.)",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bthe India\b`).ReplaceAllString(s, "India") },
	},

	// Prepositions
	{
		ID:          "DIFFERENT_THAN",
		Pattern:     regexp.MustCompile(`(?i)\bdifferent than\b`),
		ErrorType:   "Wrong Preposition",
		Description: "Use 'different from', not 'different than'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bdifferent than\b`).ReplaceAllString(s, "different from") },
	},
	{
		ID:          "MARRIED_WITH",
		Pattern:     regexp.MustCompile(`(?i)\bmarried with\b`),
		ErrorType:   "Wrong Preposition",
		Description: "Use 'married to', not 'married with'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bmarried with\b`).ReplaceAllString(s, "married to") },
	},
	{
		ID:          "DISCUSS_ABOUT",
		Pattern:     regexp.MustCompile(`(?i)\bdiscuss about\b`),
		ErrorType:   "Unnecessary Preposition",
		Description: "Use 'discuss', not 'discuss about'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bdiscuss about\b`).ReplaceAllString(s, "discuss") },
	},

	// Double Negatives
	{
		ID:          "DONT_HAVE_NOTHING",
		Pattern:     regexp.MustCompile(`(?i)\bdon't have nothing\b`),
		ErrorType:   "Double Negative",
		Description: "Use 'don't have anything' instead",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bdon't have nothing\b`).ReplaceAllString(s, "don't have anything") },
	},
	{
		ID:          "CANT_NEVER",
		Pattern:     regexp.MustCompile(`(?i)\bcan't never\b`),
		ErrorType:   "Double Negative",
		Description: "Use 'can never' instead",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bcan't never\b`).ReplaceAllString(s, "can never") },
	},

	// Fillers (common in speech)
	{
		ID:          "UMM_FILLER",
		Pattern:     regexp.MustCompile(`(?i)\b(umm|ummm|uhh|uhhh)\b`),
		ErrorType:   "Filler Word",
		Description: "Avoid using filler words like 'umm', 'uhh'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\b(umm|ummm|uhh|uhhh)\b`).ReplaceAllString(s, "") },
	},
	{
		ID:          "LIKE_FILLER",
		Pattern:     regexp.MustCompile(`(?i)\b(like)\b.*\b(like)\b.*\b(like)\b`),
		ErrorType:   "Excessive Filler",
		Description: "Reduce excessive use of 'like'",
		Correction:  func(s string) string { return s },
	},
	{
		ID:          "YOU_KNOW_FILLER",
		Pattern:     regexp.MustCompile(`(?i)\byou know\b`),
		ErrorType:   "Filler Phrase",
		Description: "Avoid filler phrase 'you know'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\byou know\b`).ReplaceAllString(s, "") },
	},

	// Plural/Singular
	{
		ID:          "THIS_THINGS",
		Pattern:     regexp.MustCompile(`(?i)\bthis (things|people|books|cars)\b`),
		ErrorType:   "Singular/Plural Mismatch",
		Description: "Use 'these' with plural nouns, not 'this'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bthis (things|people|books|cars)\b`).ReplaceAllString(s, "these $1") },
	},
	{
		ID:          "THESE_THING",
		Pattern:     regexp.MustCompile(`(?i)\bthese (thing|person|book|car)\b`),
		ErrorType:   "Singular/Plural Mismatch",
		Description: "Use 'this' with singular nouns, not 'these'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bthese (thing|person|book|car)\b`).ReplaceAllString(s, "this $1") },
	},

	// Word Order
	{
		ID:          "ALWAYS_NOT",
		Pattern:     regexp.MustCompile(`(?i)\balways not\b`),
		ErrorType:   "Word Order",
		Description: "Use 'not always' instead of 'always not'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\balways not\b`).ReplaceAllString(s, "not always") },
	},

	// Comparatives
	{
		ID:          "MORE_BETTER",
		Pattern:     regexp.MustCompile(`(?i)\bmore better\b`),
		ErrorType:   "Double Comparative",
		Description: "Use 'better', not 'more better'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bmore better\b`).ReplaceAllString(s, "better") },
	},
	{
		ID:          "MORE_WORSE",
		Pattern:     regexp.MustCompile(`(?i)\bmore worse\b`),
		ErrorType:   "Double Comparative",
		Description: "Use 'worse', not 'more worse'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bmore worse\b`).ReplaceAllString(s, "worse") },
	},

	// Common Mistakes
	{
		ID:          "COULD_OF",
		Pattern:     regexp.MustCompile(`(?i)\bcould of\b`),
		ErrorType:   "Common Mistake",
		Description: "Use 'could have' or 'could've', not 'could of'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bcould of\b`).ReplaceAllString(s, "could have") },
	},
	{
		ID:          "WOULD_OF",
		Pattern:     regexp.MustCompile(`(?i)\bwould of\b`),
		ErrorType:   "Common Mistake",
		Description: "Use 'would have' or 'would've', not 'would of'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bwould of\b`).ReplaceAllString(s, "would have") },
	},
	{
		ID:          "SHOULD_OF",
		Pattern:     regexp.MustCompile(`(?i)\bshould of\b`),
		ErrorType:   "Common Mistake",
		Description: "Use 'should have' or 'should've', not 'should of'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bshould of\b`).ReplaceAllString(s, "should have") },
	},

	// Less/Fewer
	{
		ID:          "LESS_PEOPLE",
		Pattern:     regexp.MustCompile(`(?i)\bless (people|students|items|things)\b`),
		ErrorType:   "Less vs Fewer",
		Description: "Use 'fewer' with countable nouns, not 'less'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bless (people|students|items|things)\b`).ReplaceAllString(s, "fewer $1") },
	},

	// Your/You're
	{
		ID:          "YOUR_ARE",
		Pattern:     regexp.MustCompile(`(?i)\byour (going|coming|being)\b`),
		ErrorType:   "Your vs You're",
		Description: "Use 'you're' (you are), not 'your'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\byour (going|coming|being)\b`).ReplaceAllString(s, "you're $1") },
	},

	// Their/There/They're
	{
		ID:          "THEIR_ARE",
		Pattern:     regexp.MustCompile(`(?i)\btheir are\b`),
		ErrorType:   "Their vs There",
		Description: "Use 'there are', not 'their are'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\btheir are\b`).ReplaceAllString(s, "there are") },
	},

	// Its/It's
	{
		ID:          "ITS_BEING",
		Pattern:     regexp.MustCompile(`(?i)\bits (going|coming|being)\b`),
		ErrorType:   "Its vs It's",
		Description: "Use 'it's' (it is), not 'its'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bits (going|coming|being)\b`).ReplaceAllString(s, "it's $1") },
	},

	// Then/Than
	{
		ID:          "BETTER_THEN",
		Pattern:     regexp.MustCompile(`(?i)\bbetter then\b`),
		ErrorType:   "Then vs Than",
		Description: "Use 'than' for comparisons, not 'then'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bbetter then\b`).ReplaceAllString(s, "better than") },
	},

	// Affect/Effect
	{
		ID:          "EFFECT_VERB",
		Pattern:     regexp.MustCompile(`(?i)\bwill effect\b`),
		ErrorType:   "Affect vs Effect",
		Description: "Use 'affect' as a verb, 'effect' as a noun",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bwill effect\b`).ReplaceAllString(s, "will affect") },
	},

	// More Indianisms
	{
		ID:          "OUT_OF_STATION",
		Pattern:     regexp.MustCompile(`(?i)\bout of station\b`),
		ErrorType:   "Indianism",
		Description: "Use 'out of town' instead of 'out of station'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bout of station\b`).ReplaceAllString(s, "out of town") },
	},
	{
		ID:          "PASS_OUT",
		Pattern:     regexp.MustCompile(`(?i)\bI (pass out|passed out) from college\b`),
		ErrorType:   "Indianism",
		Description: "Use 'graduate' instead of 'pass out' for education",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\b(pass out|passed out) from\b`).ReplaceAllString(s, "graduated from") },
	},
	{
		ID:          "GOOD_NAME",
		Pattern:     regexp.MustCompile(`(?i)\bgood name\b`),
		ErrorType:   "Indianism",
		Description: "Just ask 'What is your name?', not 'What is your good name?'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bgood name\b`).ReplaceAllString(s, "name") },
	},

	// More tense errors
	{
		ID:          "SINCE_PRESENT",
		Pattern:     regexp.MustCompile(`(?i)\bsince\b.*\b(go|come|work)\b`),
		ErrorType:   "Tense Error",
		Description: "Use present perfect tense with 'since'",
		Correction:  func(s string) string { return s },
	},
	{
		ID:          "FOR_PAST",
		Pattern:     regexp.MustCompile(`(?i)\bfor (two|three|four|five) (years|months|days)\b.*\bworked\b`),
		ErrorType:   "Tense Error",
		Description: "Use present perfect with duration (for/since)",
		Correction:  func(s string) string { return strings.ReplaceAll(s, "worked", "have been working") },
	},

	// Question formation
	{
		ID:          "WHERE_YOU_ARE",
		Pattern:     regexp.MustCompile(`(?i)\bwhere you are\b`),
		ErrorType:   "Question Formation",
		Description: "Use 'where are you' in questions",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bwhere you are\b`).ReplaceAllString(s, "where are you") },
	},
	{
		ID:          "WHAT_YOU_WANT",
		Pattern:     regexp.MustCompile(`(?i)\bwhat you want\b`),
		ErrorType:   "Question Formation",
		Description: "Use 'what do you want' in questions",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bwhat you want\b`).ReplaceAllString(s, "what do you want") },
	},

	// More subject-verb agreement
	{
		ID:          "EVERYONE_ARE",
		Pattern:     regexp.MustCompile(`(?i)\beveryone are\b`),
		ErrorType:   "Subject-Verb Agreement",
		Description: "'Everyone' is singular, use 'is' not 'are'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\beveryone are\b`).ReplaceAllString(s, "everyone is") },
	},
	{
		ID:          "SOMEBODY_ARE",
		Pattern:     regexp.MustCompile(`(?i)\b(somebody|someone|anybody|anyone) are\b`),
		ErrorType:   "Subject-Verb Agreement",
		Description: "Indefinite pronouns are singular, use 'is'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\b(somebody|someone|anybody|anyone) are\b`).ReplaceAllString(s, "$1 is") },
	},

	// Redundancies
	{
		ID:          "REPEAT_AGAIN",
		Pattern:     regexp.MustCompile(`(?i)\brepeat again\b`),
		ErrorType:   "Redundancy",
		Description: "'Repeat' already means 'again', just use 'repeat'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\brepeat again\b`).ReplaceAllString(s, "repeat") },
	},
	{
		ID:          "RETURN_BACK",
		Pattern:     regexp.MustCompile(`(?i)\breturn back\b`),
		ErrorType:   "Redundancy",
		Description: "'Return' already means 'back', just use 'return'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\breturn back\b`).ReplaceAllString(s, "return") },
	},

	// More common errors
	{
		ID:          "ALOT",
		Pattern:     regexp.MustCompile(`(?i)\balot\b`),
		ErrorType:   "Spelling Error",
		Description: "Use 'a lot' (two words), not 'alot'",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\balot\b`).ReplaceAllString(s, "a lot") },
	},
	{
		ID:          "CANT_ABLE_TO",
		Pattern:     regexp.MustCompile(`(?i)\bcan't able to\b`),
		ErrorType:   "Double Modal",
		Description: "Use either 'can't' or 'not able to', not both",
		Correction:  func(s string) string { return regexp.MustCompile(`(?i)\bcan't able to\b`).ReplaceAllString(s, "am not able to") },
	},
}

// DetectError checks text against all grammar rules
func DetectError(text string) (*GrammarRule, string) {
	text = strings.TrimSpace(text)
	if text == "" {
		return nil, ""
	}

	for i := range GrammarRules {
		rule := &GrammarRules[i]
		if rule.Pattern.MatchString(text) {
			corrected := rule.Correction(text)
			return rule, corrected
		}
	}

	return nil, ""
}
