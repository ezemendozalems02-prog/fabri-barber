'use client'

// ------------------------------------------------------------------
// Auth de DEMO — login mock en el cliente, sin backend.
// La lista de usuarios seleccionables vive en Supabase (tabla
// `usuarios`, administrable desde /admin/configuracion) pero el login
// en sí sigue siendo "elegí un usuario y entrá", sin contraseña.
// Guarda el usuario "logueado" en localStorage. El día que se conecte
// Supabase Auth (u otro proveedor), esto se reemplaza por sesiones
// reales y RLS por rol; el resto del panel ya consume `rol` desde acá
// y no necesita cambios.
// ------------------------------------------------------------------

import { useEffect, useState } from 'react'
import type { Rol, Usuario } from '../types'

const SESSION_KEY = 'fabribarber_session'
const SESSION_EVENT = 'fabribarber_session_change'

export const ROL_LABEL: Record<Rol, string> = {
  admin: 'Administrador',
  barbero: 'Barbero',
  recepcion: 'Recepción',
}

export function getSession(): Usuario | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Usuario) : null
  } catch {
    return null
  }
}

export function login(usuario: Usuario) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(usuario))
  window.dispatchEvent(new Event(SESSION_EVENT))
}

export function logout() {
  window.localStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event(SESSION_EVENT))
}

/** Permisos por rol — usado para ocultar/bloquear secciones del panel. */
export const PERMISOS: Record<Rol, { verTodo: boolean; configuracionCritica: boolean; verFinanzas: boolean }> = {
  admin: { verTodo: true, configuracionCritica: true, verFinanzas: true },
  barbero: { verTodo: false, configuracionCritica: false, verFinanzas: false },
  recepcion: { verTodo: false, configuracionCritica: false, verFinanzas: true },
}

export function useSession() {
  const [user, setUser] = useState<Usuario | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setUser(getSession())
    setReady(true)
    const onChange = () => setUser(getSession())
    window.addEventListener(SESSION_EVENT, onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener(SESSION_EVENT, onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  return { user, ready }
}
