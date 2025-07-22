'use client'

import { useEffect, useState } from 'react'
import ModuleCard from '@/components/module-card'
import { createClient } from '@/lib/supabase/client'
import { LogoutButton } from "@/components/logout-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, MessageSquare, CheckSquare, Clock, Users, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"
import CreditScoreWidget from "@/components/credit-score-widget"
import CreditGoalsWidget from "@/components/credit-goals-widget"

export default function CourseDashboard() {
  const [creditScore, setCreditScore] = useState(720)
  const [targetScore, setTargetScore] = useState(750)
  const [userName, setUserName] = useState<string | null>(null)
  const courseProgress = 15

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const nameFromMetadata = user.user_metadata?.full_name || user.user_metadata?.name
        const fallback = user.email?.split('@')[0]
        setUserName(nameFromMetadata ?? fallback ?? 'User')
      }
    }

    fetchUser()
  }, [])

  const modules = [
    {
      id: '8d45e4a4-382b-4d40-b162-a00ca4d72243',
      title: "Introduction to Credit Building and Monitoring",
      description: "Learn the fundamentals and connect your scores to IDIQ",
      lessons: 2,
      duration: "45m",
      completed: false,
      current: true,
      type: "video",
    },
    {
      id: '0c4a5a99-2f4a-4e0f-9037-7dfec4989423',
      title: "Analyze your Credit Report",
      description: "Use our Credit Report Analyzer tool and learn advanced analysis techniques",
      lessons: 2,
      duration: "1h 15m",
      completed: false,
      type: "checklist",
    },
    {
      id: '6d1b82b1-3445-4973-9290-b2dfc32bd78b',
      title: "Done for you Credit Monitoring",
      description: "Professional credit monitoring setup and tracking system",
      lessons: 2,
      duration: "30m",
      completed: false,
      type: "pdf",
    },
  ]

  const getModuleIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />
      case "pdf":
        return <MessageSquare className="h-4 w-4" />
      case "checklist":
        return <CheckSquare className="h-4 w-4" />
      default:
        return <Play className="h-4 w-4" />
    }
  }

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back{userName ? `, ${userName}` : ''}!
          </h2>
          <p className="text-slate-600">Master your credit and take control of your financial future</p>
        </div>

        {/* Progress Overview */}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">6</div>
                  <div className="text-sm text-slate-600">Lessons Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">3h 15m</div>
                  <div className="text-sm text-slate-600">Time Invested</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">19</div>
                  <div className="text-sm text-slate-600">Total Lessons</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CreditScoreWidget score={creditScore} range="FICO Score 8" onScoreUpdate={setCreditScore} />
          <CreditGoalsWidget currentScore={creditScore} targetScore={targetScore} onTargetUpdate={setTargetScore} />
        </div>

        {/* Course Modules */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Course Modules</h3>

          {modules.map((module) => (
            <Card
              key={module.id}
              className={`bg-white/80 border-slate-200 shadow-sm hover:bg-slate-50 transition-all duration-200 ${
                module.current ? "ring-2 ring-emerald-500/50" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        module.completed
                          ? "bg-emerald-500/20 text-emerald-400"
                          : module.current
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {getModuleIcon(module.type)}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-1">{module.title}</h4>
                      <p className="text-slate-600 text-sm mb-2">{module.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {module.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {module.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {module.completed && (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Completed</Badge>
                    )}
                    {module.current && (
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">In Progress</Badge>
                    )}
                    <Link href={`/dashboard/module/${module.id}`}>
                      <Button
                        variant={module.current ? "default" : "outline"}
                        className={
                          module.current
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "border-slate-300 text-slate-700 hover:bg-slate-100"
                        }
                      >
                        {module.completed ? "Review" : module.current ? "Continue" : "Start"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                <Button variant="outline" className="w-full h-16 border-slate-300 text-slate-700 hover:bg-slate-100">
                  <div className="flex flex-col items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>AI Business Coach</span>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/assessment">
                <Button variant="outline" className="w-full h-16 border-slate-300 text-slate-700 hover:bg-slate-100">
                  <div className="flex flex-col items-center gap-2">
                    <CheckSquare className="h-5 w-5" />
                    <span>Action assessments</span>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/book-consultation">
                <Button className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <div className="flex flex-col items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span className="text-center text-sm">Book Financial Advisor Call</span>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
