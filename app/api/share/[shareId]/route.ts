import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  try {
    const audit = await prisma.audit.findUnique({
      where: { 
        shareId: params.shareId,
        isPublic: true,
      },
      select: {
        id: true,
        totalMonthlySpend: true,
        totalMonthlySavings: true,
        totalYearlySavings: true,
        recommendations: true,
        aiSummary: true,
        // Exclude sensitive data
      },
    })

    if (!audit) {
      return NextResponse.json(
        { error: 'Shared audit not found or not public' },
        { status: 404 }
      )
    }

    return NextResponse.json(audit)
  } catch (error) {
    console.error('Fetch shared audit error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shared audit' },
      { status: 500 }
    )
  }
}
