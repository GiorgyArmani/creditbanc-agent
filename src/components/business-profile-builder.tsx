'use client'

import { useState, useEffect } from 'react'
import type { BusinessProfileBuilderProps, BusinessProfile } from '@/types/business-profile'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Save, User, Target, DollarSign, Settings } from 'lucide-react'

const DEFAULT_PROFILE: BusinessProfile = {
  business_description: '',
  business_model: '',
  ideal_customer: '',
  primary_goal: '',
  main_challenge: '',
  monthly_revenue: '',
  average_ticket_size: '',
  client_acquisition: '',
  marketing_working: '',
  marketing_not_working: '',
}

export function BusinessProfileBuilder({ initialProfile, onSave, onClose }: BusinessProfileBuilderProps) {
  const [profile, setProfile] = useState<BusinessProfile>(initialProfile || DEFAULT_PROFILE)
  const [activeTab, setActiveTab] = useState('basic')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (initialProfile) setProfile(initialProfile)
  }, [initialProfile])

  const updateProfile = (key: keyof BusinessProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

 const calculateCompletionLevel = () => {
  const fields: (keyof BusinessProfile)[] = [
    'business_description',
    'primary_goal',
    'main_challenge',
    'ideal_customer',
    'business_model',
    'monthly_revenue',
    'average_ticket_size',
    'client_acquisition',
    'marketing_working',
    'marketing_not_working',
  ]
  const completed = fields.filter((field) => {
    const value = profile[field]
    return typeof value === 'string' ? value.trim() !== '' : value !== null && value !== undefined
  }).length
  return Math.round((completed / fields.length) * 100)
}


  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      completion_level: calculateCompletionLevel(),
      last_updated: new Date().toISOString(),
    }
    onSave(updatedProfile)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const completionLevel = calculateCompletionLevel()

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">Business Profile</h1>
              <p className="text-sm text-gray-600">Tell us about your business</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium">{completionLevel}% Complete</div>
              <Progress value={completionLevel} className="w-24 h-2" />
            </div>
            <Button onClick={handleSave} className="bg-emerald-500 text-white">
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="basic"><User className="h-4 w-4" /> Basic</TabsTrigger>
            <TabsTrigger value="goals"><Target className="h-4 w-4" /> Goals</TabsTrigger>
            <TabsTrigger value="financial"><DollarSign className="h-4 w-4" /> Financial</TabsTrigger>
            <TabsTrigger value="operations"><Settings className="h-4 w-4" /> Ops</TabsTrigger>
          </TabsList>

          {/* Basic Info */}
          <TabsContent value="basic" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="business_description">Description</Label>
                  <Textarea id="business_description" value={profile.business_description} onChange={(e) => updateProfile('business_description', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="business_model">Business Model</Label>
                  <Input id="business_model" value={profile.business_model} onChange={(e) => updateProfile('business_model', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="ideal_customer">Ideal Customer</Label>
                  <Input id="ideal_customer" value={profile.ideal_customer} onChange={(e) => updateProfile('ideal_customer', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals */}
          <TabsContent value="goals" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Goals & Challenges</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primary_goal">Primary Goal</Label>
                  <Input id="primary_goal" value={profile.primary_goal} onChange={(e) => updateProfile('primary_goal', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="main_challenge">Main Challenge</Label>
                  <Textarea id="main_challenge" value={profile.main_challenge} onChange={(e) => updateProfile('main_challenge', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial */}
          <TabsContent value="financial" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Financial Info</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="monthly_revenue">Monthly Revenue</Label>
                  <Input id="monthly_revenue" value={profile.monthly_revenue} onChange={(e) => updateProfile('monthly_revenue', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="average_ticket_size">Avg Ticket Size</Label>
                  <Input id="average_ticket_size" value={profile.average_ticket_size} onChange={(e) => updateProfile('average_ticket_size', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operations */}
          <TabsContent value="operations" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Operations</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="client_acquisition">Client Acquisition</Label>
                  <Textarea id="client_acquisition" value={profile.client_acquisition} onChange={(e) => updateProfile('client_acquisition', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="marketing_working">Marketing Working</Label>
                  <Textarea id="marketing_working" value={profile.marketing_working} onChange={(e) => updateProfile('marketing_working', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="marketing_not_working">Marketing Not Working</Label>
                  <Textarea id="marketing_not_working" value={profile.marketing_not_working} onChange={(e) => updateProfile('marketing_not_working', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
