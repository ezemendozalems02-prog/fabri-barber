'use client'

import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoMark } from '@/components/logo'
import { ADMIN_NAV } from '@/lib/admin-nav'
import type { Rol } from '@/lib/types'
import { ChevronLeftIcon, XIcon } from '@/components/icons'

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname.startsWith(href)
}

function NavList({
  rol,
  collapsed,
  pathname,
  onNavigate,
}: {
  rol: Rol
  collapsed: boolean
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2.5 py-4">
      {ADMIN_NAV.filter((item) => item.roles.includes(rol)).map((item) => {
        const active = isActive(pathname, item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? 'bg-blue-600/15 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
            } ${collapsed ? 'justify-center' : ''}`}
          >
            <span className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-blue-500 transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
            <Icon className={`h-[18px] w-[18px] flex-shrink-0 ${active ? 'text-blue-400' : ''}`} />
            {!collapsed && <span className="truncate">{item.label}</span>}
            {collapsed && (
              <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminSidebarDesktop({
  rol,
  collapsed,
  onToggleCollapsed,
}: {
  rol: Rol
  collapsed: boolean
  onToggleCollapsed: () => void
}) {
  const pathname = usePathname()

  return (
    <aside
      className={`sticky top-0 hidden h-screen flex-shrink-0 flex-col border-r border-slate-800 bg-slate-900 transition-[width] duration-200 lg:flex ${
        collapsed ? 'w-[76px]' : 'w-64'
      }`}
    >
      <div className={`flex h-16 items-center gap-2.5 px-4 ${collapsed ? 'justify-center px-0' : ''}`}>
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-blue-500 text-blue-400">
          <LogoMark className="h-4 w-4" />
        </span>
        {!collapsed && (
          <span className="truncate text-sm font-semibold uppercase tracking-wide text-white">
            Fabri Barber
          </span>
        )}
      </div>

      <NavList rol={rol} collapsed={collapsed} pathname={pathname} />

      <button
        onClick={onToggleCollapsed}
        className="flex items-center gap-2 border-t border-slate-800 px-4 py-3.5 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200"
      >
        <motion.span animate={{ rotate: collapsed ? 180 : 0 }} className="flex h-5 w-5 items-center justify-center">
          <ChevronLeftIcon className="h-4 w-4" />
        </motion.span>
        {!collapsed && 'Contraer menú'}
      </button>
    </aside>
  )
}

export function AdminSidebarMobile({
  rol,
  open,
  onClose,
}: {
  rol: Rol
  open: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-slate-950/60" onClick={onClose} aria-hidden="true" />
          <motion.aside
            className="relative flex h-full w-72 max-w-[80vw] flex-col bg-slate-900"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-500 text-blue-400">
                  <LogoMark className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold uppercase tracking-wide text-white">Fabri Barber</span>
              </div>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-white/5" aria-label="Cerrar menú">
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <NavList rol={rol} collapsed={false} pathname={pathname} onNavigate={onClose} />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
