import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const segments = url.pathname.split('/')
  const id = segments[segments.length - 1]
  try {
    const audit = await prisma.audit.findUnique({
      where: { id },
    })

    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(audit)
  } catch {
    console.error('Fetch audit error')
    return NextResponse.json(
      { error: 'Failed to fetch audit' },
      { status: 500 }
    )
  }
}
