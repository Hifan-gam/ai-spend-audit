# AI Prompts Documentation

This document details all AI prompts used in the application for generating personalized audit summaries.

## Overview

The application uses AI (Anthropic Claude or OpenAI GPT-4) to generate personalized audit summaries. The prompts are designed to be:
- Concise (100 words max)
- Data-driven
- Actionable
- Startup-friendly
- Professional but warm

## Primary Prompt Template

### Audit Summary Prompt

**Location**: `lib/prompts.ts` → `generateAuditSummaryPrompt()`

**Purpose**: Generate a personalized summary of the user's AI spending audit

**Template**:
```
You are an AI cost optimization expert. Generate a concise, personalized audit summary (100 words max) for a startup's AI spending.

Current situation:
- Tools: {toolsList}
- Total monthly spend: ${totalCurrentSpend}
- Potential monthly savings: ${totalMonthlySavings}
- Potential yearly savings: ${totalYearlySavings}

Write a friendly, actionable summary that:
1. Acknowledges their current setup
2. Highlights the biggest savings opportunity
3. Provides one specific recommendation
4. Ends with encouragement

Tone: Professional but warm, data-driven, startup-friendly.
Format: Single paragraph, no bullet points.
```

**Variables**:
- `toolsList`: Comma-separated list of tools with plans and costs
- `totalCurrentSpend`: Total monthly spending across all tools
- `totalMonthlySavings`: Potential monthly savings identified
- `totalYearlySavings`: Potential yearly savings (monthly × 12)

**Example Input**:
```
Tools: Cursor (Pro): $100/mo, ChatGPT (Plus): $60/mo, GitHub Copilot (Business): $95/mo
Total monthly spend: $255
Potential monthly savings: $85
Potential yearly savings: $1020
```

**Example Output**:
```
Your team is spending $255/month across three AI tools—Cursor, ChatGPT, and GitHub Copilot. We've identified $85/month in potential savings, which adds up to $1,020/year. The biggest opportunity is consolidating your coding assistants. You're using both Cursor and GitHub Copilot for similar tasks, which creates redundancy. Pick the one your team prefers and cancel the other. You're also paying for more seats than you have team members. Every dollar saved is a dollar you can invest in growth.
```

## API Integration

### Anthropic Claude

**Model**: `claude-3-5-sonnet-20241022`

**Configuration**:
```typescript
{
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 200,
  messages: [{ role: 'user', content: prompt }]
}
```

**Endpoint**: `https://api.anthropic.com/v1/messages`

**Headers**:
- `Content-Type: application/json`
- `x-api-key: {ANTHROPIC_API_KEY}`
- `anthropic-version: 2023-06-01`

### OpenAI GPT-4

**Model**: `gpt-4`

**Configuration**:
```typescript
{
  model: 'gpt-4',
  max_tokens: 200,
  messages: [{ role: 'user', content: prompt }]
}
```

**Endpoint**: `https://api.openai.com/v1/chat/completions`

**Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer {OPENAI_API_KEY}`

## Fallback Strategy

If AI generation fails (API error, missing keys, timeout), the system uses a static fallback:

```typescript
`Your team is spending $${totalCurrentSpend}/month on AI tools. We've identified $${totalMonthlySavings}/month in potential savings—that's $${totalYearlySavings}/year back in your budget. The biggest opportunity is optimizing your tool stack and eliminating redundant subscriptions. Start by reviewing your seat allocations and consolidating overlapping tools. Every dollar saved is a dollar you can invest in growth.`
```

## Prompt Engineering Principles

### 1. Role Definition
- "You are an AI cost optimization expert"
- Establishes expertise and authority
- Sets context for response style

### 2. Constraint Specification
- "100 words max"
- Ensures concise output
- Prevents verbose responses

### 3. Data Context
- Provides specific numbers
- Lists actual tools
- Shows real savings potential

### 4. Structure Requirements
- Numbered list of requirements
- Clear expectations
- Consistent output format

### 5. Tone Guidance
- "Professional but warm"
- "Data-driven"
- "Startup-friendly"
- Ensures appropriate voice

### 6. Format Specification
- "Single paragraph"
- "No bullet points"
- Ensures consistent formatting

## Response Quality Criteria

Good responses should:
- ✅ Be 80-120 words
- ✅ Include specific dollar amounts
- ✅ Mention actual tools used
- ✅ Provide actionable advice
- ✅ End with encouragement
- ✅ Use professional but friendly tone

Bad responses to avoid:
- ❌ Generic advice
- ❌ Overly technical jargon
- ❌ Bullet point lists
- ❌ Vague recommendations
- ❌ Negative or discouraging tone

## Testing Prompts

### Test Case 1: Single Tool
```
Tools: Cursor (Business): $400/mo
Spend: $400
Savings: $160
```

Expected: Focus on seat optimization or plan downgrade

### Test Case 2: Multiple Overlapping Tools
```
Tools: Cursor (Pro): $100/mo, GitHub Copilot (Business): $95/mo
Spend: $195
Savings: $78
```

Expected: Emphasize consolidation opportunity

### Test Case 3: High API Usage
```
Tools: Anthropic API: $1200/mo
Spend: $1200
Savings: $240
```

Expected: Suggest API optimization strategies

## Prompt Versioning

### Version 1.0 (Current)
- Initial implementation
- 100-word limit
- Single paragraph format
- Four-point structure

### Future Improvements
- A/B test different tones
- Experiment with word limits
- Add industry-specific variants
- Personalize based on use case

## Monitoring & Analytics

Track these metrics:
- AI generation success rate
- Fallback usage frequency
- Average response length
- User engagement with summaries
- Conversion impact

## Cost Optimization

### Token Usage
- Average prompt: ~150 tokens
- Average response: ~120 tokens
- Total per audit: ~270 tokens
- Cost per audit: ~$0.01

### Optimization Strategies
- Cache common responses
- Batch requests if possible
- Use cheaper models for testing
- Implement rate limiting

## Error Handling

### API Errors
```typescript
try {
  // API call
} catch (error) {
  console.error('AI summary generation failed:', error)
  return fallbackMessage
}
```

### Timeout Handling
- 10-second timeout recommended
- Graceful degradation to fallback
- Log failures for monitoring

### Rate Limiting
- Implement exponential backoff
- Queue requests if needed
- Show loading state to users

## Security Considerations

### API Key Protection
- Never expose keys to client
- Use environment variables
- Rotate keys regularly
- Monitor usage for anomalies

### Input Sanitization
- Validate tool names
- Check numeric ranges
- Prevent prompt injection
- Limit input length

### Output Validation
- Check response length
- Verify format
- Filter inappropriate content
- Log suspicious outputs

## Future Prompt Ideas

### Personalized by Role
- CTO: Focus on technical decisions
- CFO: Emphasize financial impact
- Engineer: Highlight productivity gains

### Personalized by Team Size
- Solo: Individual optimization
- Small team (2-10): Team efficiency
- Large team (10+): Enterprise savings

### Personalized by Industry
- SaaS: Development tool focus
- Agency: Client work optimization
- Enterprise: Compliance and security

### Seasonal Variations
- End of quarter: Budget planning
- New year: Annual review
- Mid-year: Course correction
