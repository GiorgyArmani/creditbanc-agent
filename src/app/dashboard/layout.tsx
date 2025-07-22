'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { AppHeader } from '@/components/layout/app-header'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useProtectedRoute()
  const pathname = usePathname()

  // Evita layout para rutas embed
  const isEmbed = pathname?.startsWith('/dashboard/embed/')

  if (isEmbed) {
    return <>{children}</> // No aplica layout (sin sidebar/header)
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex flex-col w-full overflow-x-hidden">
        {/* <AppHeader /> opcional */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
