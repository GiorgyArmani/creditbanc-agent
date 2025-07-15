'use client'

import { useEffect, useState } from 'react'
import { BusinessProfileBuilder } from '@/components/business-profile-builder'
import { createClient } from '@/lib/supabase/client'
import type { BusinessProfile } from '@/types/business-profile'
import type { User } from '@supabase/supabase-js'

export default function BusinessProfilePage({ user }: { user: User }) {
  const supabase = createClient()
  const [initialProfile, setInitialProfile] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') console.error('Error loading profile:', error)
      if (data) setInitialProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [user.id, supabase])

  const handleSave = async (updatedProfile: BusinessProfile) => {
    const { error } = await supabase.from('business_profiles').upsert({
      ...updatedProfile,
      user_id: user.id,
      last_updated: new Date().toISOString(),
    })
    if (error) {
      console.error('Failed to save profile:', error)
      alert('There was an error saving your profile.')
    } else {
      alert('Profile saved!')
    }
  }

  if (loading) return <p className="text-center p-4">Loading profile...</p>

  return (
    <BusinessProfileBuilder
      initialProfile={initialProfile || undefined}
      onSave={handleSave}
      onClose={() => {}}
    />
  )
}
