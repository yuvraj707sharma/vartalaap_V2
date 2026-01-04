# Contributing to Vartalaap AI 2.0

Thank you for your interest in contributing to Vartalaap AI 2.0! This document provides guidelines for contributing to the project.

## 🎯 Ways to Contribute

- **Add Grammar Rules**: Expand the 50+ grammar rules with new patterns
- **Add Language Support**: Implement translations for more Indian languages
- **Improve Performance**: Optimize latency for faster interruptions
- **Bug Fixes**: Report and fix bugs
- **Documentation**: Improve guides and API documentation
- **Testing**: Add test cases and improve test coverage
- **UI/UX**: Enhance the frontend design and user experience

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top of this repository.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/vartalaap_V2.git
cd vartalaap_V2
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-marathi-translations`
- `fix/websocket-connection-issue`
- `docs/improve-api-documentation`

### 4. Make Your Changes

Follow the coding standards below.

### 5. Test Your Changes

Run tests to ensure everything works:

```bash
# Backend tests
cd backend
go test ./...
go run cmd/test_grammar/main.go

# Frontend tests
cd frontend
npm run lint
npm run build
```

### 6. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "Add Marathi language support for grammar explanations"
```

### 7. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 8. Create a Pull Request

Go to the original repository and create a Pull Request from your fork.

## 📝 Coding Standards

### Go (Backend)

- Follow [Effective Go](https://golang.org/doc/effective_go) guidelines
- Use `gofmt` for formatting
- Add comments for exported functions and types
- Keep functions small and focused
- Use meaningful variable names

Example:
```go
// DetectError checks text against all grammar rules and returns the first match
func DetectError(text string) (*GrammarRule, string) {
    // Implementation
}
```

### TypeScript/React (Frontend)

- Use TypeScript for type safety
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use functional components with hooks
- Use Tailwind CSS for styling
- Add proper type definitions

Example:
```typescript
interface VoiceOrbProps {
  isListening: boolean
  isSpeaking: boolean
}

export default function VoiceOrb({ isListening, isSpeaking }: VoiceOrbProps) {
  // Implementation
}
```

### Database

- Use descriptive table and column names
- Add indexes for frequently queried columns
- Include migration scripts in `supabase/migrations/`
- Document schema changes

## 🎨 Adding Grammar Rules

To add a new grammar rule:

1. Edit `backend/internal/rules/english.go`
2. Add your rule to the `GrammarRules` slice:

```go
{
    ID:          "YOUR_RULE_ID",
    Pattern:     regexp.MustCompile(`(?i)pattern`),
    ErrorType:   "Error Category",
    Description: "Clear description of the error",
    Correction:  func(s string) string { 
        return correctedText 
    },
}
```

3. Test your rule with `go run cmd/test_grammar/main.go`
4. Add test cases to verify it works correctly

## 🌏 Adding Language Support

To add support for a new Indian language:

1. Update `grammar_detector.go` translations map:

```go
translations := map[string]map[string]string{
    "YourLanguage": {
        "Use 'have' with 'I', not 'has'": "Translation here",
        // Add more translations
    },
}
```

2. Update the languages list in `cmd/server/main.go`
3. Update the frontend language selector in `app/practice/page.tsx`
4. Add sample translations to the README

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to recreate the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, browser, Go/Node version
6. **Logs**: Relevant error messages or logs

Use the GitHub issue template if available.

## 💡 Suggesting Features

When suggesting features:

1. Check if the feature already exists or is planned
2. Describe the use case and benefits
3. Provide examples or mockups if applicable
4. Consider implementation complexity

## 🔍 Code Review Process

All contributions go through code review:

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

## 📦 Pull Request Checklist

Before submitting:

- [ ] Code follows the style guidelines
- [ ] Tests pass successfully
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No merge conflicts
- [ ] PR description explains the changes

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the README

## 📧 Getting Help

Need help? Reach out:
- **GitHub Issues**: For bugs and features
- **Discussions**: For questions and ideas
- **Email**: support@vartalaap.ai

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Vartalaap AI 2.0! Together, we're helping millions learn English better. 🎉
