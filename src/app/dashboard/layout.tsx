// src/app/dashboard/layout.tsx
import { Sidebar } from '@/components/layout/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
// This layout component wraps the dashboard pages, providing a consistent sidebar and main content area.
// It ensures that all dashboard pages have the same layout structure, making it easier to manage navigation    