'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { AppHeader } from '@/components/layout/app-header' // si ya lo tienes global
import React from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useProtectedRoute()

  return (
    <>
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Main layout empujado a la derecha del sidebar */}
      <div className="ml-64 flex flex-col min-h-screen w-full bg-gray-50">
        {/* Si quieres tener un header global también */}
        {/* <AppHeader
          title="Welcome"
          subtitle="Let’s grow your business"
          showProfileButton
          profileCompletion={0}
          onProfileClick={() => window.location.href = '/dashboard/business-profile'}
        /> */}

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </>
  )
}
