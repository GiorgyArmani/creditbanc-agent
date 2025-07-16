'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { AppHeader } from '@/components/layout/app-header' // opcional
import React from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useProtectedRoute()

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Main content empujado a la derecha del sidebar */}
      <div className="ml-64 flex flex-col w-full overflow-x-hidden">
        {/* <AppHeader ... /> si quieres mantenerlo global */}

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
