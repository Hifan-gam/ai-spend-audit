import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const audit = await prisma.audit.findUnique({
      where: { id: params.id },
    })

    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(audit)
  } catch (error) {
    console.error('Fetch audit error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit' },
      { status: 500 }
    )
  }
}
