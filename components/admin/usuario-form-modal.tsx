'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { createUsuario, updateUsuario } from '@/lib/actions/usuarios'
import type { Barbero, Rol, Usuario } from '@/lib/types'
import { XIcon } from '@/components/icons'

export function UsuarioFormModal({
  open,
  onClose,
  onSaved,
  usuario,
  barberos,
}: {
  open: boolean
  onClose: () => void
  onSaved: () => void
  usuario: Usuario | null
  barberos: Barbero[]
}) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [rol, setRol] = useState<Rol>('recepcion')
  const [barberoId, setBarberoId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setNombre(usuario?.nombre ?? '')
    setEmail(usuario?.email ?? '')
    setRol(usuario?.rol ?? 'recepcion')
    setBarberoId(usuario?.barbero_id ?? '')
    setError(null)
  }, [open, usuario])

  async function handleSubmit() {
    if (!nombre.trim() || !email.trim()) {
      setError('Completá nombre y email.')
      return
    }
    setSubmitting(true)
    try {
      const payload = { nombre, email, rol, barbero_id: rol === 'barbero' ? barberoId || undefined : undefined }
      if (usuario) {
        await updateUsuario(usuario.id, payload)
      } else {
        await createUsuario(payload)
      }
      onSaved()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar el usuario.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="admin-light fixed inset-0 z-[90] flex items-end justify-center sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />
          <motion.div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <p className="text-sm font-semibold text-slate-900">{usuario ? 'Editar usuario' : 'Nuevo usuario'}</p>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Cerrar">
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3.5 p-5">
              <Field label="Nombre">
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </Field>
              <Field label="Email">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </Field>
              <Field label="Rol">
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value as Rol)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="admin">Administrador</option>
                  <option value="barbero">Barbero</option>
                  <option value="recepcion">Recepción</option>
                </select>
              </Field>
              {rol === 'barbero' && (
                <Field label="Vincular con barbero">
                  <select
                    value={barberoId}
                    onChange={(e) => setBarberoId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">Sin vincular</option>
                    {barberos.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nombre}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 p-4">
              <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? 'Guardando…' : usuario ? 'Guardar cambios' : 'Crear usuario'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      {children}
    </div>
  )
}
