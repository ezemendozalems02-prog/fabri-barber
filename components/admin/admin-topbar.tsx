'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { BellIcon, ChevronDownIcon, LogoutIcon, MenuIcon } from '@/components/icons'
import { ROL_LABEL, logout } from '@/lib/services/auth'
import { contarNoLeidas, listNotificaciones, marcarLeida, marcarTodasLeidas } from '@/lib/actions/notificaciones'
import type { Notificacion, Usuario } from '@/lib/types'

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diffMs / 60000)
  if (min < 1) return 'ahora'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h`
  return `hace ${Math.floor(h / 24)} d`
}

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, onOutside: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onOutside])
}

export function AdminTopbar({ user, onOpenMobileMenu }: { user: Usuario; onOpenMobileMenu: () => void }) {
  const router = useRouter()
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifs, setNotifs] = useState<Notificacion[]>([])
  const [unread, setUnread] = useState(0)
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useOutsideClick(notifRef, () => setNotifOpen(false))
  useOutsideClick(userRef, () => setUserMenuOpen(false))

  async function refreshNotifs() {
    const [notifsData, unreadCount] = await Promise.all([listNotificaciones(), contarNoLeidas()])
    setNotifs(notifsData)
    setUnread(unreadCount)
  }

  useEffect(() => {
    refreshNotifs()
  }, [])

  function handleOpenNotifs() {
    setNotifOpen((v) => !v)
    if (!notifOpen) refreshNotifs()
  }

  async function handleNotifClick(n: Notificacion) {
    await marcarLeida(n.id)
    await refreshNotifs()
    setNotifOpen(false)
    if (n.turno_id) router.push(`/admin/turnos?turno=${n.turno_id}`)
  }

  function handleLogout() {
    logout()
    router.replace('/admin/login')
  }

  const initials = user.nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <button
        onClick={onOpenMobileMenu}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Abrir menú"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative" ref={notifRef}>
          <button
            onClick={handleOpenNotifs}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Notificaciones"
          >
            <BellIcon className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">Notificaciones</p>
                  {unread > 0 && (
                    <button
                      onClick={async () => {
                        await marcarTodasLeidas()
                        await refreshNotifs()
                      }}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      Marcar todas
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifs.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-slate-400">Sin notificaciones todavía.</p>
                  ) : (
                    notifs.slice(0, 12).map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        className={`flex w-full flex-col gap-0.5 border-b border-slate-50 px-4 py-3 text-left last:border-0 hover:bg-slate-50 ${
                          !n.leida ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
                          {!n.leida && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />}
                          {n.titulo}
                        </span>
                        <span className="pl-3.5 text-xs text-slate-500">{n.descripcion}</span>
                        <span className="pl-3.5 text-[11px] text-slate-400">{timeAgo(n.created_at)}</span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 hover:bg-slate-100"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-semibold leading-tight text-slate-900">{user.nombre}</span>
              <span className="block text-[11px] leading-tight text-slate-500">{ROL_LABEL[user.rol]}</span>
            </span>
            <ChevronDownIcon className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
          </button>
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
              >
                <div className="border-b border-slate-100 px-3.5 py-2.5">
                  <p className="text-sm font-medium text-slate-900">{user.nombre}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50"
                >
                  <LogoutIcon className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
