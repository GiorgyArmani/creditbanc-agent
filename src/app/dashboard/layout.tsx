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
      <div className="ml-64 flex flex-col w-full">
        {/* <AppHeader /> opcional */}
        {/* ❌ Quitamos overflow-y-auto aquí */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  )
}
