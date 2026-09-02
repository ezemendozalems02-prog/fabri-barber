'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogoMark } from '@/components/logo'
import { DEMO_USUARIOS, ROL_LABEL, login } from '@/lib/services/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [selected, setSelected] = useState(DEMO_USUARIOS[0].id)
  const [loading, setLoading] = useState(false)

  function handleLogin() {
    setLoading(true)
    login(selected)
    router.replace('/admin')
  }

  return (
    <div className="admin-light flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
            <LogoMark className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">FABRI BARBER</p>
            <p className="text-xs text-slate-500">Panel de administración</p>
          </div>
        </div>

        <p className="mt-6 text-xs font-medium uppercase tracking-wider text-slate-400">
          Elegí un usuario de demo
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {DEMO_USUARIOS.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelected(u.id)}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                selected === u.id
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>
                <span className="block font-medium">{u.nombre}</span>
                <span className="block text-xs text-slate-400">{u.email}</span>
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                {ROL_LABEL[u.rol]}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          Ingresar
        </button>
        <p className="mt-4 text-center text-[11px] text-slate-400">
          Login de demostración — se reemplaza por autenticación real (Supabase Auth) más adelante.
        </p>
      </div>
    </div>
  )
}
