'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Download, BookOpen, PartyPopper } from 'lucide-react'
import Link from 'next/link'
import Confetti from 'react-confetti'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import VideoPlayer from '@/components/video-player'
import PDFViewer from '@/components/pdf/pdf-viewer'
import CreditRepairCTA from '@/components/credit-repair-cta'

interface Lesson {
  id: string
  title: string
  lesson_type: 'video' | 'pdf' | 'embed' | 'checklist' | 'pitch' | 'assistant'
  resource_url: string
  display_order: number
}

interface Module {
  id: string
  title: string
  description: string
  is_free: boolean
  created_at: string
}

export default function ModulePage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [module, setModule] = useState<Module | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [nextModule, setNextModule] = useState<Module | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  const currentLesson = lessons[currentLessonIndex]
  const progressPercent = lessons.length
    ? (completedLessons.size / lessons.length) * 100
    : 0

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)

      const [{ data: moduleData }, { data: lessonsData }, { data: progressData }] = await Promise.all([
        supabase.from('academy_modules').select('*').eq('id', id).single(),
        supabase.from('academy_lessons').select('*').eq('module_id', id).order('display_order', { ascending: true }),
        supabase.from('user_progress').select('lesson_id').eq('user_id', user.id).eq('module_id', id),
      ])

      if (moduleData) setModule(moduleData)
      if (lessonsData) setLessons(lessonsData)
      if (progressData) {
        const completedSet = new Set(progressData.map((r) => r.lesson_id))
        setCompletedLessons(completedSet)
      }
    }

    if (id) fetchData()
  }, [id])

  useEffect(() => {
    const checkCompletion = async () => {
      if (progressPercent === 100 && userId && module) {
        setShowCelebration(true)

        const { data: nextModules } = await supabase
          .from('academy_modules')
          .select('*')
          .gt('created_at', module.created_at)
          .order('created_at', { ascending: true })
          .limit(1)

        if (nextModules && nextModules.length > 0) {
          setNextModule(nextModules[0])
        }
      }
    }

    checkCompletion()
  }, [progressPercent, userId, module])

  const markLessonComplete = async (lessonId: string) => {
    if (!userId || !id || completedLessons.has(lessonId)) return

    await supabase.from('user_progress').upsert({
      user_id: userId,
      module_id: id,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    })

    setCompletedLessons((prev) => new Set(prev).add(lessonId))
  }

  const goToLesson = async (index: number) => {
    setCurrentLessonIndex(index)
    const lesson = lessons[index]
    await markLessonComplete(lesson.id)
  }

  if (!module || !lessons.length) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Modal Celebration */}
      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="text-center">
          <Confetti width={window.innerWidth} height={window.innerHeight} />
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-600">Congratulations! 🎉</DialogTitle>
            <p className="text-sm text-slate-600 mt-2">You completed this module.</p>
          </DialogHeader>
          {nextModule && (
            <Button
              onClick={() => router.push(`/dashboard/module/${nextModule.id}`)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700"
            >
              Go to next module: {nextModule.title}
            </Button>
          )}
        </DialogContent>
      </Dialog>

      <header className="border-slate-200 bg-white/80 backdrop-blur-sm">
  <div className="container mx-auto px-4 py-4 flex justify-between items-center">
    <div className="flex items-center space-x-4">
      {/* Volver al módulo anterior si existe, si no, ir al dashboard */}
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600 hover:text-slate-900"
        onClick={async () => {
          const { data: prevModules } = await supabase
            .from('academy_modules')
            .select('*')
            .lt('created_at', module?.created_at)
            .order('created_at', { ascending: false })
            .limit(1)

          if (prevModules && prevModules.length > 0) {
            router.push(`/dashboard/module/${prevModules[0].id}`)
          } else {
            router.push('/dashboard')
          }
        }}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Título del módulo */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">{module.title}</h1>
        <p className="text-sm text-slate-600">{module.description}</p>
      </div>
    </div>

    {/* Botón para ir al siguiente módulo si ya completó el actual */}
    <div className="flex items-center gap-4">
      {progressPercent === 100 && nextModule && (
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => router.push(`/dashboard/module/${nextModule.id}`)}
        >
          Next module: {nextModule.title}
        </Button>
      )}

      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
        {Math.round(progressPercent)}% Complete
      </Badge>
    </div>
  </div>
</header>

      {/* Body */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-white/80 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Lessons</CardTitle>
              <Progress value={progressPercent} className="h-2" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {lessons.map((lesson, i) => (
                  <div
                    key={lesson.id}
                    onClick={() => goToLesson(i)}
                    className={`p-4 border-l-4 cursor-pointer transition-all ${
                      i === currentLessonIndex
                        ? 'border-emerald-500 bg-emerald-50'
                        : completedLessons.has(lesson.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-200 text-slate-600">
                        {lesson.lesson_type === 'video' && <Play className="h-4 w-4" />}
                        {lesson.lesson_type === 'pdf' && <Download className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">{lesson.title}</h4>
                        <p className="text-xs text-slate-600 capitalize">{lesson.lesson_type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Viewer */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-white/80 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                {currentLesson.title}
              </CardTitle>
              <CardDescription className="text-slate-600">
                {currentLesson.lesson_type === 'video' && 'Watch the video lesson'}
                {currentLesson.lesson_type === 'pdf' && 'Download and review the PDF resource'}
                {currentLesson.lesson_type === 'embed' && (
                  <iframe
                    src={currentLesson.resource_url}
                    className="w-full h-[600px] border rounded-md"
                    allow="clipboard-write; clipboard-read"
                  /> )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentLesson.lesson_type === 'video' && (
                <VideoPlayer videoUrl={currentLesson.resource_url} title={currentLesson.title} />
              )}
              {currentLesson.lesson_type === 'pdf' && (
                <PDFViewer pdfUrl={currentLesson.resource_url} title={currentLesson.title} />
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={currentLessonIndex === 0}
              onClick={() => goToLesson(currentLessonIndex - 1)}
            >
              Previous
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={currentLessonIndex === lessons.length - 1}
              onClick={() => goToLesson(currentLessonIndex + 1)}
            >
              Next
            </Button>
          </div>

          {/* Next Module Button (outside modal) */}
          {progressPercent === 100 && nextModule && !showCelebration && (
            <div className="text-center mt-8">
              <h3 className="text-lg font-bold text-emerald-600 mb-2 flex justify-center items-center gap-2">
                <PartyPopper className="w-5 h-5" /> Module complete!
              </h3>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => router.push(`/dashboard/module/${nextModule.id}`)}
              >
                Go to next module: {nextModule.title}
              </Button>
            </div>
          )}
          {/* CTA */} 
        <div className="mt-8">
          <CreditRepairCTA />
          </div>
        </div>
        
        

      </div>
    </div>
  )
}
