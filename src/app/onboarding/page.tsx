"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles } from "lucide-react"

interface BusinessProfile {
  business_name?: string
  business_description?: string
  primary_goal?: string
  main_challenge?: string
  ideal_customer?: string
  business_model?: string
  monthly_revenue?: string
  average_ticket_size?: string
  client_acquisition?: string
  marketing_working?: string
  marketing_not_working?: string
  completion_level: number
  completed_categories: string[]
  updated_at: string   // <-- ahora string ISO, no Date
}

interface Field {
  key: keyof BusinessProfile
  label: string
  type: "input" | "textarea" | "select"
  placeholder?: string
  options?: string[]
  required?: boolean
}

interface Step {
  title: string
  description: string
  fields: Field[]
}

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<Partial<BusinessProfile>>({})
  const router = useRouter()
  const supabase = createClient()

  const steps: Step[] = [
    {
      title: "Tell us about your business",
      description: "Help us understand what you do",
      fields: [
        { key: "business_name", label: "Business Name", type: "input", placeholder: "e.g., Great Business LLC", required: true },
        { key: "business_description", label: "Business Description", type: "textarea", placeholder: "Describe your business in a few sentences...", required: true },
        { key: "business_model", label: "Business Model", type: "select", options: ["Service-based","Product-based","E-commerce","SaaS/Software","Consulting","Agency","Retail","Other"], required: true },
      ],
    },
    {
      title: "What are your goals?",
      description: "Let's understand what you want to achieve",
      fields: [
        { key: "primary_goal", label: "Primary Business Goal", type: "select", options: ["Increase revenue","Scale operations","Improve efficiency","Expand market reach","Launch new products","Build team","Other"], required: true },
        { key: "main_challenge", label: "Biggest Challenge", type: "textarea", placeholder: "What's your biggest business challenge right now?", required: true },
      ],
    },
    {
      title: "Financial overview",
      description: "Help us understand your business size",
      fields: [
        { key: "monthly_revenue", label: "Monthly Revenue", type: "select", options: ["Less than $1K","$1K - $5K","$5K - $10K","$10K - $25K","$25K - $50K","$50K - $100K","More than $100K"] },
        { key: "average_ticket_size", label: "Average Customer Value", type: "input", placeholder: "e.g., $500" },
      ],
    },
  ]

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleFieldChange = (key: keyof BusinessProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const handleComplete = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const completedProfile: BusinessProfile = {
      ...profile,
      completion_level: 75,
      updated_at: new Date(),
      completed_categories: ["basic", "goals", "financial"],
  } as unknown as BusinessProfile

  const { error } = await supabase
    .from("business_profiles")
    .upsert(
      {
        user_id: user.id,
        ...completedProfile,
      },
      { onConflict: "user_id" } // ahora funciona porque es UNIQUE
    )

  if (error) {
    console.error("Error saving profile:", error)
  } else {
    router.push("/dashboard")
  }
}


  const isStepValid = () => {
    const requiredFields = currentStepData.fields.filter((field) => field.required)
    return requiredFields.every((field) => profile[field.key])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            <Sparkles className="h-4 w-4 mr-2" />
            Quick Setup
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's get to know your business</h1>
          <p className="text-gray-600">This helps us provide personalized recommendations just for you</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStepData.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>

                {field.type === "input" && (
                  <Input
                    id={field.key}
                    placeholder={field.placeholder}
                    value={String(profile[field.key] ?? "")} // ✅ force string
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea
                    id={field.key}
                    placeholder={field.placeholder}
                    value={String(profile[field.key] ?? "")} // ✅ force string
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    rows={3}
                  />
                )}

                {field.type === "select" && (
                  <Select
                    value={String(profile[field.key] ?? "")} // ✅ force string
                    onValueChange={(value) => handleFieldChange(field.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                  Skip for now
                </Button>
              </div>

              <Button onClick={handleNext} disabled={!isStepValid()}>
                {currentStep === steps.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
