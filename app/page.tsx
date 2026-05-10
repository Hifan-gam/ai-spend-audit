'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, TrendingDown, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-20 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-5xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400 border border-blue-500/20">
            <Sparkles className="h-4 w-4" />
            <span>Free AI Spend Analysis</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-7xl">
            Stop Overpaying for{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">AI Tools</span>
          </h1>

          <p className="mb-10 text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Audit your AI spending across <span className="text-blue-300 font-semibold">Cursor, GitHub Copilot, Claude, ChatGPT, and more</span>. Get personalized recommendations and save <span className="text-green-400 font-semibold">up to $4,200/year</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/audit" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-green-600/50">
                Start Free Audit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400 px-8 py-6 text-lg font-semibold">
              See Example Report →
            </Button>
          </div>

          <p className="mt-6 text-sm text-slate-400 flex items-center justify-center gap-2">
            <span>✓ No credit card required</span>
            <span className="text-slate-600">•</span>
            <span>Takes 2 minutes</span>
            <span className="text-slate-600">•</span>
            <span>100% free</span>
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-5xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Average Savings', value: '$4,200', suffix: '/year' },
              { label: 'Tools Analyzed', value: '9+', suffix: 'AI tools' },
              { label: 'Audits Completed', value: '500+', suffix: 'startups' },
            ].map((stat, i) => (
              <Card key={i} className="glass border-slate-800">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.suffix}</div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-5xl"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 text-lg">
              Three simple steps to optimize your AI spending
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Input Your Tools',
                description: 'Tell us which AI tools you use and your monthly spending',
                color: 'bg-blue-500/20 text-blue-400'
              },
              {
                icon: TrendingDown,
                title: 'AI Analysis',
                description: 'Our engine finds savings opportunities across your tools',
                color: 'bg-green-500/20 text-green-400'
              },
              {
                icon: Zap,
                title: 'Save Big',
                description: 'Get actionable recommendations and save up to $4,200/year',
                color: 'bg-purple-500/20 text-purple-400'
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass border-slate-800 h-full hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                  <CardHeader>
                    <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg ${feature.color}`}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-sm font-semibold text-blue-400">Step {i + 1}</div>
                    </div>
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-400 text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-5xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Startups
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote: "Saved us $3,600/year by consolidating our AI tools. The audit was eye-opening.",
                author: "Sarah Chen",
                role: "CTO, TechStart",
                savings: "$300/month"
              },
              {
                quote: "We were paying for 15 seats but only using 8. Quick fix, big savings.",
                author: "Mike Rodriguez",
                role: "Engineering Lead, BuildCo",
                savings: "$480/month"
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass border-slate-800 hover:border-green-500/50 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, j) => (
                          <span key={j} className="text-green-400">★</span>
                        ))}
                      </div>
                      <div className="text-sm font-semibold text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                        {testimonial.savings}
                      </div>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="border-t border-slate-700/50 pt-4">
                      <div className="font-semibold text-white text-sm">{testimonial.author}</div>
                      <div className="text-xs text-slate-500">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <Card className="glass border-green-500/50 bg-green-500/5 p-12 hover:border-green-400 transition-colors">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Optimize Your AI Spend?
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Join startups saving thousands annually. Get your personalized audit in 2 minutes—completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/audit" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-10 py-6">
                  Start Audit Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold px-10 py-6">
                View FAQ
              </Button>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-12">
        <div className="mx-auto max-w-5xl text-center text-slate-500 text-sm">
          <p>&copy; 2026 AI Spend Audit. Built for startups, by developers.</p>
        </div>
      </footer>
    </div>
  )
}
