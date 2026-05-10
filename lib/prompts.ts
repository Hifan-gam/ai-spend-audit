import { type ToolInput } from './audit-engine'

export function generateAuditSummaryPrompt(
  tools: ToolInput[],
  totalCurrentSpend: number,
  totalMonthlySavings: number,
  totalYearlySavings: number
): string {
  const toolsList = tools.map(t => `${t.toolName} (${t.plan}): $${t.monthlySpend}/mo`).join(', ')
  
  return `You are an AI cost optimization expert. Generate a concise, personalized audit summary (100 words max) for a startup's AI spending.

Current situation:
- Tools: ${toolsList}
- Total monthly spend: $${totalCurrentSpend}
- Potential monthly savings: $${totalMonthlySavings}
- Potential yearly savings: $${totalYearlySavings}

Write a friendly, actionable summary that:
1. Acknowledges their current setup
2. Highlights the biggest savings opportunity
3. Provides one specific recommendation
4. Ends with encouragement

Tone: Professional but warm, data-driven, startup-friendly.
Format: Single paragraph, no bullet points.`
}

export async function generateAISummary(
  tools: ToolInput[],
  totalCurrentSpend: number,
  totalMonthlySavings: number,
  totalYearlySavings: number
): Promise<string> {
  const prompt = generateAuditSummaryPrompt(
    tools,
    totalCurrentSpend,
    totalMonthlySavings,
    totalYearlySavings
  )

  try {
    // Try Anthropic first
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 200,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.content[0].text
      }
    }

    // Fallback to OpenAI
    if (process.env.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          max_tokens: 200,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.choices[0].message.content
      }
    }

    // Fallback message
    return `Your team is spending $${totalCurrentSpend}/month on AI tools. We've identified $${totalMonthlySavings}/month in potential savings—that's $${totalYearlySavings}/year back in your budget. The biggest opportunity is optimizing your tool stack and eliminating redundant subscriptions. Start by reviewing your seat allocations and consolidating overlapping tools. Every dollar saved is a dollar you can invest in growth.`
  } catch (error) {
    console.error('AI summary generation failed:', error)
    return `Your team is spending $${totalCurrentSpend}/month on AI tools. We've identified $${totalMonthlySavings}/month in potential savings—that's $${totalYearlySavings}/year back in your budget. The biggest opportunity is optimizing your tool stack and eliminating redundant subscriptions.`
  }
}
