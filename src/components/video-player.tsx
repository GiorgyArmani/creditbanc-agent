"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, Maximize, Settings } from "lucide-react"

interface VideoPlayerProps {
  videoUrl: string
  title: string
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="space-y-4">
      <Card className="bg-slate-100 border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-black">
            {/* Video placeholder - replace with actual video element */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8" />
                </div>
                <p className="text-slate-900 font-medium">{title}</p>
                <p className="text-slate-600 text-sm mt-1">Click to play video</p>
              </div>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-700 hover:bg-slate-200"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <div className="text-slate-900 text-sm">0:00 / 15:30</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-slate-700 hover:bg-slate-200">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-700 hover:bg-slate-200">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-700 hover:bg-slate-200">
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="w-full bg-slate-300 h-1 rounded-full mt-2">
                <div className="bg-emerald-500 h-1 rounded-full w-1/3"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Description */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4">
          <h3 className="text-slate-900 font-medium mb-2">About this lesson</h3>
          <p className="text-slate-600 text-sm">
            In this comprehensive lesson, you'll learn the fundamental principles of investment that form the foundation
            of successful portfolio management. We'll cover risk assessment, diversification strategies, and how to
            align your investments with your financial goals.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
