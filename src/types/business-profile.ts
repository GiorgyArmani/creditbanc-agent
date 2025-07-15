export interface BusinessProfile {
  id?: string
  user_id?: string
  business_name?: string
  business_description?: string
  business_model?: string
  ideal_customer?: string
  primary_goal?: string
  main_challenge?: string
  monthly_revenue?: string
  average_ticket_size?: string
  client_acquisition?: string
  marketing_working?: string
  marketing_not_working?: string
  completion_level?: number
  created_at?: string
  updated_at?: string
}

export interface BusinessProfileBuilderProps {
  initialProfile?: BusinessProfile
  onSave: (profile: BusinessProfile) => void
  onClose: () => void
}
