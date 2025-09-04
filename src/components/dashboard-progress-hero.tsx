// src/components/dashboard-progress-hero.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Sparkles, Target, CheckCircle2 } from 'lucide-react'
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'
import clsx from 'clsx'

type NextModule = { id: string; title?: string; total_lessons?: number; completed_lessons?: number }

export default function DashboardProgressHero({
  courseProgress,
  capitalReadiness,
  programProgress,          // si no lo pasas, se calcula como 70/30
  nextModule,
  nextLessonHref,           // 👈 URL directa a la lección actual
  nextLessonTitle,          // 👈 opcional, solo para copy
  totalAssessmentItems = 25,
}: {
  courseProgress: number
  capitalReadiness: number
  programProgress?: number | null
  nextModule?: NextModule | null
  nextLessonHref?: string
  nextLessonTitle?: string
  totalAssessmentItems?: number
}) {
  const blended = Math.round((programProgress ?? Math.round(courseProgress * 0.7 + capitalReadiness * 0.3)))

  const remainingAssessment = Math.max(0, totalAssessmentItems - Math.round((capitalReadiness / 100) * totalAssessmentItems))
  const courseLessonsRemaining = Math.max(0, (nextModule?.total_lessons ?? 0) - (nextModule?.completed_lessons ?? 0))

  // si capital readiness va más bajo, empujamos Assessment; si no, continuamos curso (módulo/lesson)
  const courseHref = nextLessonHref ?? (nextModule ? `/module/${nextModule.id}` : '/dashboard')
  const courseLabel = nextLessonHref
    ? `Continue: ${nextLessonTitle ?? 'Current lesson'}`
    : nextModule
      ? `Continue: ${nextModule.title ?? 'Next Module'}`
      : 'Open Academy'

  const primaryAction =
    capitalReadiness < courseProgress
      ? { label: 'Complete Assessment', href: '/dashboard/assessment', icon: Target }
      : { label: courseLabel, href: courseHref, icon: Sparkles }

  const ActionIcon = primaryAction.icon
  const data = [
    { name: 'Track', value: 100, fill: 'rgba(16,185,129,0.12)' },
    { name: 'Progress', value: blended, fill: '#10B981' },
  ]
  const milestones = [0, 25, 50, 75, 100]

  return (
    <Card className="bg-white/80 border-slate-200 shadow-sm">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-slate-900">Your Growth Journey</CardTitle>
          <CardDescription className="text-slate-600">One focus. One button. Keep momentum.</CardDescription>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">Course {courseProgress}%</Badge>
          <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200">Assessment {capitalReadiness}%</Badge>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ring */}
        <div className="relative h-56 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={14} data={data} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" background={{}} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="text-4xl font-extrabold text-slate-900">{blended}%</div>
            <div className="text-xs uppercase tracking-wider text-slate-500">Program Progress</div>
          </div>
        </div>

        {/* Milestones + Counters */}
        <div className="flex flex-col justify-center gap-6">
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Milestones</span>
              <span>Next: {milestones.find(m => m > blended) ?? '—'}%</span>
            </div>
            <div className="relative h-2 bg-slate-200 rounded">
              <div className="absolute h-2 bg-emerald-500 rounded" style={{ width: `${blended}%` }} />
              {milestones.map((m, i) => (
                <div
                  key={i}
                  className={clsx(
                    'absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border',
                    m <= blended ? 'bg-emerald-500 border-emerald-600' : 'bg-white border-slate-300'
                  )}
                  style={{ left: `calc(${m}% - 6px)` }}
                  title={`${m}%`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="text-xs text-slate-500 mb-1">Assessment</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <div className="text-sm">{remainingAssessment} item{remainingAssessment === 1 ? '' : 's'} left</div>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="text-xs text-slate-500 mb-1">Next Module</div>
              <div className="text-sm">
                {nextModule ? `${Math.max(courseLessonsRemaining, 0)} lesson${courseLessonsRemaining === 1 ? '' : 's'} left` : 'All caught up'}
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 items-center md:items-start justify-center md:justify-end">
          <Link href={primaryAction.href}>
            <Button className="h-14 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-sm">
              <ActionIcon className="h-5 w-5 mr-2" />
              {primaryAction.label}
            </Button>
          </Link>

          {/* Botón directo a la lección actual (si existe URL) */}
          {nextLessonHref && (
            <Link href={nextLessonHref}>
              <Button variant="outline" className="h-12 px-5 rounded-2xl">
                Go to current lesson
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
