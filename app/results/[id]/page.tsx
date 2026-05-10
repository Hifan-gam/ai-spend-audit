'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { TrendingDown, DollarSign, Sparkles, Share2, Mail, Loader2, CheckCircle2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { type Recommendation } from '@/lib/audit-engine'
import { exportAuditAsPdf } from '@/lib/report-export'

interface AuditData {
  id: string
  totalMonthlySpend: number
  totalMonthlySavings: number
  totalYearlySavings: number
  recommendations: Recommendation[]
  aiSummary: string
  shareId: string
  email?: string
}

export default function ResultsPage() {
  const params = useParams() as { id?: string } | null
  const id = params?.id ?? ''
  const { toast } = useToast()
  const [audit, setAudit] = useState<AuditData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    role: '',
    teamSize: '',
  })

  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        const response = await fetch(`/api/audit/${id}`)
        if (!response.ok) throw new Error('Failed to fetch audit')
        const data = await response.json()
        if (!mounted) return
        setAudit(data)
        setShowLeadForm(!data.email)
      } catch {
        toast({ title: 'Error', description: 'Failed to load audit results', variant: 'destructive' })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (id) run()
    return () => { mounted = false }
  }, [id, toast])
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          companyName: formData.companyName,
          role: formData.role,
          teamSize: formData.teamSize,
          auditId: audit?.id,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit')

      toast({ title: 'Thanks', description: 'We sent the report to your email' })
      setShowLeadForm(false)
    } catch {
      toast({ title: 'Error', description: 'Failed to submit details', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = async () => {
    if (!audit) return
    
    const shareUrl = `${window.location.origin}/share/${audit.shareId}`
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Link copied!',
        description: 'Share your results with your team',
      })
    } catch {
      toast({ title: 'Share URL', description: shareUrl })
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
      `ai-spend-report-${audit.id}.json`,
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

    downloadFile(`ai-spend-report-${audit.id}.csv`, csvContent, 'text/csv;charset=utf-8;')
  }

  const handleExportPdf = () => {
    if (!audit) return

    exportAuditAsPdf('AI Spend Audit Report', 'ai-spend-report', {
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
          <p className="text-white">Audit not found</p>
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
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-400 border border-green-500/20"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Audit Complete</span>
            </motion.div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Your AI Spend Report
            </h1>
            <p className="text-slate-400 text-lg">
              We found opportunities to save {formatCurrency(audit.totalMonthlySavings)}/month
            </p>
          </div>

          <div className="mb-8 flex justify-center">
            <Button
              onClick={handleExportPdf}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8"
            >
              <Download className="mr-2 h-5 w-5" />
              Export PDF
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
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
            </motion.div>
          </div>

          {/* AI Summary */}
          {audit.aiSummary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
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
            </motion.div>
          )}

          {/* Recommendations */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Savings Opportunities</h2>
            <p className="text-slate-400 text-sm mb-6">
              We found {audit.recommendations.length} ways to optimize your spending:
            </p>
            <div className="space-y-4">
              {audit.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <Card className="glass border-slate-800 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold">
                              #{index + 1}
                            </div>
                            <CardTitle className="text-white text-lg">{rec.title}</CardTitle>
                          </div>
                          <CardDescription className="text-slate-400 mt-2">
                            {rec.description}
                          </CardDescription>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-3xl font-bold text-green-400">
                            {formatCurrency(rec.monthlySavings)}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">monthly savings</div>
                          <div className="text-xs text-green-400/70 mt-2 font-semibold">
                            ≈ {formatCurrency(rec.monthlySavings * 12)}/year
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                        <div className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                          ✓ Action Steps:
                        </div>
                        <ul className="space-y-2">
                          {rec.actionItems.map((item, i) => (
                            <li key={i} className="text-sm text-slate-400 flex items-start gap-3">
                              <span className="text-blue-400 font-bold mt-0.5">{i + 1}.</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Lead Capture Form */}
          {showLeadForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="glass border-blue-500/50 bg-blue-500/5">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-xl">
                    <Mail className="h-5 w-5 text-blue-400" />
                    Unlock Full Report & Sharing
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Enter your details to get a detailed PDF report and the ability to share your audit with your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-slate-300 font-medium mb-2 block">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="you@company.com"
                          suppressHydrationWarning
                        />
                      </div>
                      <div>
                        <Label htmlFor="company" className="text-slate-300 font-medium mb-2 block">Company Name</Label>
                        <Input
                          id="company"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Acme Inc"
                          suppressHydrationWarning
                        />
                      </div>
                      <div>
                        <Label htmlFor="role" className="text-slate-300 font-medium mb-2 block">Your Role</Label>
                        <Input
                          id="role"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="CTO, Engineer, Manager, etc."
                          suppressHydrationWarning
                        />
                      </div>
                      <div>
                        <Label htmlFor="teamSize" className="text-slate-300 font-medium mb-2 block">Team Size</Label>
                        <Input
                          id="teamSize"
                          value={formData.teamSize}
                          onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="1-10, 11-50, 50+, etc."
                          suppressHydrationWarning
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Unlock Full Report
                          <Mail className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Report Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <Button
              onClick={handleExportPdf}
              variant="outline"
              size="lg"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold px-8"
            >
              <Download className="mr-2 h-5 w-5" />
              Export PDF
            </Button>
            <Button
              onClick={handleExportJson}
              variant="outline"
              size="lg"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold px-8"
            >
              <Download className="mr-2 h-5 w-5" />
              Export JSON
            </Button>
            <Button
              onClick={handleExportCsv}
              variant="outline"
              size="lg"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold px-8"
            >
              <Download className="mr-2 h-5 w-5" />
              Export CSV
            </Button>
            {!showLeadForm && (
              <>
                <Button
                  onClick={handleShare}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share With Team
                </Button>
                <Button
                  onClick={() => setShowLeadForm(true)}
                  variant="outline"
                  size="lg"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold px-8"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Get PDF Report
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
