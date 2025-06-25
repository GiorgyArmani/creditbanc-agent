import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Download, CheckSquare, Clock, BookOpen, ExternalLink, Shield } from "lucide-react"
import Link from "next/link"
import VideoPlayer from "@/components/video-player"
import PDFDownload from "@/components/pdf-download"
import InteractiveChecklist from "@/components/interactive-checklist"
import ExternalEmbed from "@/components/external-embed"
import CreditRepairCTA from "@/components/credit-repair-cta"
import CreditAuditPitch from "@/components/credit-audit-pitch"
import CalendarEmbed from "@/components/calendar-embed"
import CreditMonitoringPitch from "@/components/credit-monitoring-pitch"

type Lesson =
  | {
      id: number
      title: string
      type: 'video'
      duration: string
      completed: boolean
      current?: boolean
      videoUrl: string
    }
  | {
      id: number
      title: string
      type: 'pdf'
      duration: string
      completed: boolean
      current?: boolean
      pdfUrl: string
      pdfTitle?: string
    }
  | {
      id: number
      title: string
      type: 'embed'
      duration: string
      completed: boolean
      current?: boolean
      embedUrl: string
      fallbackUrl: string
    }
  | {
      id: number
      title: string
      type: 'checklist'
      duration: string
      completed: boolean
      current?: boolean
    }
  | {
      id: number
      title: string
      type: 'pitch'
      duration: string
      completed: boolean
      current?: boolean
    }

type Module = {
  id: number
  title: string
  description: string
  progress: number
  lessons: Lesson[]
}

export default function ModulePage({ params }: { params: { id: string } }) {
  const moduleId = Number.parseInt(params.id)

  const getModuleData = (id: number): Module => {
    switch (id) {
      case 1:
        return {
          id: 1,
          title: "Introduction to Credit Building and Monitoring",
          description: "Learn the fundamentals and connect your scores to IDIQ",
          progress: 45,
          lessons: [
            {
              id: 1,
              title: "Introduction to Credit Building",
              type: "video",
              duration: "25:30",
              completed: false,
              current: true,
              videoUrl: "https://example.com/intro-credit-building.mp4",
            },
            {
              id: 2,
              title: "Connecting Business & Personal Scores to IDIQ",
              type: "video",
              duration: "18:45",
              completed: false,
              videoUrl: "https://example.com/idiq-tutorial.mp4",
            },
          ],
        }
      case 2:
        return {
          id: 2,
          title: "Analyze your Credit Report",
          description: "Use our Credit Report Analyzer tool and learn advanced analysis techniques",
          progress: 0,
          lessons: [
            {
              id: 1,
              title: "Credit Report Analyzer Tutorial",
              type: "video",
              duration: "22:30",
              completed: false,
              current: true,
              videoUrl: "https://example.com/analyzer-tutorial.mp4",
            },
            {
              id: 2,
              title: "Credit Report Analyzer Tool",
              type: "embed",
              duration: "Interactive Tool",
              completed: false,
              embedUrl: "https://your-analyzer-tool.com/embed",
              fallbackUrl: "https://your-analyzer-tool.com",
            },
          ],
        }
      case 3:
        return {
          id: 3,
          title: "Done for you Credit Monitoring",
          description: "Professional credit monitoring setup and tracking system",
          progress: 0,
          lessons: [
            {
              id: 1,
              title: "Done For You Credit Monitoring Setup",
              type: "pitch",
              duration: "Service Overview",
              completed: false,
              current: true,
            },
            {
              id: 2,
              title: "Credit Monitoring Checklist",
              type: "checklist",
              duration: "Interactive",
              completed: false,
            },
          ],
        }
      default:
        return getModuleData(1)
    }
  }

  const module = getModuleData(moduleId)
  const currentLesson = module.lessons.find((lesson) => lesson.current) || module.lessons[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{module.title}</h1>
                <p className="text-sm text-slate-600">{module.description}</p>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              {Math.round(module.progress)}% Complete
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 text-lg">Lessons</CardTitle>
                <Progress value={module.progress} className="h-2" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`p-4 border-l-4 cursor-pointer transition-all ${
                        lesson.current
                          ? "border-emerald-500 bg-emerald-50"
                          : lesson.completed
                            ? "border-green-500 bg-green-50"
                            : "border-transparent hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs ${
                              lesson.completed
                                ? "bg-green-100 text-green-700"
                                : lesson.current
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {lesson.type === "video" && <Play className="h-4 w-4" />}
                            {lesson.type === "pdf" && <Download className="h-4 w-4" />}
                            {lesson.type === "checklist" && <CheckSquare className="h-4 w-4" />}
                            {lesson.type === "embed" && <ExternalLink className="h-4 w-4" />}
                            {lesson.type === "pitch" && <Shield className="h-4 w-4" />}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-slate-900">{lesson.title}</h4>
                            <p className="text-xs text-slate-600 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.duration}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white/80 border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-500" />
                  {currentLesson.title}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {currentLesson.type === "video" && "Watch the video lesson"}
                  {currentLesson.type === "pdf" && "Download and review the PDF resource"}
                  {currentLesson.type === "checklist" && "Complete the interactive checklist"}
                  {currentLesson.type === "embed" &&
                    "Use this interactive tool to analyze your credit report in detail"}
                  {currentLesson.type === "pitch" && "Learn about our done for you credit monitoring service"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentLesson.type === "video" && (
                  <VideoPlayer videoUrl={currentLesson.videoUrl || ""} title={currentLesson.title} />
                )}

                {currentLesson.type === "pdf" && (
                  <PDFDownload
                    pdfUrl={currentLesson.pdfUrl || ""}
                    title={currentLesson.pdfTitle || currentLesson.title}
                  />
                )}

                {currentLesson.type === "checklist" && <InteractiveChecklist title={currentLesson.title} />}

                {currentLesson.type === "embed" && (
                  <ExternalEmbed
                    title={currentLesson.title}
                    description="Use this interactive tool to analyze your credit report in detail"
                    embedUrl={currentLesson.embedUrl || ""}
                    fallbackUrl={currentLesson.fallbackUrl}
                  />
                )}

                {currentLesson.type === "pitch" && <CreditMonitoringPitch />}

                {/* Credit Repair CTA for Module 1 and 2 */}
                {(moduleId === 1 || moduleId === 2) && currentLesson.type === "video" && (
                  <CreditRepairCTA
                    title={moduleId === 1 ? "Want a Done-For-You Solution?" : "Need Professional Credit Analysis?"}
                    description={
                      moduleId === 1
                        ? "Skip the learning curve and let our certified credit repair specialists handle everything for you."
                        : "Get expert help analyzing your credit report and creating a personalized repair strategy."
                    }
                  />
                )}

                {/* Credit Audit Pitch and Calendar for Module 3 */}
                {moduleId === 3 && (
                  <div className="mt-6 space-y-6">
                    <CreditAuditPitch />
                    <CalendarEmbed
                      embedUrl="https://your-calendar-platform.com/embed"
                      fallbackUrl="https://your-calendar-platform.com/book"
                      title="Book Your Credit Repairing Audit"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                Previous Lesson
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">Next Lesson</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
