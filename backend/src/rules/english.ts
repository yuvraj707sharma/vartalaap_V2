import { GrammarRule } from '../types';

// Common Indian English errors - 50+ rules for fast detection
export const grammarRules: GrammarRule[] = [
  // Subject-Verb Agreement
  { 
    pattern: /\bI\s+has\b/gi, 
    correction: "I have", 
    type: "subject-verb", 
    explanation_hi: "'I' के साथ 'have' use करो, 'has' नहीं" 
  },
  { 
    pattern: /\b(he|she|it)\s+have\b/gi, 
    correction: "$1 has", 
    type: "subject-verb", 
    explanation_hi: "'He/She/It' के साथ 'has' use करो" 
  },
  { 
    pattern: /\bI\s+is\b/gi, 
    correction: "I am", 
    type: "subject-verb", 
    explanation_hi: "'I' के साथ 'am' use करो" 
  },
  { 
    pattern: /\b(we|they|you)\s+is\b/gi, 
    correction: "$1 are", 
    type: "subject-verb", 
    explanation_hi: "'We/They/You' के साथ 'are' use करो" 
  },
  
  // Tense Errors
  { 
    pattern: /\bdid\s+\w+ed\b/gi, 
    correction: "did + base verb", 
    type: "tense", 
    explanation_hi: "'Did' के बाद base form use करो, -ed नहीं" 
  },
  { 
    pattern: /\byesterday\s+I\s+(go|eat|come|see)\b/gi, 
    correction: "yesterday I went/ate/came/saw", 
    type: "tense", 
    explanation_hi: "Past time के लिए past tense use करो" 
  },
  { 
    pattern: /\bI\s+am\s+go\b/gi, 
    correction: "I am going / I go", 
    type: "tense", 
    explanation_hi: "'Am' के साथ '-ing' form या simple present use करो" 
  },
  { 
    pattern: /\bsince\s+\d+\s+years\b/gi, 
    correction: "for X years", 
    type: "preposition", 
    explanation_hi: "Duration के लिए 'for' use करो, 'since' specific time के लिए है" 
  },
  { 
    pattern: /\bI\s+am\s+working\s+since\b/gi, 
    correction: "I have been working since", 
    type: "tense", 
    explanation_hi: "'Since' के साथ present perfect continuous use करो" 
  },
  
  // Double negatives & Common mistakes
  { 
    pattern: /\bmore\s+better\b/gi, 
    correction: "better", 
    type: "comparative", 
    explanation_hi: "'Better' already comparative है, 'more' मत लगाओ" 
  },
  { 
    pattern: /\bhe\s+don't\b/gi, 
    correction: "he doesn't", 
    type: "negation", 
    explanation_hi: "'He/She/It' के साथ 'doesn't' use करो" 
  },
  { 
    pattern: /\bI\s+didn't\s+went\b/gi, 
    correction: "I didn't go", 
    type: "tense", 
    explanation_hi: "'Didn't' के बाद base form use करो" 
  },
  { 
    pattern: /\bdon't\s+has\b/gi, 
    correction: "don't have", 
    type: "auxiliary", 
    explanation_hi: "'Don't' के बाद base form 'have' use करो" 
  },
  
  // Fillers (instant detection)
  { 
    pattern: /\b(umm+|uhh+|aah+|uh+|hmm+)\b/gi, 
    correction: "[pause instead]", 
    type: "filler", 
    explanation_hi: "Filler sounds avoid करो, बस pause लो" 
  },
  { 
    pattern: /\b(you know)\b/gi, 
    correction: "", 
    type: "filler", 
    explanation_hi: "'You know' filler है, हटाओ" 
  },
  { 
    pattern: /\blike\s+like\b/gi, 
    correction: "like", 
    type: "filler", 
    explanation_hi: "Repeated 'like' avoid करो" 
  },
  { 
    pattern: /\bbasically\s+basically\b/gi, 
    correction: "basically", 
    type: "filler", 
    explanation_hi: "Word repeat मत करो" 
  },
  
  // Indian English specific (Indianisms)
  { 
    pattern: /\bI\s+am\s+having\s+a\s+doubt\b/gi, 
    correction: "I have a question", 
    type: "indianism", 
    explanation_hi: "English में 'doubt' का मतलब अलग है, 'question' use करो" 
  },
  { 
    pattern: /\bkindly\s+do\s+the\s+needful\b/gi, 
    correction: "please help with this", 
    type: "indianism", 
    explanation_hi: "Modern English में ऐसा नहीं बोलते" 
  },
  { 
    pattern: /\bprepone\b/gi, 
    correction: "reschedule earlier / move up", 
    type: "indianism", 
    explanation_hi: "'Prepone' standard English नहीं है" 
  },
  { 
    pattern: /\brevert\s+back\b/gi, 
    correction: "reply / get back", 
    type: "indianism", 
    explanation_hi: "'Revert' का मतलब reply नहीं है English में" 
  },
  { 
    pattern: /\bout\s+of\s+station\b/gi, 
    correction: "out of town / traveling", 
    type: "indianism", 
    explanation_hi: "'Out of station' Indian English है" 
  },
  { 
    pattern: /\bdo\s+one\s+thing\b/gi, 
    correction: "[remove or rephrase]", 
    type: "indianism", 
    explanation_hi: "Direct instruction दो, 'do one thing' filler है" 
  },
  
  // Articles
  { 
    pattern: /\bI\s+am\s+engineer\b/gi, 
    correction: "I am an engineer", 
    type: "article", 
    explanation_hi: "Profession से पहले 'a/an' लगाओ" 
  },
  { 
    pattern: /\bhe\s+is\s+doctor\b/gi, 
    correction: "he is a doctor", 
    type: "article", 
    explanation_hi: "Singular countable noun से पहले article चाहिए" 
  },
  { 
    pattern: /\bshe\s+is\s+teacher\b/gi, 
    correction: "she is a teacher", 
    type: "article", 
    explanation_hi: "Profession से पहले 'a/an' लगाओ" 
  },
  
  // Prepositions
  { 
    pattern: /\bdiscuss\s+about\b/gi, 
    correction: "discuss", 
    type: "preposition", 
    explanation_hi: "'Discuss' के बाद 'about' नहीं लगता" 
  },
  { 
    pattern: /\benter\s+into\s+the\s+room\b/gi, 
    correction: "enter the room", 
    type: "preposition", 
    explanation_hi: "'Enter' के बाद 'into' नहीं लगता" 
  },
  { 
    pattern: /\breturn\s+back\b/gi, 
    correction: "return", 
    type: "preposition", 
    explanation_hi: "'Return' में 'back' का meaning already है" 
  },
  { 
    pattern: /\bmarried\s+with\b/gi, 
    correction: "married to", 
    type: "preposition", 
    explanation_hi: "'Married' के साथ 'to' use करो, 'with' नहीं" 
  },
  
  // More common errors
  { 
    pattern: /\bI\s+am\s+agree\b/gi, 
    correction: "I agree", 
    type: "verb", 
    explanation_hi: "'Agree' simple verb है, 'am' की जरूरत नहीं" 
  },
  { 
    pattern: /\bI\s+am\s+disagree\b/gi, 
    correction: "I disagree", 
    type: "verb", 
    explanation_hi: "'Disagree' simple verb है, 'am' की जरूरत नहीं" 
  },
  { 
    pattern: /\bI\s+am\s+understand\b/gi, 
    correction: "I understand", 
    type: "verb", 
    explanation_hi: "'Understand' simple verb है, 'am' की जरूरत नहीं" 
  },
  { 
    pattern: /\bmuch\s+people\b/gi, 
    correction: "many people", 
    type: "quantifier", 
    explanation_hi: "Countable के साथ 'many' use करो, 'much' uncountable के लिए है" 
  },
  { 
    pattern: /\bmuch\s+students\b/gi, 
    correction: "many students", 
    type: "quantifier", 
    explanation_hi: "Countable के साथ 'many' use करो" 
  },
  { 
    pattern: /\bless\s+people\b/gi, 
    correction: "fewer people", 
    type: "quantifier", 
    explanation_hi: "Countable के साथ 'fewer' use करो, 'less' uncountable के लिए है" 
  },
  { 
    pattern: /\bI\s+have\s+went\b/gi, 
    correction: "I have gone / I went", 
    type: "tense", 
    explanation_hi: "'Have' के साथ past participle 'gone' use करो" 
  },
  { 
    pattern: /\bI\s+have\s+ate\b/gi, 
    correction: "I have eaten / I ate", 
    type: "tense", 
    explanation_hi: "'Have' के साथ past participle 'eaten' use करो" 
  },
  { 
    pattern: /\bI\s+have\s+saw\b/gi, 
    correction: "I have seen / I saw", 
    type: "tense", 
    explanation_hi: "'Have' के साथ past participle 'seen' use करो" 
  },
  { 
    pattern: /\bone\s+of\s+my\s+friend\b/gi, 
    correction: "one of my friends", 
    type: "plural", 
    explanation_hi: "'One of' के बाद plural form use करो" 
  },
  { 
    pattern: /\btell\s+me\s+about\s+yourself\b/gi, 
    correction: "tell me about yourself", 
    type: "common-phrase", 
    explanation_hi: "यह सही है - interview में commonly पूछा जाता है" 
  },
  { 
    pattern: /\bwhat\s+is\s+your\s+good\s+name\b/gi, 
    correction: "what is your name", 
    type: "indianism", 
    explanation_hi: "'Good name' Indian English है, सिर्फ 'name' बोलो" 
  },
  { 
    pattern: /\bI\s+am\s+doing\s+my\s+homework\s+since\s+morning\b/gi, 
    correction: "I have been doing my homework since morning", 
    type: "tense", 
    explanation_hi: "'Since' के साथ present perfect continuous use करो" 
  },
  { 
    pattern: /\bI\s+am\s+here\s+since\s+yesterday\b/gi, 
    correction: "I have been here since yesterday", 
    type: "tense", 
    explanation_hi: "'Since' के साथ present perfect use करो" 
  },
  { 
    pattern: /\bless\s+words\b/gi, 
    correction: "fewer words", 
    type: "quantifier", 
    explanation_hi: "Countable के साथ 'fewer' use करो" 
  },
  { 
    pattern: /\bI\s+done\s+my\s+work\b/gi, 
    correction: "I did my work / I have done my work", 
    type: "tense", 
    explanation_hi: "Auxiliary verb 'have' या simple past 'did' use करो" 
  },
  { 
    pattern: /\bI\s+seen\s+that\s+movie\b/gi, 
    correction: "I saw that movie / I have seen that movie", 
    type: "tense", 
    explanation_hi: "Auxiliary verb 'have' या simple past 'saw' use करो" 
  },
  { 
    pattern: /\bmore\s+easier\b/gi, 
    correction: "easier", 
    type: "comparative", 
    explanation_hi: "'Easier' already comparative है" 
  },
  { 
    pattern: /\bmore\s+faster\b/gi, 
    correction: "faster", 
    type: "comparative", 
    explanation_hi: "'Faster' already comparative है" 
  },
  { 
    pattern: /\bvery\s+much\s+good\b/gi, 
    correction: "very good", 
    type: "adverb", 
    explanation_hi: "'Much' की जरूरत नहीं, सिर्फ 'very good' बोलो" 
  },
  { 
    pattern: /\btoo\s+much\s+hot\b/gi, 
    correction: "too hot / very hot", 
    type: "adverb", 
    explanation_hi: "'Too hot' या 'very hot' बोलो" 
  },
  { 
    pattern: /\bI\s+am\s+belonging\s+to\b/gi, 
    correction: "I belong to", 
    type: "verb", 
    explanation_hi: "Stative verbs में '-ing' नहीं लगता" 
  },
  { 
    pattern: /\bI\s+am\s+knowing\b/gi, 
    correction: "I know", 
    type: "verb", 
    explanation_hi: "Stative verbs में '-ing' नहीं लगता" 
  },
];

export function detectGrammarError(text: string): { hasError: boolean; rule?: GrammarRule; match?: RegExpMatchArray } {
  for (const rule of grammarRules) {
    const match = text.match(rule.pattern);
    if (match) {
      return { hasError: true, rule, match };
    }
  }
  return { hasError: false };
}
