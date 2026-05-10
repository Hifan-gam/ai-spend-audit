# AI Spend Audit

A production-ready web application that helps startups and engineering teams analyze their AI software spending and discover cost-saving opportunities.

## Features

- **AI Spend Analysis**: Analyze spending across 9+ AI tools including Cursor, GitHub Copilot, Claude, ChatGPT, and more
- **Smart Recommendations**: Rule-based audit engine that detects overspending, unused seats, and consolidation opportunities
- **AI-Powered Summaries**: Personalized audit summaries generated using Anthropic or OpenAI APIs
- **Lead Capture**: Email collection with transactional emails via Resend
- **Shareable Reports**: Public URLs with Open Graph metadata for social sharing
- **Modern UI**: Dark theme with glassmorphism effects, animations, and responsive design

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM, MySQL
- **Integrations**: Anthropic API, OpenAI API, Resend
- **Testing**: Vitest
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL database
- API keys (optional but recommended):
  - Anthropic API key or OpenAI API key
  - Resend API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-spend-audit
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
DATABASE_URL="mysql://user:password@localhost:3306/ai_spend_audit"
ANTHROPIC_API_KEY="your_key_here"
RESEND_API_KEY="your_key_here"
FROM_EMAIL="noreply@yourdomain.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npm run prisma:push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
ai-spend-audit/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── audit/             # Audit form page
│   ├── results/           # Results page
│   ├── share/             # Public share page
│   └── page.tsx           # Landing page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── audit-engine.ts   # Core audit logic
│   ├── pricing-data.ts   # Tool pricing database
│   ├── prompts.ts        # AI prompt templates
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
└── __tests__/            # Test files
```

## Testing

Run tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Setup

For production, use a managed MySQL service:
- Railway

Update `DATABASE_URL` in your production environment variables.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI summaries | No* |
| `OPENAI_API_KEY` | OpenAI API key for AI summaries | No* |
| `RESEND_API_KEY` | Resend API key for emails | No |
| `FROM_EMAIL` | Sender email address | No |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |

*At least one AI API key is recommended for personalized summaries

## Features in Detail

### Audit Engine

The audit engine analyzes AI tool spending and provides recommendations:

- **Seat Optimization**: Detects unused seats
- **Plan Recommendations**: Suggests downgrades for small teams
- **Alternative Tools**: Recommends cheaper alternatives
- **API Optimization**: Identifies high API costs
- **Consolidation**: Detects overlapping tool subscriptions

### Lead Capture

After viewing results, users can:
- Enter email to receive full report
- Get shareable public URL
- Receive transactional email (if configured)

### Sharing

Each audit gets a unique share URL with:
- Public-safe data only
- Open Graph metadata
- Twitter card support
- SEO-friendly routing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue on GitHub.
