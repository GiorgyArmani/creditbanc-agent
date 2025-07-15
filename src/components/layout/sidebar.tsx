'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MessageSquare,
  TrendingUp,
  FileSearch,
  Calendar,
  LogOut,
  User,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Sidebar() {
  const pathname = usePathname()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (!error && user?.email) {
        setUserEmail(user.email)
      }
    }
    fetchUser()
  }, [])

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
  ]

  return (
    <div className="w-64 border-r bg-white h-full flex flex-col justify-between shadow-sm">
      {/* Header */}
      <div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-emerald-600">Business Coach</h2>
          <p className="text-sm text-gray-500">AI-powered guidance</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link href={href} key={href}>
              <Button
                variant={pathname === href ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  pathname === href
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
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
    </div>
  )
}
