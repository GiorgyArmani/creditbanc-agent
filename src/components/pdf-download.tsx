"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, ExternalLink } from "lucide-react"

export interface PDFViewerProps {
  pdfUrl: string
  title: string
  description?: string | null  // Optional description from database
}

export default function PDFViewer({ 
  pdfUrl, 
  title, 
  description 
}: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      // Open PDF in new tab for download
      window.open(pdfUrl, '_blank')
    } catch (error) {
      console.error('Error downloading PDF:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleView = () => {
    window.open(pdfUrl, '_blank')
  }

  return (
    <div className="space-y-4">
      {/* PDF Preview/Embed Card */}
      <Card className="bg-slate-50 border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-[3/4] bg-white">
            {/* PDF Embed - works in most browsers */}
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="absolute inset-0 w-full h-full"
              title={title}
            >
              {/* Fallback for browsers that don't support iframe PDF viewing */}
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">
                    Your browser cannot display PDFs directly.
                  </p>
                  <Button onClick={handleView} className="bg-emerald-600 hover:bg-emerald-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open PDF in New Tab
                  </Button>
                </div>
              </div>
            </iframe>
          </div>
        </CardContent>
      </Card>

      {/* PDF Information Card */}
      <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {description || "Download and review this comprehensive PDF guide. Use it as a reference for implementing financial strategies in your business."}
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  onClick={handleView}
                  variant="outline"
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Tips Card */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg 
                className="h-5 w-5 text-amber-600" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Resource Tip</p>
              <p className="text-amber-700">
                Save this PDF for future reference. Print key pages to keep at your desk while working on your business finances.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}