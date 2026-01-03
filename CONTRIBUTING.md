# Contributing to Vartalaap AI 2.0

Thank you for your interest in contributing to Vartalaap AI! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive criticism
- Maintain a harassment-free environment

## Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yuvraj707sharma/vartalaap_V2.git
   cd vartalaap_V2
   ```

2. **Install Dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Setup Environment**
   ```bash
   cp .env.example .env
   # Add your API keys to .env
   ```

4. **Run Development Servers**
   ```bash
   # Backend (terminal 1)
   cd backend
   npm run dev
   
   # Frontend (terminal 2)
   cd frontend
   npm run dev
   ```

## Development Guidelines

### Code Style

**TypeScript**
- Use TypeScript for all new code
- Properly type all functions and variables
- Avoid `any` type when possible
- Use interfaces for complex types

**React/Next.js**
- Use functional components with hooks
- Prefer `const` over `let`
- Use meaningful component and variable names
- Keep components focused and reusable

**File Structure**
- One component per file
- Use index files for clean exports
- Group related files together
- Follow the existing folder structure

### Naming Conventions

- **Components**: PascalCase (e.g., `VoiceOrb.tsx`)
- **Functions**: camelCase (e.g., `detectError()`)
- **Files**: kebab-case for utilities (e.g., `error-detector.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_DURATION`)

### Git Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make Changes**
   - Write clean, documented code
   - Follow existing patterns
   - Add comments for complex logic

3. **Commit Messages**
   ```bash
   # Format: <type>: <description>
   
   feat: add filler word detection
   fix: resolve WebSocket connection issue
   docs: update API documentation
   style: format code with prettier
   refactor: simplify error detection logic
   test: add tests for grammar rules
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Create a Pull Request on GitHub
   - Describe your changes clearly
   - Link related issues

## Areas for Contribution

### High Priority

1. **Grammar Rules**
   - Add more grammar detection rules
   - Improve existing rule accuracy
   - Add language-specific rules

2. **UI/UX Improvements**
   - Enhance voice orb animations
   - Improve mobile responsiveness
   - Add accessibility features
   - Create better error displays

3. **Performance**
   - Optimize LLM API calls
   - Reduce latency in error detection
   - Improve audio processing
   - Add caching mechanisms

4. **Testing**
   - Write unit tests for grammar rules
   - Add integration tests for WebSocket
   - Test edge cases
   - Add E2E tests

### Medium Priority

5. **Features**
   - Add more interview domains
   - Implement progress tracking
   - Add pronunciation feedback
   - Create practice exercises

6. **Documentation**
   - Improve code comments
   - Add more examples
   - Create video tutorials
   - Translate documentation

7. **Backend**
   - Add Redis caching
   - Implement rate limiting
   - Add analytics tracking
   - Improve session management

### Low Priority

8. **Nice to Have**
   - Add more native languages
   - Create Chrome extension
   - Add PDF report generation
   - Implement gamification

## Testing

### Running Tests
```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
npm test
```

### Writing Tests

**Grammar Rules Test Example:**
```typescript
describe('Grammar Rules', () => {
  it('should detect subject-verb agreement error', () => {
    const result = detectGrammarError('I has a car');
    expect(result.hasError).toBe(true);
    expect(result.rule?.type).toBe('subject-verb');
  });
});
```

**Component Test Example:**
```typescript
describe('VoiceOrb', () => {
  it('should render active state', () => {
    render(<VoiceOrb isActive={true} />);
    // Add assertions
  });
});
```

## Adding Grammar Rules

1. **Open `backend/src/rules/english.ts`**

2. **Add Your Rule**
   ```typescript
   {
     pattern: /\byour\s+pattern\b/gi,
     correction: "correct form",
     type: "error-type",
     explanation_hi: "Hindi explanation"
   }
   ```

3. **Test the Rule**
   - Add test cases
   - Verify it doesn't conflict with existing rules
   - Check performance impact

4. **Document the Rule**
   - Add comments explaining the pattern
   - Include examples in documentation

## Adding New Features

1. **Discuss First**
   - Open an issue to discuss the feature
   - Get feedback from maintainers
   - Ensure it aligns with project goals

2. **Plan Implementation**
   - Break down into smaller tasks
   - Consider impact on existing features
   - Plan for testing

3. **Implement**
   - Follow coding guidelines
   - Write tests
   - Update documentation

4. **Submit PR**
   - Reference the issue
   - Describe implementation details
   - Add screenshots/demos if relevant

## Adding New Interview Domains

1. **Create System Prompt**
   - Add to `backend/src/prompts/index.ts`
   - Define domain-specific questions
   - Include relevant topics

2. **Update Types**
   - Add domain to `Domain` type
   - Update frontend selectors

3. **Add UI**
   - Update interview page
   - Add domain card with description
   - Include sample topics

## Adding New Languages

1. **Update Grammar Rules**
   - Add `explanation_[lang]` to existing rules
   - Example: `explanation_ta` for Tamil

2. **Update Types**
   - Add language to `Language` type

3. **Update System Prompts**
   - Add language support in prompts
   - Update LLM instructions

4. **Update UI**
   - Add language to selectors
   - Test translations

## Bug Reports

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (browser, OS, etc.)

## Feature Requests

When requesting features:
- Describe the feature clearly
- Explain the use case
- Provide examples if possible
- Consider implementation complexity

## Review Process

1. **Automated Checks**
   - TypeScript compilation
   - Linting
   - Tests must pass

2. **Code Review**
   - Maintainers will review your code
   - Address feedback promptly
   - Be open to suggestions

3. **Approval**
   - At least one maintainer approval required
   - All checks must pass
   - Documentation must be updated

## Questions?

- Open an issue for questions
- Join discussions
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Vartalaap AI! 🎉
