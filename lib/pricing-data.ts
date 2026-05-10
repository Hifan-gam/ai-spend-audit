export interface PricingTier {
  name: string
  monthlyPrice: number
  seats?: number
  features: string[]
}

export interface ToolPricing {
  name: string
  tiers: PricingTier[]
  alternatives?: {
    name: string
    monthlyPrice: number
    reason: string
  }[]
}

export const PRICING_DATA: Record<string, ToolPricing> = {
  cursor: {
    name: 'Cursor',
    tiers: [
      { name: 'Free', monthlyPrice: 0, features: ['Basic completions', '2000 completions/month'] },
      { name: 'Pro', monthlyPrice: 20, features: ['Unlimited completions', 'GPT-4', 'Priority support'] },
      { name: 'Business', monthlyPrice: 40, features: ['Team features', 'Admin controls', 'SSO'] },
    ],
    alternatives: [
      { name: 'GitHub Copilot', monthlyPrice: 10, reason: 'More affordable for basic coding assistance' },
    ],
  },
  'github-copilot': {
    name: 'GitHub Copilot',
    tiers: [
      { name: 'Individual', monthlyPrice: 10, features: ['Code completions', 'Chat', 'CLI'] },
      { name: 'Business', monthlyPrice: 19, features: ['Team management', 'Policy controls', 'IP indemnity'] },
      { name: 'Enterprise', monthlyPrice: 39, features: ['Advanced security', 'Audit logs', 'Fine-tuning'] },
    ],
  },
  claude: {
    name: 'Claude',
    tiers: [
      { name: 'Free', monthlyPrice: 0, features: ['Limited usage', 'Claude 3.5 Sonnet'] },
      { name: 'Pro', monthlyPrice: 20, features: ['5x usage', 'Priority access', 'Early features'] },
      { name: 'Team', monthlyPrice: 30, features: ['Team workspace', 'Admin controls', 'Higher limits'] },
    ],
  },
  chatgpt: {
    name: 'ChatGPT',
    tiers: [
      { name: 'Free', monthlyPrice: 0, features: ['GPT-3.5', 'Limited GPT-4'] },
      { name: 'Plus', monthlyPrice: 20, features: ['GPT-4', 'DALL-E', 'Advanced tools'] },
      { name: 'Team', monthlyPrice: 30, features: ['Team workspace', 'Admin console', 'Higher limits'] },
    ],
  },
  'anthropic-api': {
    name: 'Anthropic API',
    tiers: [
      { name: 'Pay-as-you-go', monthlyPrice: 0, features: ['$15/1M input tokens', '$75/1M output tokens'] },
    ],
  },
  'openai-api': {
    name: 'OpenAI API',
    tiers: [
      { name: 'Pay-as-you-go', monthlyPrice: 0, features: ['$10/1M input tokens', '$30/1M output tokens'] },
    ],
  },
  gemini: {
    name: 'Gemini',
    tiers: [
      { name: 'Free', monthlyPrice: 0, features: ['60 requests/min', 'Gemini Pro'] },
      { name: 'Advanced', monthlyPrice: 20, features: ['Gemini Ultra', 'Priority access', '2M context'] },
    ],
  },
  windsurf: {
    name: 'Windsurf',
    tiers: [
      { name: 'Free', monthlyPrice: 0, features: ['Basic features'] },
      { name: 'Pro', monthlyPrice: 15, features: ['Advanced AI', 'Unlimited usage'] },
    ],
  },
  v0: {
    name: 'v0',
    tiers: [
      { name: 'Free', monthlyPrice: 0, features: ['200 credits/month'] },
      { name: 'Premium', monthlyPrice: 20, features: ['5000 credits/month', 'Priority generation'] },
    ],
  },
}

export const USE_CASES = [
  'Coding',
  'Writing',
  'Research',
  'Data Analysis',
  'Mixed',
] as const

export type UseCase = typeof USE_CASES[number]
