import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { auditId, email, companyName, role, teamSize } = body

    if (!auditId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Update audit with lead info
    const audit = await prisma.audit.update({
      where: { id: auditId },
      data: {
        email,
        companyName,
        role,
        teamSize,
        isPublic: true,
      },
    })

    // Send email (if Resend is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: 'Your AI Spend Audit Report',
            html: `
              <h1>Your AI Spend Audit is Ready</h1>
              <p>Thanks for using AI Spend Audit! Your personalized report is ready.</p>
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/results/${audit.id}">View Your Report</a></p>
              <p>Share your results: ${process.env.NEXT_PUBLIC_APP_URL}/share/${audit.shareId}</p>
            `,
          }),
        })
      } catch (emailError) {
        console.error('Email send failed:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/share/${audit.shareId}`,
    })
  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json(
      { error: 'Failed to save information' },
      { status: 500 }
    )
  }
}
