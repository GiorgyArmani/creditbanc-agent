export interface BusinessProfile {
  user_id?: string
  businessDescription?: string
  primaryGoal?: string
  mainChallenge?: string
  idealCustomer?: string
  businessModel?: string
  monthlyRevenue?: string
  profitMargin?: string
  averageTicketSize?: string
  personalTasks?: string
  teamStructure?: string
  automationNeeds?: string
  clientAcquisition?: string
  marketingWorking?: string
  marketingNotWorking?: string
  marketingMix?: string
  toolsUsed?: string
  dataAccess?: string
  repetitiveTasks?: string
  dataNeeds?: string
  aiOpenness?: string
  completionLevel: number
  lastUpdated: Date
  completedCategories: string[]
}

export interface BusinessProfileBuilderProps {
  initialProfile?: BusinessProfile
  onSave: (profile: BusinessProfile) => void
  onClose: () => void
}
