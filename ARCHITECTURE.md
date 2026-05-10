# Architecture Documentation

## System Overview

AI Spend Audit is a full-stack Next.js application built with the App Router pattern. The architecture follows a modern serverless approach optimized for Vercel deployment.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Landing    │  │  Audit Form  │  │   Results    │     │
│  │     Page     │  │     Page     │  │     Page     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ POST /audit  │  │ POST /lead   │  │ GET /share   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Audit Engine │  │  AI Prompts  │  │ Lead Capture │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │ Anthropic/   │  │    Resend    │     │
│  │   Database   │  │   OpenAI     │  │    Email     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### Frontend Layer

#### Pages
- **Landing Page** (`app/page.tsx`): Marketing page with hero, features, testimonials, and CTA
- **Audit Form** (`app/audit/page.tsx`): Multi-tool input form with localStorage persistence
- **Results Page** (`app/results/[id]/page.tsx`): Private audit results with lead capture
- **Share Page** (`app/share/[shareId]/page.tsx`): Public audit results

#### UI Components
- Built with shadcn/ui for consistency
- Framer Motion for animations
- Tailwind CSS for styling
- Dark theme with glassmorphism effects

### API Layer

#### Endpoints

**POST /api/audit**
- Accepts array of tool inputs
- Runs audit engine
- Generates AI summary
- Saves to database
- Returns audit ID and share ID

**POST /api/lead**
- Captures user information
- Updates audit record
- Sends confirmation email
- Makes audit public
- Returns share URL

**GET /api/audit/[id]**
- Fetches full audit data
- Used by results page
- Includes sensitive data

**GET /api/share/[shareId]**
- Fetches public audit data
- Excludes sensitive information
- Requires isPublic flag

### Business Logic Layer

#### Audit Engine (`lib/audit-engine.ts`)

The core recommendation engine with multiple strategies:

1. **Seat Optimization**
   - Detects seats > teamSize * 1.5
   - Calculates per-seat cost
   - Recommends seat reduction

2. **Plan Optimization**
   - Checks team size vs plan tier
   - Suggests downgrades for small teams
   - Compares feature usage

3. **Alternative Tools**
   - Suggests cheaper alternatives
   - Provides migration reasoning
   - Calculates potential savings

4. **API Optimization**
   - Detects high API spending (>$500/mo)
   - Suggests caching and optimization
   - Estimates 20% savings potential

5. **Consolidation Detection**
   - Identifies overlapping tools
   - Groups by category (coding, chat)
   - Recommends standardization

#### Pricing Data (`lib/pricing-data.ts`)

Structured pricing database:
```typescript
{
  toolName: {
    name: string
    tiers: PricingTier[]
    alternatives?: Alternative[]
  }
}
```

Supports 9+ tools with multiple pricing tiers.

#### AI Prompts (`lib/prompts.ts`)

Generates personalized summaries using:
- Tool list and spending
- Savings calculations
- Structured prompt template
- Fallback to static message

### Data Layer

#### Database Schema

```prisma
model Audit {
  id                  String   @id @default(cuid())
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  // User info
  email               String?
  companyName         String?
  role                String?
  teamSize            String?
  
  // Audit data
  tools               Json
  totalMonthlySpend   Float
  totalMonthlySavings Float
  totalYearlySavings  Float
  recommendations     Json
  aiSummary           String?
  
  // Sharing
  shareId             String   @unique @default(cuid())
  isPublic            Boolean  @default(false)
}
```

#### Indexes
- `shareId`: Fast lookup for public shares
- `email`: Lead tracking and analytics

## Data Flow

### Audit Creation Flow

1. User fills out form → localStorage persistence
2. Submit → POST /api/audit
3. Validate input
4. Run audit engine → recommendations
5. Generate AI summary (async)
6. Save to database
7. Return audit ID
8. Redirect to results page

### Lead Capture Flow

1. User views results
2. Enters email → POST /api/lead
3. Validate email format
4. Update audit record
5. Set isPublic = true
6. Send email (if configured)
7. Return share URL
8. Show success message

### Share Flow

1. User shares URL
2. GET /api/share/[shareId]
3. Check isPublic flag
4. Return sanitized data
5. Render public page
6. Show CTA for own audit

## Security Considerations

### Data Privacy
- Sensitive data excluded from share endpoints
- Email validation and sanitization
- No PII in public URLs
- Rate limiting recommended for production

### API Security
- Environment variables for secrets
- API keys never exposed to client
- CORS configured for same-origin
- Input validation on all endpoints

### Database Security
- Parameterized queries via Prisma
- No raw SQL
- Connection pooling
- SSL in production

## Performance Optimizations

### Frontend
- Code splitting via Next.js
- Image optimization
- Lazy loading for animations
- localStorage for form persistence

### Backend
- Serverless functions
- Database connection pooling
- Async AI generation
- Efficient queries with Prisma

### Caching Strategy
- Static pages cached at edge
- API responses cacheable
- Database query optimization
- CDN for assets

## Scalability

### Horizontal Scaling
- Stateless API design
- Serverless architecture
- Database connection pooling
- CDN distribution

### Vertical Scaling
- Efficient algorithms
- Minimal database queries
- Optimized bundle size
- Progressive enhancement

## Monitoring & Observability

### Recommended Tools
- Vercel Analytics for performance
- Sentry for error tracking
- PostHog for product analytics
- Database monitoring via provider

### Key Metrics
- Audit completion rate
- Lead capture rate
- Share click-through rate
- API response times
- Error rates

## Deployment Architecture

### Vercel Deployment
```
┌─────────────────────────────────────────┐
│           Vercel Edge Network           │
│  ┌─────────────────────────────────┐   │
│  │      Static Assets (CDN)        │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │   Serverless Functions (API)    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        External Services                │
│  - PostgreSQL (Vercel/Supabase)        │
│  - Anthropic/OpenAI API                │
│  - Resend Email                        │
└─────────────────────────────────────────┘
```

### Environment Configuration
- Development: Local PostgreSQL
- Staging: Vercel Preview + Test DB
- Production: Vercel Production + Managed DB

## Future Enhancements

### Planned Features
- PDF report generation
- Benchmark comparisons
- Team collaboration
- Usage analytics dashboard
- Webhook integrations

### Technical Improvements
- Redis caching layer
- Background job processing
- Real-time updates
- Advanced analytics
- A/B testing framework
