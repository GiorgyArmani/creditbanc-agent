'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ModuleCard from '@/components/module-card'
import { LogoutButton } from '@/components/logout-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'
import CreditScoreWidget from '@/components/credit-score-widget'
import CreditGoalsWidget from '@/components/credit-goals-widget'

export default function CourseDashboard() {
  const [creditScore, setCreditScore] = useState(720)
  const [targetScore, setTargetScore] = useState(750)
  const [userName, setUserName] = useState<string | null>(null)
  const [modules, setModules] = useState<any[]>([])
  const [courseProgress, setCourseProgress] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const nameFromMetadata = user.user_metadata?.full_name || user.user_metadata?.name
        const fallback = user.email?.split('@')[0]
        setUserName(nameFromMetadata ?? fallback ?? 'User')
      }

      const { data: moduleData } = await supabase
        .from('academy_modules')
        .select('*')
        .order('display_order', { ascending: true })

      const { data: lessonsData } = await supabase
        .from('academy_lessons')
        .select('id, module_id')

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id, completed')
        .eq('user_id', user?.id)

      if (!moduleData) return

      // Armar cada módulo con lecciones y progreso
      const modulesWithProgress = moduleData.map((mod) => {
        const lessons = lessonsData?.filter((l) => l.module_id === mod.id) || []
        const completed = progressData?.filter((p) =>
          lessons.some((l) => l.id === p.lesson_id && p.completed)
        ) || []

        return {
          ...mod,
          total_lessons: lessons.length,
          completed_lessons: completed.length,
          duration: mod.duration ?? '—', // si no existe la columna, puedes omitir esto
          type: mod.type ?? 'video'      // si no existe, default
        }
      })

      setModules(modulesWithProgress)

      const totalLessons = modulesWithProgress.reduce((sum, m) => sum + m.total_lessons, 0)
      const completedLessons = modulesWithProgress.reduce((sum, m) => sum + m.completed_lessons, 0)
      setCourseProgress(totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0)
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">FinanceAcademy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Premium Member
              </Badge>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back{userName ? `, ${userName}` : ''}!
          </h2>
          <p className="text-slate-600">Master your credit and take control of your financial future</p>
        </div>

        {/* Progress */}
        <Card className="mb-8 bg-white/80 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Course Progress
            </CardTitle>
            <CardDescription className="text-slate-600">You're making great progress! Keep it up.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Overall Completion</span>
                <span className="text-emerald-400 font-medium">{courseProgress}%</span>
              </div>
              <Progress value={courseProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Credit Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CreditScoreWidget score={creditScore} range="FICO Score 8" onScoreUpdate={setCreditScore} />
          <CreditGoalsWidget currentScore={creditScore} targetScore={targetScore} onTargetUpdate={setTargetScore} />
        </div>

        {/* Modules */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Course Modules</h3>
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 bg-white/80 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Quick Actions</CardTitle>
            <CardDescription className="text-slate-600">Access your resources and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/chat">
                <Button variant="outline" className="w-full h-16">💬 AI Business Coach</Button>
              </Link>
              <Link href="/dashboard/assessment">
                <Button variant="outline" className="w-full h-16">📋 Action Assessments</Button>
              </Link>
              <Link href="/dashboard/book-consultation">
                <Button className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white">
                  📅 Book Financial Advisor Call
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
