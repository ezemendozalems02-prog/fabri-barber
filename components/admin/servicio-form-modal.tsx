'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { createServicio, updateServicio } from '@/lib/actions/servicios'
import type { Servicio } from '@/lib/types'
import { XIcon } from '@/components/icons'

const DIAS = [
  { v: 1, l: 'Lun' },
  { v: 2, l: 'Mar' },
  { v: 3, l: 'Mié' },
  { v: 4, l: 'Jue' },
  { v: 5, l: 'Vie' },
  { v: 6, l: 'Sáb' },
  { v: 0, l: 'Dom' },
]

function slugify(nombre: string) {
  const ACCENTS: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n', ü: 'u' }
  const base = nombre
    .trim()
    .toLowerCase()
    .split('')
    .map((ch) => ACCENTS[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return base || `servicio-${Date.now()}`
}

export function ServicioFormModal({
  open,
  onClose,
  onSaved,
  servicio,
}: {
  open: boolean
  onClose: () => void
  onSaved: () => void
  servicio: Servicio | null
}) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('0')
  const [duracion, setDuracion] = useState('30')
  const [dias, setDias] = useState<number[]>([2, 3, 4, 5, 6])
  const [horaInicio, setHoraInicio] = useState('10:00')
  const [horaFin, setHoraFin] = useState('19:00')
  const [nota, setNota] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setNombre(servicio?.nombre ?? '')
    setDescripcion(servicio?.descripcion ?? '')
    setPrecio(String(servicio?.precio ?? 0))
    setDuracion(String(servicio?.duracion ?? 30))
    setDias(servicio?.dias_disponibles ?? [2, 3, 4, 5, 6])
    setHoraInicio(servicio?.hora_inicio ?? '10:00')
    setHoraFin(servicio?.hora_fin ?? '19:00')
    setNota(servicio?.nota ?? '')
    setError(null)
  }, [open, servicio])

  function toggleDia(v: number) {
    setDias((prev) => (prev.includes(v) ? prev.filter((d) => d !== v) : [...prev, v].sort()))
  }

  async function handleSubmit() {
    if (!nombre.trim()) {
      setError('Ingresá el nombre del servicio.')
      return
    }
    if (dias.length === 0) {
      setError('Seleccioná al menos un día disponible.')
      return
    }
    setSubmitting(true)
    const payload = {
      nombre,
      descripcion,
      precio: Number(precio) || 0,
      duracion: Number(duracion) || 30,
      dias_disponibles: dias,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      nota: nota || null,
    }
    if (servicio) {
      await updateServicio(servicio.id, payload)
    } else {
      await createServicio({ id: slugify(nombre), ...payload })
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
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <p className="text-sm font-semibold text-slate-900">{servicio ? 'Editar servicio' : 'Nuevo servicio'}</p>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Cerrar">
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3.5 p-5">
              <Field label="Nombre">
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Corte"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </Field>
              <Field label="Descripción">
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Precio ($)">
                  <input
                    type="number"
                    min={0}
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </Field>
                <Field label="Duración (min)">
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={duracion}
                    onChange={(e) => setDuracion(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Desde">
                  <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </Field>
                <Field label="Hasta">
                  <input
                    type="time"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </Field>
              </div>
              <Field label="Días disponibles">
                <div className="flex flex-wrap gap-1.5">
                  {DIAS.map((d) => (
                    <button
                      key={d.v}
                      type="button"
                      onClick={() => toggleDia(d.v)}
                      className={`rounded-md border px-2.5 py-1.5 text-xs font-medium ${
                        dias.includes(d.v) ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                      }`}
                    >
                      {d.l}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Nota (opcional, ej: 'Incluye cejas')">
                <input
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </Field>

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
                {submitting ? 'Guardando…' : servicio ? 'Guardar cambios' : 'Crear servicio'}
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
