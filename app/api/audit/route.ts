import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auditAllTools, detectConsolidationOpportunities, type ToolInput } from '@/lib/audit-engine'
import { generateAISummary } from '@/lib/prompts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tools } = body as { tools: ToolInput[] }

    if (!tools || tools.length === 0) {
      return NextResponse.json(
        { error: 'No tools provided' },
        { status: 400 }
      )
    }

    // Run audit engine
    const auditResults = auditAllTools(tools)
    const consolidationRecs = detectConsolidationOpportunities(tools)

    // Combine all recommendations
    const allRecommendations = [
      ...auditResults.results.flatMap(r => r.recommendations),
      ...consolidationRecs,
    ]

    // Generate AI summary
    const aiSummary = await generateAISummary(
      tools,
      auditResults.totalCurrentSpend,
      auditResults.totalMonthlySavings,
      auditResults.totalYearlySavings
    )

    // Save to database
    const audit = await prisma.audit.create({
      data: {
        tools: tools as any,
        totalMonthlySpend: auditResults.totalCurrentSpend,
        totalMonthlySavings: auditResults.totalMonthlySavings,
        totalYearlySavings: auditResults.totalYearlySavings,
        recommendations: allRecommendations as any,
        aiSummary,
        isPublic: false,
      },
    })

    return NextResponse.json({
      auditId: audit.id,
      shareId: audit.shareId,
    })
  } catch (error) {
    console.error('Audit error:', error)
    return NextResponse.json(
      { error: 'Failed to process audit' },
      { status: 500 }
    )
  }
}
