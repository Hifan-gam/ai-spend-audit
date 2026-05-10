import { PRICING_DATA, type UseCase } from './pricing-data'

export interface ToolInput {
  toolName: string
  plan: string
  monthlySpend: number
  seats: number
  teamSize: number
  useCase: UseCase
}

export interface Recommendation {
  type: 'downgrade' | 'upgrade' | 'alternative' | 'consolidate' | 'optimize'
  title: string
  description: string
  currentCost: number
  recommendedCost: number
  monthlySavings: number
  yearlySavings: number
  actionItems: string[]
}

export interface AuditResult {
  tool: ToolInput
  recommendations: Recommendation[]
  monthlySavings: number
  yearlySavings: number
}

export function auditTool(tool: ToolInput): AuditResult {
  const recommendations: Recommendation[] = []
  const pricing = PRICING_DATA[tool.toolName.toLowerCase().replace(/\s+/g, '-')]

  if (!pricing) {
    return {
      tool,
      recommendations: [],
      monthlySavings: 0,
      yearlySavings: 0,
    }
  }

  // Check for overspending on seats
  if (tool.seats > tool.teamSize * 1.5) {
    const excessSeats = tool.seats - tool.teamSize
    const costPerSeat = tool.monthlySpend / tool.seats
    const savings = excessSeats * costPerSeat

    recommendations.push({
      type: 'optimize',
      title: 'Reduce unused seats',
      description: `You're paying for ${tool.seats} seats but only have ${tool.teamSize} team members. Remove ${excessSeats} unused seats.`,
      currentCost: tool.monthlySpend,
      recommendedCost: tool.monthlySpend - savings,
      monthlySavings: savings,
      yearlySavings: savings * 12,
      actionItems: [
        'Review active users in your account',
        `Remove ${excessSeats} unused seats`,
        'Set up usage alerts',
      ],
    })
  }

  // Check for plan optimization
  const currentTier = pricing.tiers.find(t => 
    t.name.toLowerCase() === tool.plan.toLowerCase()
  )

  if (currentTier && tool.teamSize <= 3 && currentTier.monthlyPrice > 20) {
    const lowerTier = pricing.tiers.find(t => t.monthlyPrice < currentTier.monthlyPrice)
    
    if (lowerTier) {
      const savings = (currentTier.monthlyPrice - lowerTier.monthlyPrice) * tool.seats

      recommendations.push({
        type: 'downgrade',
        title: `Downgrade to ${lowerTier.name} plan`,
        description: `For a team of ${tool.teamSize}, the ${lowerTier.name} plan provides sufficient features at a lower cost.`,
        currentCost: tool.monthlySpend,
        recommendedCost: lowerTier.monthlyPrice * tool.seats,
        monthlySavings: savings,
        yearlySavings: savings * 12,
        actionItems: [
          `Switch to ${lowerTier.name} plan`,
          'Evaluate if current features are being used',
          'Monitor usage for 30 days',
        ],
      })
    }
  }

  // Check for alternatives
  if (pricing.alternatives && pricing.alternatives.length > 0) {
    const alternative = pricing.alternatives[0]
    const potentialSavings = (tool.monthlySpend - (alternative.monthlyPrice * tool.seats))

    if (potentialSavings > 0) {
      recommendations.push({
        type: 'alternative',
        title: `Consider switching to ${alternative.name}`,
        description: alternative.reason,
        currentCost: tool.monthlySpend,
        recommendedCost: alternative.monthlyPrice * tool.seats,
        monthlySavings: potentialSavings,
        yearlySavings: potentialSavings * 12,
        actionItems: [
          `Try ${alternative.name} free trial`,
          'Compare features with current tool',
          'Plan migration if suitable',
        ],
      })
    }
  }

  // API usage optimization
  if (tool.toolName.toLowerCase().includes('api') && tool.monthlySpend > 500) {
    const savings = tool.monthlySpend * 0.2 // 20% potential savings

    recommendations.push({
      type: 'optimize',
      title: 'Optimize API usage',
      description: 'High API costs detected. Implement caching, reduce token usage, and optimize prompts.',
      currentCost: tool.monthlySpend,
      recommendedCost: tool.monthlySpend - savings,
      monthlySavings: savings,
      yearlySavings: savings * 12,
      actionItems: [
        'Implement response caching',
        'Optimize prompt lengths',
        'Use cheaper models for simple tasks',
        'Set up usage monitoring',
      ],
    })
  }

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0)
  const totalYearlySavings = totalMonthlySavings * 12

  return {
    tool,
    recommendations,
    monthlySavings: totalMonthlySavings,
    yearlySavings: totalYearlySavings,
  }
}

export function auditAllTools(tools: ToolInput[]): {
  results: AuditResult[]
  totalMonthlySavings: number
  totalYearlySavings: number
  totalCurrentSpend: number
} {
  const results = tools.map(auditTool)
  const totalMonthlySavings = results.reduce((sum, r) => sum + r.monthlySavings, 0)
  const totalYearlySavings = results.reduce((sum, r) => sum + r.yearlySavings, 0)
  const totalCurrentSpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0)

  return {
    results,
    totalMonthlySavings,
    totalYearlySavings,
    totalCurrentSpend,
  }
}

export function detectConsolidationOpportunities(tools: ToolInput[]): Recommendation[] {
  const recommendations: Recommendation[] = []
  
  // Check for overlapping coding tools
  const codingTools = tools.filter(t => 
    ['cursor', 'github-copilot', 'windsurf'].includes(t.toolName.toLowerCase().replace(/\s+/g, '-'))
  )

  if (codingTools.length > 1) {
    const totalCost = codingTools.reduce((sum, t) => sum + t.monthlySpend, 0)
    const savings = totalCost * 0.4

    recommendations.push({
      type: 'consolidate',
      title: 'Consolidate coding assistants',
      description: `You're using ${codingTools.length} coding tools. Standardize on one to reduce costs and improve team consistency.`,
      currentCost: totalCost,
      recommendedCost: totalCost - savings,
      monthlySavings: savings,
      yearlySavings: savings * 12,
      actionItems: [
        'Survey team on preferred tool',
        'Run 2-week trial with single tool',
        'Cancel redundant subscriptions',
      ],
    })
  }

  // Check for overlapping chat tools
  const chatTools = tools.filter(t => 
    ['claude', 'chatgpt', 'gemini'].includes(t.toolName.toLowerCase().replace(/\s+/g, '-'))
  )

  if (chatTools.length > 2) {
    const totalCost = chatTools.reduce((sum, t) => sum + t.monthlySpend, 0)
    const savings = totalCost * 0.35

    recommendations.push({
      type: 'consolidate',
      title: 'Consolidate AI chat tools',
      description: `You're using ${chatTools.length} AI chat tools. Most teams only need 1-2 for different use cases.`,
      currentCost: totalCost,
      recommendedCost: totalCost - savings,
      monthlySavings: savings,
      yearlySavings: savings * 12,
      actionItems: [
        'Identify primary and secondary use cases',
        'Choose best tool for each use case',
        'Cancel redundant subscriptions',
      ],
    })
  }

  return recommendations
}
