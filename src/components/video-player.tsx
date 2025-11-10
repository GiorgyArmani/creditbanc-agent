"use client"

import { useRef, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause } from "lucide-react"

// UPDATED: Added description prop to interface
export interface VideoPlayerProps {
  videoUrl: string
  title: string
  description?: string | null  // Optional description from database
}

// Helper function to convert URLs in text to clickable links
function linkifyText(text: string) {
  // Regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  
  return parts.map((part, index) => {
    // Check if this part is a URL
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:text-emerald-700 underline font-medium transition-colors"
        >
          {part}
        </a>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export default function VideoPlayer({ 
  videoUrl, 
  title, 
  description 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Video Player Card */}
      <Card className="bg-slate-900 border-slate-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-black">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              </div>
            )}
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              controlsList="nodownload"
              className="absolute inset-0 w-full h-full object-contain"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Information Card - UPDATED: Now uses dynamic description */}
      <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                {isPlaying ? (
                  <Pause className="h-6 w-6 text-emerald-600" />
                ) : (
                  <Play className="h-6 w-6 text-emerald-600" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {description 
                  ? linkifyText(description)
                  : "Watch this lesson and apply the concepts to grow your business and improve your financial health!"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Tips Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg 
                className="h-5 w-5 text-blue-600" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Pro Tip</p>
              <p className="text-blue-700">
                Take notes while watching and apply these strategies to your business for best results.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}