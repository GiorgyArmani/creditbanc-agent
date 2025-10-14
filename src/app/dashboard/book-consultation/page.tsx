"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function BookConsultation() {
  useEffect(() => {
    // Load the LeadConnector embed script
    const script = document.createElement("script")
    script.src = "https://link.msgsndr.com/js/form_embed.js"
    script.type = "text/javascript"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Free Consultation</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Book Your Free Credit Consultation</h1>
            <p className="text-slate-600">
              Get personalized advice from our financial experts to accelerate your credit building journey
            </p>
          </div>

          {/* Benefits Section */}
          <Card className="mb-8 bg-emerald-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-800">What You'll Get:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-200 flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-emerald-800">Personalized Credit Analysis</h4>
                    <p className="text-sm text-emerald-700">Deep dive into your credit reports</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-200 flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-emerald-800">Custom Action Plan</h4>
                    <p className="text-sm text-emerald-700">Tailored strategy for your goals</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-200 flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-emerald-800">Priority Support</h4>
                    <p className="text-sm text-emerald-700">Direct access to our experts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-200 flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-emerald-800">45-Minute Session</h4>
                    <p className="text-sm text-emerald-700">Comprehensive consultation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* LeadConnector Booking Widget */}
          <Card className="bg-white/80 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Book Your Consultation</CardTitle>
              <CardDescription className="text-slate-600">
                Select a time that works best for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                <iframe
                  src="https://api.leadconnectorhq.com/widget/booking/zGKSE1WcbBMaMosaorSB"
                  style={{
                    width: "100%",
                    border: "none",
                    overflow: "hidden",
                    minHeight: "600px",
                  }}
                  scrolling="no"
                  id="Nx6LB5cdh606ydWBh4nK_1760398897619"
                  title="Book Consultation"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}