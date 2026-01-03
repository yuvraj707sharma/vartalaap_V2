# Changelog

All notable changes to Vartalaap AI 2.0 will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial implementation of Vartalaap AI 2.0 platform
- Go backend with Fiber framework and WebSocket support
- Next.js 14 frontend with TypeScript
- 50+ grammar rules for real-time error detection
- Multi-language support (9 Indian languages)
- LLM router with fallback (Groq → OpenAI → Gemini)
- Deepgram STT/TTS integration
- Real-time voice practice with < 300ms interruption
- Animated voice orb (ChatGPT-style)
- User dashboard with analytics
- Interview modes (Tech, Finance, UPSC, SSC, NDA, CDS, MBA)
- Docker support for easy deployment
- Comprehensive API documentation
- Testing guide and tools
- Supabase database schema

### Features

#### Backend
- WebSocket-based real-time communication
- Rule-based grammar detection (~5ms latency)
- LLM fallback for complex errors
- Multi-language explanation generation
- REST API for grammar checking
- Health monitoring endpoint

#### Frontend
- Landing page with features and pricing
- Practice page with voice session
- Dashboard with statistics
- Authentication page
- Real-time transcript display
- Error highlighting and corrections
- Responsive design with Tailwind CSS
- Dark theme with cyan accents

#### Grammar Rules
- Subject-Verb Agreement (8 rules)
- Tense Errors (6 rules)
- Indianisms (10 rules)
- Articles (2 rules)
- Prepositions (3 rules)
- Common Mistakes (15+ rules)
- Plural/Singular (2 rules)
- Redundancies (4 rules)
- Fillers (3 rules)

### Performance
- Grammar detection: < 5ms (rule-based)
- API response time: < 100µs
- WebSocket latency: < 50ms
- Total interruption latency: < 300ms

### Documentation
- Comprehensive README with setup instructions
- API documentation (API.md)
- Testing guide (TESTING.md)
- Contributing guidelines (CONTRIBUTING.md)
- Database schema documentation

## [0.1.0] - 2026-01-03

### Added
- Initial project setup
- Project structure and dependencies
- Core functionality implementation

---

## Version History

- **v0.1.0** (2026-01-03): Initial release with core features
