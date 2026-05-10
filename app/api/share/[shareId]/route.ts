import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const segments = url.pathname.split('/')
  const shareId = segments[segments.length - 1]
  try {
    const audit = await prisma.audit.findUnique({
      where: { 
        shareId,
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
  } catch {
    console.error('Fetch shared audit error')
    return NextResponse.json(
      { error: 'Failed to fetch shared audit' },
      { status: 500 }
    )
  }
}
