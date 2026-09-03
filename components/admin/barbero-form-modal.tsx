'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { createBarbero, updateBarbero } from '@/lib/actions/barberos'
import type { Barbero, ComisionTipo } from '@/lib/types'
import { XIcon } from '@/components/icons'

const ACCENTS: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n', ü: 'u' }

function slugify(nombre: string) {
  const sinAcentos = nombre
    .trim()
    .toLowerCase()
    .split('')
    .map((ch) => ACCENTS[ch] ?? ch)
    .join('')
  const base = sinAcentos.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'barbero'
  return `${base}-${Math.random().toString(36).slice(2, 6)}`
}

export function BarberoFormModal({
  open,
  onClose,
  onSaved,
  barbero,
}: {
  open: boolean
  onClose: () => void
  onSaved: () => void
  barbero: Barbero | null
}) {
  const [nombre, setNombre] = useState('')
  const [especialidad, setEspecialidad] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [comisionTipo, setComisionTipo] = useState<ComisionTipo>('porcentaje')
  const [comisionValor, setComisionValor] = useState('0')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setNombre(barbero?.nombre ?? '')
    setEspecialidad(barbero?.especialidad ?? '')
    setTelefono(barbero?.telefono ?? '')
    setEmail(barbero?.email ?? '')
    setComisionTipo(barbero?.comision_tipo ?? 'porcentaje')
    setComisionValor(String(barbero?.comision_valor ?? 0))
    setError(null)
  }, [open, barbero])

  async function handleSubmit() {
    if (!nombre.trim()) {
      setError('Ingresá el nombre del barbero.')
      return
    }
    setSubmitting(true)
    const comision_valor = Number(comisionValor) || 0
    if (barbero) {
      await updateBarbero(barbero.id, {
        nombre,
        especialidad: especialidad || undefined,
        telefono: telefono || undefined,
        email: email || undefined,
        comision_tipo: comisionTipo,
        comision_valor,
      })
    } else {
      await createBarbero({
        id: slugify(nombre),
        nombre,
        especialidad: especialidad || undefined,
        telefono: telefono || undefined,
        email: email || undefined,
        estado: 'activo',
        comision_tipo: comisionTipo,
        comision_valor,
      })
    }
    setSubmitting(false)
    onSaved()
    onClose()
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
              <p className="text-sm font-semibold text-slate-900">{barbero ? 'Editar barbero' : 'Nuevo barbero'}</p>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Cerrar">
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3.5 p-5">
              <Field label="Nombre">
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre y apellido"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </Field>
              <Field label="Especialidad (opcional)">
                <input
                  value={especialidad}
                  onChange={(e) => setEspecialidad(e.target.value)}
                  placeholder="Ej: Fades y coloración"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Teléfono (opcional)">
                  <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="11 2233-4455"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </Field>
                <Field label="Email (opcional)">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Comisión">
                  <select
                    value={comisionTipo}
                    onChange={(e) => setComisionTipo(e.target.value as ComisionTipo)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="porcentaje">Porcentaje (%)</option>
                    <option value="fijo">Monto fijo ($)</option>
                  </select>
                </Field>
                <Field label={comisionTipo === 'porcentaje' ? 'Valor (%)' : 'Valor ($)'}>
                  <input
                    type="number"
                    min={0}
                    value={comisionValor}
                    onChange={(e) => setComisionValor(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </Field>
              </div>

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
                {submitting ? 'Guardando…' : barbero ? 'Guardar cambios' : 'Crear barbero'}
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
