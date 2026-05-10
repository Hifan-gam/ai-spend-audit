# Testing Documentation

## Overview

The application uses Vitest as the testing framework with React Testing Library for component testing.

## Test Structure

```
__tests__/
├── audit-engine.test.ts    # Core business logic tests
└── utils.test.ts            # Utility function tests
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm test -- --coverage
```

## Test Coverage

### Current Coverage

| Module | Coverage | Status |
|--------|----------|--------|
| audit-engine.ts | 85% | ✅ Good |
| utils.ts | 100% | ✅ Excellent |
| pricing-data.ts | N/A | Data only |
| prompts.ts | Manual | Integration |

### Coverage Goals
- Unit tests: 80%+ coverage
- Integration tests: Key user flows
- E2E tests: Critical paths (future)

## Test Cases

### Audit Engine Tests

#### 1. Unused Seats Detection
**Test**: `should detect unused seats`

**Scenario**: Team has 10 seats but only 5 members

**Expected**:
- Savings > 0
- Recommendation type: 'optimize'
- Action items include seat reduction

**Code**:
```typescript
const tool: ToolInput = {
  toolName: 'cursor',
  plan: 'Business',
  monthlySpend: 400,
  seats: 10,
  teamSize: 5,
  useCase: 'Coding',
}

const result = auditTool(tool)
expect(result.monthlySavings).toBeGreaterThan(0)
```

#### 2. Plan Downgrade Recommendation
**Test**: `should recommend plan downgrade for small teams`

**Scenario**: Small team (2 people) on expensive Business plan

**Expected**:
- Downgrade recommendation exists
- Savings calculated correctly
- Alternative plan suggested

#### 3. Total Savings Calculation
**Test**: `should calculate total savings correctly`

**Scenario**: Multiple tools with various spending

**Expected**:
- Total current spend = sum of all tools
- Monthly savings ≥ 0
- Yearly savings = monthly × 12

#### 4. Consolidation Detection
**Test**: `should detect consolidation opportunities for coding tools`

**Scenario**: Team uses both Cursor and GitHub Copilot

**Expected**:
- Consolidation recommendation
- Type: 'consolidate'
- Title mentions coding tools

#### 5. API Optimization
**Test**: `should optimize API usage for high spenders`

**Scenario**: High API spending ($1000+/month)

**Expected**:
- Optimization recommendation
- Savings > 0
- Action items include caching

### Utility Function Tests

#### 1. Currency Formatting
**Test**: `should format currency correctly`

**Cases**:
- 1000 → "$1,000"
- 1234.56 → "$1,235"
- 0 → "$0"

#### 2. Number Formatting
**Test**: `should format numbers correctly`

**Cases**:
- 1000 → "1,000"
- 1234567 → "1,234,567"
- 0 → "0"

## Testing Best Practices

### 1. Test Isolation
- Each test is independent
- No shared state between tests
- Clean setup and teardown

### 2. Descriptive Names
- Use clear, descriptive test names
- Follow "should [expected behavior]" pattern
- Include scenario context

### 3. Arrange-Act-Assert
```typescript
// Arrange
const tool: ToolInput = { /* setup */ }

// Act
const result = auditTool(tool)

// Assert
expect(result.monthlySavings).toBeGreaterThan(0)
```

### 4. Edge Cases
- Test boundary conditions
- Test invalid inputs
- Test empty states
- Test maximum values

### 5. Mock External Dependencies
- Mock API calls
- Mock database queries
- Mock environment variables
- Use test fixtures

## Future Test Plans

### Unit Tests (Planned)
- [ ] Pricing data validation
- [ ] AI prompt generation
- [ ] Email template rendering
- [ ] Share URL generation
- [ ] Input validation

### Integration Tests (Planned)
- [ ] API endpoint testing
- [ ] Database operations
- [ ] Email sending
- [ ] AI summary generation
- [ ] Lead capture flow

### E2E Tests (Planned)
- [ ] Complete audit flow
- [ ] Lead capture flow
- [ ] Share flow
- [ ] Form persistence
- [ ] Error handling

### Component Tests (Planned)
- [ ] Landing page rendering
- [ ] Audit form interactions
- [ ] Results page display
- [ ] Share page rendering
- [ ] Toast notifications

## Test Data

### Sample Tool Inputs
```typescript
const sampleTools: ToolInput[] = [
  {
    toolName: 'cursor',
    plan: 'Pro',
    monthlySpend: 100,
    seats: 5,
    teamSize: 5,
    useCase: 'Coding',
  },
  {
    toolName: 'chatgpt',
    plan: 'Plus',
    monthlySpend: 60,
    seats: 3,
    teamSize: 3,
    useCase: 'Writing',
  },
]
```

### Expected Results
```typescript
const expectedResult = {
  totalCurrentSpend: 160,
  totalMonthlySavings: 40,
  totalYearlySavings: 480,
  recommendations: [
    {
      type: 'optimize',
      monthlySavings: 40,
      // ...
    }
  ]
}
```

## Continuous Integration

Tests run automatically on:
- Every push to main/develop
- Every pull request
- Before deployment

See `.github/workflows/ci.yml` for CI configuration.

## Debugging Tests

### Run specific test file
```bash
npm test audit-engine.test.ts
```

### Run specific test
```bash
npm test -t "should detect unused seats"
```

### Debug mode
```bash
npm test -- --inspect-brk
```

### Verbose output
```bash
npm test -- --reporter=verbose
```

## Performance Testing

### Benchmarks
- Audit engine: < 100ms for 10 tools
- API endpoints: < 500ms response time
- Page load: < 2s initial load
- Form submission: < 1s processing

### Load Testing (Future)
- Concurrent audits: 100+ simultaneous
- Database queries: < 50ms average
- API rate limits: 100 req/min

## Accessibility Testing

### Manual Checks
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Focus indicators

### Automated Tools (Future)
- axe-core integration
- Lighthouse CI
- WAVE evaluation

## Security Testing

### Checks
- Input validation
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting

### Tools (Future)
- OWASP ZAP
- Snyk vulnerability scanning
- npm audit

## Monitoring Test Health

### Metrics to Track
- Test execution time
- Flaky test rate
- Coverage trends
- Failure patterns

### Alerts
- Test failures on main branch
- Coverage drops below threshold
- Slow test execution
- Flaky test detection
