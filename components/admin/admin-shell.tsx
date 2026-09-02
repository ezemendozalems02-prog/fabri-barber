'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { useSession } from '@/lib/services/auth'
import { AdminSidebarDesktop, AdminSidebarMobile } from './admin-sidebar'
import { AdminTopbar } from './admin-topbar'

const COLLAPSE_KEY = 'fabribarber_admin_sidebar_collapsed'

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, ready } = useSession()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(COLLAPSE_KEY)
    if (stored) setCollapsed(stored === '1')
  }, [])

  function toggleCollapsed() {
    setCollapsed((v) => {
      window.localStorage.setItem(COLLAPSE_KEY, v ? '0' : '1')
      return !v
    })
  }

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!ready || isLoginPage) return
    if (!user) router.replace('/admin/login')
  }, [ready, user, isLoginPage, router])

  if (isLoginPage) return <div className="admin-light">{children}</div>

  if (!ready || !user) {
    return (
      <div className="admin-light flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    )
  }

  return (
    <div className="admin-light flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebarDesktop rol={user.rol} collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      <AdminSidebarMobile rol={user.rol} open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar user={user} onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  )
}
