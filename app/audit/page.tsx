'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PRICING_DATA, USE_CASES, type UseCase } from '@/lib/pricing-data'
import { type ToolInput } from '@/lib/audit-engine'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

const STORAGE_KEY = 'ai-spend-audit-form'

export default function AuditPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [tools, setTools] = useState<ToolInput[]>([
    {
      toolName: '',
      plan: '',
      monthlySpend: 0,
      seats: 1,
      teamSize: 1,
      useCase: 'Coding',
    },
  ])

  // Hydration guard - only render form after client hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Load from localStorage
  useEffect(() => {
    if (!isHydrated) return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setTools(parsed)
      } catch {
        console.error('Failed to parse saved form data')
      }
    }
  }, [isHydrated])

  // Save to localStorage
  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools))
  }, [tools, isHydrated])

  const addTool = () => {
    setTools([
      ...tools,
      {
        toolName: '',
        plan: '',
        monthlySpend: 0,
        seats: 1,
        teamSize: 1,
        useCase: 'Coding',
      },
    ])
  }

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index))
  }

  const updateTool = (index: number, field: keyof ToolInput, value: string | number) => {
    const newTools = [...tools]
    newTools[index] = { ...newTools[index], [field]: value }
    setTools(newTools)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const validTools = tools.filter(t => t.toolName && t.monthlySpend > 0)
    if (validTools.length === 0) {
      toast({
        title: 'Missing information',
        description: 'Please add at least one tool with spending data',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tools: validTools }),
      })

      if (!response.ok) throw new Error('Audit failed')

      const data = await response.json()
      
      // Clear form
      localStorage.removeItem(STORAGE_KEY)
      
      // Navigate to results
      router.push(`/results/${data.auditId}`)
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to process audit. Please try again.',
        variant: 'destructive',
      })
      setIsSubmitting(false)
    }
  }

  const toolOptions = Object.keys(PRICING_DATA)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" suppressHydrationWarning>
      <div className="px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400 border border-blue-500/20">
              <Sparkles className="h-4 w-4" />
              <span>Smart Analysis</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Audit Your AI Spending
            </h1>
            <p className="text-slate-400 text-lg mb-2">
              Add your AI tools below and we will analyze your spending patterns to find savings opportunities.
            </p>
            <p className="text-slate-500 text-sm">
              All your data is processed securely and never stored.
            </p>
          </div>

          {!isHydrated ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-slate-400">Loading audit form...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="mb-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <div className="text-sm text-blue-300 font-medium mb-2">
                  📊 You have added {tools.filter(t => t.toolName).length} of {tools.length} tools
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((tools.filter(t => t.toolName).length) / tools.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {tools.map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass border-slate-800 hover:border-blue-500/30 transition-colors duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-bold">
                            {index + 1}
                          </div>
                          <CardTitle className="text-white">AI Tool Entry</CardTitle>
                        </div>
                        {tools.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTool(index)}
                            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Section 1: Tool Selection */}
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-300">1</span>
                          What tool are you using?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`tool-${index}`} className="text-slate-300 font-medium mb-2 block">
                              AI Tool *
                            </Label>
                            <Select
                              value={tool.toolName}
                              onValueChange={(value) => updateTool(index, 'toolName', value)}
                            >
                              <SelectTrigger id={`tool-${index}`} className="bg-slate-900 border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                <SelectValue placeholder="Select your AI tool" />
                              </SelectTrigger>
                              <SelectContent>
                                {toolOptions.map((toolKey) => (
                                  <SelectItem key={toolKey} value={toolKey}>
                                    {PRICING_DATA[toolKey].name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500 mt-1">Select from our supported tools list</p>
                          </div>

                          <div>
                            <Label htmlFor={`plan-${index}`} className="text-slate-300 font-medium mb-2 block">
                              Plan or Tier
                            </Label>
                            <Input
                              id={`plan-${index}`}
                              value={tool.plan}
                              onChange={(e) => updateTool(index, 'plan', e.target.value)}
                              placeholder="e.g., Pro, Business, Team"
                              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">Which plan tier are you on?</p>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Spending */}
                      <div className="pt-4 border-t border-slate-700/50">
                        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-xs text-green-300">2</span>
                          What is your spending?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`spend-${index}`} className="text-slate-300 font-medium mb-2 block">
                              Monthly Spend ($) *
                            </Label>
                            <Input
                              id={`spend-${index}`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={tool.monthlySpend || ''}
                              onChange={(e) => updateTool(index, 'monthlySpend', parseFloat(e.target.value) || 0)}
                              placeholder="250"
                              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">Your current monthly cost</p>
                          </div>

                          <div>
                            <Label htmlFor={`seats-${index}`} className="text-slate-300 font-medium mb-2 block">
                              Number of Seats / Users
                            </Label>
                            <Input
                              id={`seats-${index}`}
                              type="number"
                              min="1"
                              value={tool.seats}
                              onChange={(e) => updateTool(index, 'seats', parseInt(e.target.value) || 1)}
                              placeholder="1"
                              className="bg-slate-900 border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">How many people use this?</p>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Context */}
                      <div className="pt-4 border-t border-slate-700/50">
                        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-xs text-purple-300">3</span>
                          How do you use it?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`team-${index}`} className="text-slate-300 font-medium mb-2 block">
                              Total Team Size
                            </Label>
                            <Input
                              id={`team-${index}`}
                              type="number"
                              min="1"
                              value={tool.teamSize}
                              onChange={(e) => updateTool(index, 'teamSize', parseInt(e.target.value) || 1)}
                              placeholder="10"
                              className="bg-slate-900 border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">Size of your engineering/team</p>
                          </div>

                          <div>
                            <Label htmlFor={`usecase-${index}`} className="text-slate-300 font-medium mb-2 block">
                              Primary Use Case
                            </Label>
                            <Select
                              value={tool.useCase}
                              onValueChange={(value) => updateTool(index, 'useCase', value as UseCase)}
                            >
                              <SelectTrigger id={`usecase-${index}`} className="bg-slate-900 border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {USE_CASES.map((useCase) => (
                                  <SelectItem key={useCase} value={useCase}>
                                    {useCase}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500 mt-1">What is your main use case?</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addTool}
                className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-500 py-6 font-medium transition-all"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Another Tool
              </Button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: tools.length * 0.1 }}
              >
                <Card className="glass border-green-500/50 bg-green-500/5">
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <p className="text-sm text-slate-400 mb-2">Ready to analyze your spending?</p>
                      <h3 className="text-lg font-semibold text-white">
                        Total Monthly Spend: <span className="text-green-400">${tools.reduce((sum, t) => sum + (t.monthlySpend || 0), 0).toFixed(2)}</span>
                      </h3>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing Your Spending...
                        </>
                      ) : (
                        <>
                          Generate My Audit Report
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                      <p className="text-center text-xs text-slate-500 mt-4">
                      🔒 Your data is secure and will not be stored or shared
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
