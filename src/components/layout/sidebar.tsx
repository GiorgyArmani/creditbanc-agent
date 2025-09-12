'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MessageSquare, TrendingUp, FileSearch, Calendar, LogOut, User, BookMarked, X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type SidebarProps = {
  isOpen?: boolean        // mobile only
  onClose?: () => void    // mobile only
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email)
    })
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = '/'
  }

  const navItems = [
    { label: 'Finance Academy', href: '/dashboard', icon: TrendingUp },
    { label: 'AI Chat', href: '/dashboard/chat', icon: MessageSquare },
    { label: 'Credit Report Assistant', href: '/dashboard/credit-report-assistant', icon: FileSearch },
    { label: 'Book Consultation', href: '/dashboard/book-consultation', icon: Calendar },
    { label: 'Business Vault', href: '/dashboard/business-vault', icon: BookMarked },
    { label: 'Business Profile', href: '/dashboard/business-profile', icon: User },
  ]

  // Contenedor base del sidebar (estático en md+, off-canvas en mobile)
  return (
    <>
      {/* Overlay para mobile */}
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Sidebar navigation"
        className={[
          // tamaño/estilo
          'fixed z-50 top-0 left-0 h-screen w-64 bg-white border-r shadow-sm flex flex-col justify-between',
          // animación off-canvas
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // en md+ siempre visible y estático
          'md:translate-x-0 md:static md:z-auto'
        ].join(' ')}
      >
        {/* Header */}
        <div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-emerald-600">Business Coach</h2>
              <p className="text-sm text-gray-500">AI-powered guidance</p>
            </div>
            {/* Close en mobile */}
            <button
              onClick={onClose}
              className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link href={href} key={href} onClick={onClose}>
                <Button
                  variant={pathname === href ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    pathname === href ? 'bg-emerald-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-emerald-100 rounded-full p-2">
              <User className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800 truncate">
                {userEmail?.split('@')[0] || 'User'}
              </p>
              <Badge className="bg-green-100 text-green-800 text-xs">Free Plan</Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full text-gray-700">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  )
}
