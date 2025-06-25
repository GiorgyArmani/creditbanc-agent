"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function BookConsultation() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredTime: "",
    creditGoals: "",
    currentChallenges: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would integrate with GoHighLevel to create a contact and opportunity
    try {
      const response = await fetch("/api/book-consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error("Error booking consultation:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Consultation Booked!</h1>
            <p className="text-slate-600 mb-6">
              Thank you for booking a consultation. Our financial advisor will contact you within 24 hours to schedule
              your personalized credit analysis session.
            </p>
            <Link href="/">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
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

          {/* Booking Form */}
          <Card className="bg-white/80 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Book Your Consultation</CardTitle>
              <CardDescription className="text-slate-600">
                Fill out the form below and we'll contact you within 24 hours to schedule your session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="preferredTime" className="block text-sm font-medium text-slate-700 mb-2">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Preferred Time
                    </label>
                    <Input
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="border-slate-300"
                      placeholder="e.g., Weekday mornings"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="creditGoals" className="block text-sm font-medium text-slate-700 mb-2">
                    What are your credit goals?
                  </label>
                  <Textarea
                    id="creditGoals"
                    name="creditGoals"
                    value={formData.creditGoals}
                    onChange={handleInputChange}
                    className="border-slate-300"
                    placeholder="e.g., Improve credit score to 750, qualify for a mortgage, etc."
                    rows={3}
                  />
                </div>

                <div>
                  <label htmlFor="currentChallenges" className="block text-sm font-medium text-slate-700 mb-2">
                    What credit challenges are you currently facing?
                  </label>
                  <Textarea
                    id="currentChallenges"
                    name="currentChallenges"
                    value={formData.currentChallenges}
                    onChange={handleInputChange}
                    className="border-slate-300"
                    placeholder="e.g., High credit utilization, collections, errors on report, etc."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Book My Free Consultation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
