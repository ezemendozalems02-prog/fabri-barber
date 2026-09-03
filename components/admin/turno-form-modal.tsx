'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { formatPrice, generateAvailableSlots } from '@/lib/booking-data'
import { listBarberosActivos } from '@/lib/actions/barberos'
import { crearTurnoAdmin, getOccupiedRangesForDate } from '@/lib/actions/turnos'
import { HAIRCUTS } from '@/lib/site-data'
import type { Barbero } from '@/lib/types'
import { useServices } from '@/components/catalog-provider'
import { XIcon } from '@/components/icons'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function TurnoFormModal({
  open,
  onClose,
  onCreated,
  presetFecha,
  presetHora,
}: {
  open: boolean
  onClose: () => void
  onCreated: () => void
  presetFecha?: string
  presetHora?: string
}) {
  const SERVICES = useServices()
  const [barberos, setBarberos] = useState<Barbero[]>([])

  const [nombre, setNombre] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [servicioId, setServicioId] = useState(SERVICES[0]?.id ?? '')
  const [barberoId, setBarberoId] = useState('')
  const [estilo, setEstilo] = useState('')
  const [fecha, setFecha] = useState(presetFecha ?? todayKey())
  const [hora, setHora] = useState<string | null>(presetHora ?? null)
  const [horarios, setHorarios] = useState<string[]>([])
  const [comentario, setComentario] = useState('')
  const [confirmarYaPagado, setConfirmarYaPagado] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    listBarberosActivos().then((data) => {
      setBarberos(data)
      setBarberoId((current) => current || data[0]?.id || '')
    })
  }, [])

  useEffect(() => {
    if (!open) return
    setNombre('')
    setWhatsapp('')
    setEmail('')
    setServicioId(SERVICES[0]?.id ?? '')
    setEstilo('')
    setFecha(presetFecha ?? todayKey())
    setHora(presetHora ?? null)
    setComentario('')
    setConfirmarYaPagado(true)
    setError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, presetFecha, presetHora])

  const servicio = SERVICES.find((s) => s.id === servicioId)

  useEffect(() => {
    if (!servicio || !barberoId || !fecha) {
      setHorarios([])
      return
    }
    let cancelled = false
    getOccupiedRangesForDate(fecha, barberoId).then((occupied) => {
      if (cancelled) return
      const date = new Date(`${fecha}T00:00:00`)
      setHorarios(generateAvailableSlots(servicio, date, occupied))
    })
    return () => {
      cancelled = true
    }
  }, [servicio, barberoId, fecha])

  async function handleSubmit() {
    if (!nombre.trim() || !whatsapp.trim() || !hora) {
      setError('Completá cliente, WhatsApp y horario.')
      return
    }
    setSubmitting(true)
    const result = await crearTurnoAdmin({
      cliente: { nombre, whatsapp, email },
      servicioId,
      barberoId,
      estiloCorte: estilo || undefined,
      fecha,
      hora,
      comentario: comentario || undefined,
      marcarComoConfirmado: confirmarYaPagado,
    })
    setSubmitting(false)
    if ('motivo' in result) {
      setError(result.motivo)
      return
    }
    onCreated()
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
              <p className="text-sm font-semibold text-slate-900">Crear turno manualmente</p>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Cerrar">
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3.5 p-5">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Cliente" value={nombre} onChange={setNombre} placeholder="Nombre y apellido" />
                <Input label="WhatsApp" value={whatsapp} onChange={setWhatsapp} placeholder="11 2233-4455" />
              </div>
              <Input label="Email (opcional)" value={email} onChange={setEmail} placeholder="cliente@email.com" />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Servicio</FieldLabel>
                  <select
                    value={servicioId}
                    onChange={(e) => {
                      setServicioId(e.target.value)
                      setHora(null)
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} — {formatPrice(s.price)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Barbero</FieldLabel>
                  <select
                    value={barberoId}
                    onChange={(e) => {
                      setBarberoId(e.target.value)
                      setHora(null)
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    {barberos.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {servicioId === 'corte' && (
                <div>
                  <FieldLabel>Estilo (opcional)</FieldLabel>
                  <select
                    value={estilo}
                    onChange={(e) => setEstilo(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">Sin especificar</option>
                    {HAIRCUTS.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <FieldLabel>Fecha</FieldLabel>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => {
                    setFecha(e.target.value)
                    setHora(null)
                  }}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <FieldLabel>Horario</FieldLabel>
                {horarios.length === 0 ? (
                  <p className="text-xs text-slate-500">No hay horarios disponibles para esa combinación de servicio/barbero/fecha.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {horarios.map((h) => (
                      <button
                        key={h}
                        onClick={() => setHora(h)}
                        className={`rounded-md border px-2.5 py-1.5 text-xs font-medium ${
                          hora === h ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <FieldLabel>Notas (opcional)</FieldLabel>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={confirmarYaPagado} onChange={(e) => setConfirmarYaPagado(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                Marcar como confirmado (turno de mostrador, sin cobrar seña online)
              </label>

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
                {submitting ? 'Creando…' : 'Crear turno'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">{children}</p>
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
    </div>
  )
}
