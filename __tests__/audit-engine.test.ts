import { describe, it, expect } from 'vitest'
import { auditTool, auditAllTools, detectConsolidationOpportunities } from '../lib/audit-engine'
import type { ToolInput } from '../lib/audit-engine'

describe('Audit Engine', () => {
  it('should detect unused seats', () => {
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
    expect(result.recommendations.length).toBeGreaterThan(0)
    expect(result.recommendations[0].type).toBe('optimize')
  })

  it('should recommend plan downgrade for small teams', () => {
    const tool: ToolInput = {
      toolName: 'cursor',
      plan: 'Business',
      monthlySpend: 120,
      seats: 3,
      teamSize: 2,
      useCase: 'Coding',
    }

    const result = auditTool(tool)
    
    const downgradeRec = result.recommendations.find(r => r.type === 'downgrade')
    expect(downgradeRec).toBeDefined()
  })

  it('should calculate total savings correctly', () => {
    const tools: ToolInput[] = [
      {
        toolName: 'cursor',
        plan: 'Pro',
        monthlySpend: 100,
        seats: 5,
        teamSize: 3,
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

    const result = auditAllTools(tools)
    
    expect(result.totalCurrentSpend).toBe(160)
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(0)
    expect(result.totalYearlySavings).toBe(result.totalMonthlySavings * 12)
  })

  it('should detect consolidation opportunities for coding tools', () => {
    const tools: ToolInput[] = [
      {
        toolName: 'cursor',
        plan: 'Pro',
        monthlySpend: 100,
        seats: 5,
        teamSize: 5,
        useCase: 'Coding',
      },
      {
        toolName: 'github-copilot',
        plan: 'Business',
        monthlySpend: 95,
        seats: 5,
        teamSize: 5,
        useCase: 'Coding',
      },
    ]

    const recommendations = detectConsolidationOpportunities(tools)
    
    expect(recommendations.length).toBeGreaterThan(0)
    expect(recommendations[0].type).toBe('consolidate')
    expect(recommendations[0].title).toContain('coding')
  })

  it('should optimize API usage for high spenders', () => {
    const tool: ToolInput = {
      toolName: 'anthropic-api',
      plan: 'Pay-as-you-go',
      monthlySpend: 1000,
      seats: 1,
      teamSize: 5,
      useCase: 'Coding',
    }

    const result = auditTool(tool)
    
    const optimizeRec = result.recommendations.find(r => 
      r.type === 'optimize' && r.title.toLowerCase().includes('api')
    )
    expect(optimizeRec).toBeDefined()
    expect(optimizeRec?.monthlySavings).toBeGreaterThan(0)
  })
})
