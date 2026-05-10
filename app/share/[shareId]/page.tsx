'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, DollarSign, Sparkles, Loader2, ArrowRight, Share2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { type Recommendation } from '@/lib/audit-engine'
import { exportAuditAsPdf } from '@/lib/report-export'
import Link from 'next/link'

interface AuditData {
  id: string
  totalMonthlySpend: number
  totalMonthlySavings: number
  totalYearlySavings: number
  recommendations: Recommendation[]
  aiSummary: string
}

export default function SharePage({ params }: { params: { shareId: string } }) {
  const { shareId } = React.use(params)
  const { toast } = useToast()
  const [isHydrated, setIsHydrated] = useState(false)
  const [audit, setAudit] = useState<AuditData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    fetchAudit()
  }, [shareId, isHydrated])

  const fetchAudit = async () => {
    try {
      const response = await fetch(`/api/share/${shareId}`)
      if (!response.ok) throw new Error('Failed to fetch audit')
      const data = await response.json()
      setAudit(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load shared audit',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  const handleExportJson = () => {
    if (!audit) return

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      reportId: audit.id,
      totals: {
        monthlySpend: audit.totalMonthlySpend,
        monthlySavings: audit.totalMonthlySavings,
        yearlySavings: audit.totalYearlySavings,
      },
      summary: audit.aiSummary,
      recommendations: audit.recommendations,
    }

    downloadFile(
      `ai-spend-shared-report-${audit.id}.json`,
      JSON.stringify(exportPayload, null, 2),
      'application/json'
    )
  }

  const handleExportCsv = () => {
    if (!audit) return

    const escapeCsv = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`
    const rows: Array<Array<string | number>> = [
      ['Title', 'Description', 'Monthly Savings', 'Action Items'],
      ...audit.recommendations.map((rec) => [
        rec.title,
        rec.description,
        rec.monthlySavings,
        rec.actionItems.join(' | '),
      ]),
    ]

    const csvHeader: Array<Array<string | number>> = [
      ['Report ID', audit.id],
      ['Total Monthly Spend', audit.totalMonthlySpend],
      ['Total Monthly Savings', audit.totalMonthlySavings],
      ['Total Yearly Savings', audit.totalYearlySavings],
      [],
    ]

    const csvContent = [...csvHeader, ...rows]
      .map((row) => row.map((cell) => escapeCsv(cell ?? '')).join(','))
      .join('\n')

    downloadFile(`ai-spend-shared-report-${audit.id}.csv`, csvContent, 'text/csv;charset=utf-8;')
  }

  const handleExportPdf = () => {
    if (!audit) return

    exportAuditAsPdf('Shared AI Spend Audit Report', 'ai-spend-shared-report', {
      id: audit.id,
      totalMonthlySpend: audit.totalMonthlySpend,
      totalMonthlySavings: audit.totalMonthlySavings,
      totalYearlySavings: audit.totalYearlySavings,
      aiSummary: audit.aiSummary,
      recommendations: audit.recommendations,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="glass border-slate-800 p-8">
          <p className="text-white mb-4">Shared audit not found</p>
          <Link href="/audit">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create Your Own Audit
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const savingsPercentage = ((audit.totalMonthlySavings / audit.totalMonthlySpend) * 100).toFixed(0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" suppressHydrationWarning>
      <div className="px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-5xl"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400 border border-blue-500/20"
            >
              <Share2 className="h-4 w-4" />
              <span>Shared Audit Report</span>
            </motion.div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Team AI Spending Analysis
            </h1>
            <p className="text-slate-400 text-lg mb-2">
              Monthly savings opportunity: <span className="text-green-400 font-semibold">{formatCurrency(audit.totalMonthlySavings)}</span>
            </p>
            <p className="text-slate-500 text-sm mb-6">
              This is a {savingsPercentage}% reduction in AI tool spending
            </p>
            <div className="mb-6 flex justify-center">
              <Button
                onClick={handleExportPdf}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                <Download className="mr-2 h-5 w-5" />
                Export PDF
              </Button>
            </div>
            <Link href="/audit">
              <Button className="bg-green-600 hover:bg-green-700 font-semibold">
                Start Your Own Audit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <DollarSign className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-sm text-slate-400">Current Spend</div>
                </div>
                <div className="text-3xl font-bold text-white">
                  {formatCurrency(audit.totalMonthlySpend)}
                  <span className="text-sm text-slate-500 font-normal">/mo</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-green-500/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <TrendingDown className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="text-sm text-slate-400">Monthly Savings</div>
                </div>
                <div className="text-3xl font-bold text-green-400">
                  {formatCurrency(audit.totalMonthlySavings)}
                  <span className="text-sm text-green-500/70 font-normal ml-2">
                    ({savingsPercentage}%)
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="text-sm text-slate-400">Yearly Savings</div>
                </div>
                <div className="text-3xl font-bold text-white">
                  {formatCurrency(audit.totalYearlySavings)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Summary */}
          {audit.aiSummary && (
            <div className="mb-8">
              <Card className="glass border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed">{audit.aiSummary}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recommendations */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Recommendations</h2>
            <div className="space-y-4">
              {audit.recommendations.slice(0, 3).map((rec, index) => (
                <Card key={index} className="glass border-slate-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{rec.title}</CardTitle>
                        <CardDescription className="text-slate-400 mt-2">
                          {rec.description}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">
                          {formatCurrency(rec.monthlySavings)}
                        </div>
                        <div className="text-sm text-slate-500">per month</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Card className="glass border-blue-500/50 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Want to optimize your AI spending?
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={handleExportPdf}
                  variant="outline"
                  size="lg"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Export PDF
                </Button>
                <Button
                  onClick={handleExportJson}
                  variant="outline"
                  size="lg"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Export JSON
                </Button>
                <Button
                  onClick={handleExportCsv}
                  variant="outline"
                  size="lg"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Export CSV
                </Button>
                <Link href="/audit">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Get Your Free Audit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
