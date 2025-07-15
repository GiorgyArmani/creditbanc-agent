'use client'

import { useState, useEffect } from 'react'
import type { BusinessProfileBuilderProps, BusinessProfile } from '@/types/business-profile'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Save, User, Target, DollarSign, Settings } from 'lucide-react'

const DEFAULT_PROFILE: BusinessProfile = {
  completionLevel: 0,
  lastUpdated: new Date(),
  completedCategories: [],
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
    const fields = [
      'businessDescription',
      'primaryGoal',
      'mainChallenge',
      'idealCustomer',
      'businessModel',
      'monthlyRevenue',
      'clientAcquisition',
      'marketingWorking',
    ]
    const completed = fields.filter((field) => {
      const value = profile[field as keyof BusinessProfile]
      return value !== undefined && value !== null && value !== ''
    }).length
    return fields.length > 0 ? Math.round((completed / fields.length) * 100) : 0
  }

  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      completionLevel: calculateCompletionLevel(),
      lastUpdated: new Date(),
      completedCategories: profile.completedCategories || ['basic', 'goals', 'financial', 'operations'],
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

          <TabsContent value="basic" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessDescription">Description</Label>
                  <Textarea id="businessDescription" value={profile.businessDescription || ''} onChange={(e) => updateProfile('businessDescription', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="businessModel">Business Model</Label>
                  <Input id="businessModel" value={profile.businessModel || ''} onChange={(e) => updateProfile('businessModel', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="idealCustomer">Ideal Customer</Label>
                  <Input id="idealCustomer" value={profile.idealCustomer || ''} onChange={(e) => updateProfile('idealCustomer', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Goals & Challenges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primaryGoal">Primary Goal</Label>
                  <Input id="primaryGoal" value={profile.primaryGoal || ''} onChange={(e) => updateProfile('primaryGoal', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="mainChallenge">Main Challenge</Label>
                  <Textarea id="mainChallenge" value={profile.mainChallenge || ''} onChange={(e) => updateProfile('mainChallenge', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="monthlyRevenue">Monthly Revenue</Label>
                  <Input id="monthlyRevenue" value={profile.monthlyRevenue || ''} onChange={(e) => updateProfile('monthlyRevenue', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="averageTicketSize">Avg Ticket Size</Label>
                  <Input id="averageTicketSize" value={profile.averageTicketSize || ''} onChange={(e) => updateProfile('averageTicketSize', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="clientAcquisition">Client Acquisition</Label>
                  <Textarea id="clientAcquisition" value={profile.clientAcquisition || ''} onChange={(e) => updateProfile('clientAcquisition', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="marketingWorking">Marketing Working</Label>
                  <Textarea id="marketingWorking" value={profile.marketingWorking || ''} onChange={(e) => updateProfile('marketingWorking', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
