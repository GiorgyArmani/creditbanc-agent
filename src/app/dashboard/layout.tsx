'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { AppHeader } from '@/components/layout/app-header'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { createClient } from '@/lib/supabase/client'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useProtectedRoute()

  const supabase = createClient()
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (!error && user?.email) {
        // Intenta obtener el nombre desde metadata o usa el email como fallback
        const name = user.user_metadata?.full_name || user.email.split('@')[0]
        setUserName(name)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-50 overflow-hidden">
        <AppHeader
          title={userName ? `Welcome, ${userName}` : 'Welcome'}
          subtitle="Let’s grow your business"
          showProfileButton={true}
          profileCompletion={0}
          onProfileClick={() => window.location.href = '/dashboard/business-profile'}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
