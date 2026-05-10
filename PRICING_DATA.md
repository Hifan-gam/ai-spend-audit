# Pricing Data Documentation

This document details the pricing information for all supported AI tools in the audit system.

## Supported Tools

### 1. Cursor

**Description**: AI-powered code editor with advanced completions

**Pricing Tiers**:
- **Free**: $0/month
  - Basic completions
  - 2000 completions/month
  
- **Pro**: $20/month
  - Unlimited completions
  - GPT-4 access
  - Priority support
  
- **Business**: $40/month
  - Team features
  - Admin controls
  - SSO support

**Alternatives**:
- GitHub Copilot ($10/month) - More affordable for basic coding assistance

---

### 2. GitHub Copilot

**Description**: AI pair programmer from GitHub

**Pricing Tiers**:
- **Individual**: $10/month
  - Code completions
  - Chat interface
  - CLI support
  
- **Business**: $19/month
  - Team management
  - Policy controls
  - IP indemnity
  
- **Enterprise**: $39/month
  - Advanced security
  - Audit logs
  - Model fine-tuning

---

### 3. Claude

**Description**: Anthropic's AI assistant

**Pricing Tiers**:
- **Free**: $0/month
  - Limited usage
  - Claude 3.5 Sonnet access
  
- **Pro**: $20/month
  - 5x usage limits
  - Priority access
  - Early feature access
  
- **Team**: $30/month
  - Team workspace
  - Admin controls
  - Higher usage limits

---

### 4. ChatGPT

**Description**: OpenAI's conversational AI

**Pricing Tiers**:
- **Free**: $0/month
  - GPT-3.5 access
  - Limited GPT-4 access
  
- **Plus**: $20/month
  - Full GPT-4 access
  - DALL-E integration
  - Advanced tools
  
- **Team**: $30/month per user
  - Team workspace
  - Admin console
  - Higher usage limits

---

### 5. Anthropic API

**Description**: API access to Claude models

**Pricing Tiers**:
- **Pay-as-you-go**: Variable
  - $15 per 1M input tokens
  - $75 per 1M output tokens
  - No monthly minimum

**Usage Patterns**:
- Light: ~$50-200/month
- Medium: ~$200-500/month
- Heavy: $500+/month

---

### 6. OpenAI API

**Description**: API access to GPT models

**Pricing Tiers**:
- **Pay-as-you-go**: Variable
  - $10 per 1M input tokens (GPT-4)
  - $30 per 1M output tokens (GPT-4)
  - No monthly minimum

**Usage Patterns**:
- Light: ~$30-150/month
- Medium: ~$150-400/month
- Heavy: $400+/month

---

### 7. Gemini

**Description**: Google's AI model

**Pricing Tiers**:
- **Free**: $0/month
  - 60 requests per minute
  - Gemini Pro access
  
- **Advanced**: $20/month
  - Gemini Ultra access
  - Priority access
  - 2M token context window

---

### 8. Windsurf

**Description**: AI-powered development tool

**Pricing Tiers**:
- **Free**: $0/month
  - Basic features
  - Limited usage
  
- **Pro**: $15/month
  - Advanced AI features
  - Unlimited usage
  - Priority support

---

### 9. v0

**Description**: Vercel's AI design tool

**Pricing Tiers**:
- **Free**: $0/month
  - 200 credits per month
  - Basic generation
  
- **Premium**: $20/month
  - 5000 credits per month
  - Priority generation
  - Advanced features

---

## Pricing Strategy Notes

### Seat-Based Pricing
Tools like Cursor, GitHub Copilot, and ChatGPT charge per user/seat:
- Unused seats are common waste
- Team size vs seat count is key metric
- Recommend removing seats when usage < 80%

### Usage-Based Pricing
API services (Anthropic, OpenAI) charge per token:
- High variability month-to-month
- Optimization opportunities:
  - Caching responses
  - Shorter prompts
  - Cheaper models for simple tasks
  - Rate limiting

### Tier Optimization
Many tools have multiple tiers:
- Small teams often overpay for enterprise features
- Free tiers sufficient for light usage
- Pro/Plus tiers best value for individuals
- Business/Team tiers for 5+ users

## Common Savings Opportunities

### 1. Unused Seats (20-40% savings)
- Teams pay for seats not actively used
- Seasonal contractors counted as full seats
- Forgotten team members

### 2. Over-Tiered Plans (15-30% savings)
- Small teams on enterprise plans
- Features not being used
- Can downgrade without impact

### 3. Overlapping Tools (30-50% savings)
- Multiple coding assistants
- Multiple chat AI tools
- Consolidation reduces costs

### 4. API Optimization (15-25% savings)
- No caching implemented
- Inefficient prompts
- Using expensive models for simple tasks

### 5. Annual vs Monthly (15-20% savings)
- Most tools offer annual discounts
- 2-3 months free with annual
- Better for stable teams

## Pricing Update Schedule

Pricing data should be reviewed:
- **Monthly**: Check for new tools
- **Quarterly**: Verify existing pricing
- **Annually**: Major pricing review

## Data Sources

Pricing information sourced from:
- Official vendor websites
- Public pricing pages
- Vendor documentation
- Community reports

Last updated: May 2026

## Adding New Tools

To add a new tool to the pricing database:

1. Research official pricing
2. Identify all tiers
3. Note key features per tier
4. Find alternatives if applicable
5. Update `lib/pricing-data.ts`
6. Add to this documentation
7. Update audit engine logic if needed

## Pricing Assumptions

### Seat Calculations
- 1 seat = 1 active user
- Team size = actual team members
- Excess = seats - team size
- Threshold = 1.5x team size

### Savings Calculations
- Conservative estimates
- Based on actual pricing
- Excludes migration costs
- Assumes full implementation

### Alternative Recommendations
- Only suggest proven alternatives
- Similar feature sets
- Established vendors
- Active development
