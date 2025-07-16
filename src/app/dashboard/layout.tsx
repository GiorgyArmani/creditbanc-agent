// src/app/dashboard/layout.tsx
'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { AppHeader } from '@/components/layout/app-header'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import React from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useProtectedRoute()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-50 overflow-hidden">
        <AppHeader
          title="Welcome to your Dashboard"
          subtitle="Let’s grow your business"
          showProfileButton={true}
          profileCompletion={0} // ← puedes reemplazar esto con progreso real dinámico
          onProfileClick={() => window.location.href = '/dashboard/business-profile'}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
