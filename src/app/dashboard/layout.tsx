'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { usePathname } from 'next/navigation'
import OnboardingGate from '@/components/onboarding/onboarding-gate'
import { Menu } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useProtectedRoute()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Cierra el drawer al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isEmbed = pathname?.startsWith('/dashboard/embed/')
  if (isEmbed) return <>{children}</>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar: off-canvas en mobile, fijo en md+ */}
      <div className="md:flex">
        <Sidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        {/* Contenedor principal: aplicar margen solo en md+ */}
        <div className="flex flex-col w-full md:ml-64">
          {/* Topbar visible SOLO en mobile */}
          <header className="sticky top-0 z-30 bg-white border-b md:hidden">
            <div className="h-14 px-3 flex items-center justify-between">
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open sidebar"
                className="inline-flex h-10 w-10 items-center justify-center rounded hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="text-sm text-gray-600">FinanceAcademy</div>
              <div className="w-10" /> {/* spacer para balancear */}
            </div>
          </header>

          {/* Main (sin overflow para evitar doble scroll) */}
          <main className="flex-1 flex flex-col">
            <OnboardingGate>{children}</OnboardingGate>
          </main>
        </div>
      </div>
    </div>
  )
}
