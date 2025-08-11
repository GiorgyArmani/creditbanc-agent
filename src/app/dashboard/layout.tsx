'use client'

import React, { Suspense } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { usePathname } from 'next/navigation'
import OnboardingGate from '@/components/onboarding/onboarding-gate'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useProtectedRoute()
  const pathname = usePathname()

  // Evita layout para rutas embed
  const isEmbed = pathname?.startsWith('/dashboard/embed/')

  if (isEmbed) {
    return <>{children}</> // No aplica layout (sin sidebar/header ni gate)
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="ml-64 flex flex-col w-full">
        {/* El main NO tiene overflow, para evitar doble scroll */}
        <main className="flex-1 flex flex-col">
          {/* Gate global: muestra modal si el onboarding no está completo */}
            <OnboardingGate>
              {children}
            </OnboardingGate>

        </main>
      </div>
    </div>
  )
}
