'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { formatDateLong, formatPrice, generateAvailableSlots } from '@/lib/booking-data'
import { getBarbero } from '@/lib/actions/barberos'
import {
  cancelarTurno,
  confirmarTurno,
  marcarAtendido,
  actualizarNotasAdmin,
  reprogramarTurno,
  getOccupiedRangesForDate,
  getTurno,
} from '@/lib/actions/turnos'
import { HAIRCUTS } from '@/lib/site-data'
import type { Barbero, Turno } from '@/lib/types'
import { useServices } from '@/components/catalog-provider'
import { CalendarIcon, CheckIcon, WhatsappIcon, XIcon } from '@/components/icons'
import { SLOT_STATUS_META, type SlotStatus } from '@/lib/services/agenda'

function estadoPagoLabel(p: Turno['estado_pago']) {
  return { pendiente: 'Pendiente', aprobado: 'Aprobado', rechazado: 'Rechazado' }[p]
}

function turnoStatus(t: Turno): SlotStatus {
  if (t.estado_turno === 'completado') return 'completado'
  if (t.estado_turno === 'pendiente_pago' || t.estado_pago === 'pendiente') return 'pendiente_pago'
  return 'confirmado'
}

export function TurnoDetailSheet({
  turnoId,
  onClose,
  onChanged,
}: {
  turnoId: string | null
  onClose: () => void
  onChanged: () => void
}) {
  const SERVICES = useServices()
  const [turno, setTurno] = useState<Turno | null>(null)
  const [barbero, setBarbero] = useState<Barbero | null>(null)
  const [notas, setNotas] = useState('')
  const [reprogramando, setReprogramando] = useState(false)
  const [nuevaFecha, setNuevaFecha] = useState('')
  const [nuevaHora, setNuevaHora] = useState<string | null>(null)
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!turnoId) {
      setTurno(null)
      setBarbero(null)
      return
    }
    getTurno(turnoId).then((t) => {
      setTurno(t)
      setNotas(t?.notas_admin ?? '')
      setReprogramando(false)
      setNuevaFecha(t?.fecha ?? '')
      setNuevaHora(null)
      setError(null)
      if (t) getBarbero(t.barbero_id).then(setBarbero)
    })
  }, [turnoId])

  const servicio = turno ? SERVICES.find((s) => s.id === turno.servicio_id) : undefined
  const estilo = turno?.estilo_corte ? HAIRCUTS.find((h) => h.id === turno.estilo_corte) : undefined

  useEffect(() => {
    if (!turno || !nuevaFecha || !servicio) {
      setHorariosDisponibles([])
      return
    }
    let cancelled = false
    getOccupiedRangesForDate(nuevaFecha, turno.barbero_id, turno.id).then((occupied) => {
      if (cancelled) return
      const date = new Date(`${nuevaFecha}T00:00:00`)
      setHorariosDisponibles(generateAvailableSlots(servicio, date, occupied))
    })
    return () => {
      cancelled = true
    }
  }, [turno, nuevaFecha, servicio])

  async function refresh() {
    if (!turnoId) return
    const t = await getTurno(turnoId)
    setTurno(t)
    onChanged()
  }

  async function handleConfirmar() {
    if (!turno) return
    await confirmarTurno(turno.id)
    await refresh()
  }

  async function handleAtendido() {
    if (!turno) return
    await marcarAtendido(turno.id)
    await refresh()
  }

  async function handleCancelar() {
    if (!turno) return
    const motivo = window.prompt('Motivo de la cancelación (opcional):') ?? undefined
    await cancelarTurno(turno.id, motivo || undefined)
    await refresh()
  }

  async function handleGuardarNotas() {
    if (!turno) return
    await actualizarNotasAdmin(turno.id, notas)
    await refresh()
  }

  async function handleReprogramar() {
    if (!turno || !nuevaHora) return
    const result = await reprogramarTurno(turno.id, nuevaFecha, nuevaHora)
    if (!result.ok) {
      setError(result.motivo)
      return
    }
    setReprogramando(false)
    await refresh()
  }

  const status = turno ? turnoStatus(turno) : 'disponible'
  const meta = SLOT_STATUS_META[status]

  return (
    <AnimatePresence>
      {turno && (
        <motion.div className="fixed inset-0 z-[80] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="admin-light absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />
          <motion.div
            className="admin-light relative flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <p className="text-sm font-semibold text-slate-900">Detalle del turno</p>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Cerrar">
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{turno.cliente.nombre}</h3>
                <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${meta.bg} ${meta.text} ${meta.border}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{turno.cliente.whatsapp}</p>

              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <Field label="Servicio" value={servicio?.title ?? turno.servicio_id} />
                <Field label="Barbero" value={barbero?.nombre ?? '—'} />
                {estilo && <Field label="Estilo" value={estilo.title} />}
                <Field label="Fecha" value={formatDateLong(new Date(`${turno.fecha}T00:00:00`))} className="capitalize" />
                <Field label="Horario" value={`${turno.hora_inicio}–${turno.hora_fin}`} />
                <Field label="Estado de pago" value={estadoPagoLabel(turno.estado_pago)} />
              </dl>

              <div className="mt-4 rounded-xl border border-slate-200 p-4 text-sm">
                <Row label="Precio total" value={formatPrice(turno.precio_total)} />
                <Row label={`Seña (${turno.porcentaje_seña}%)`} value={formatPrice(turno.monto_seña)} highlight />
                <Row label="Saldo en el local" value={formatPrice(turno.saldo)} />
              </div>

              {turno.comentario && (
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Comentario del cliente</p>
                  <p className="mt-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{turno.comentario}</p>
                </div>
              )}

              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Notas internas</p>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder='Ej: "Prefiere degradé bajo", "Siempre pide barba"...'
                  rows={2}
                  className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
                {notas !== (turno.notas_admin ?? '') && (
                  <button onClick={handleGuardarNotas} className="mt-1.5 text-xs font-medium text-blue-600 hover:underline">
                    Guardar nota
                  </button>
                )}
              </div>

              {reprogramando && (
                <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Reprogramar turno</p>
                  <input
                    type="date"
                    value={nuevaFecha}
                    onChange={(e) => {
                      setNuevaFecha(e.target.value)
                      setNuevaHora(null)
                    }}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {horariosDisponibles.length === 0 ? (
                      <p className="text-xs text-slate-500">No hay horarios disponibles ese día.</p>
                    ) : (
                      horariosDisponibles.map((h) => (
                        <button
                          key={h}
                          onClick={() => setNuevaHora(h)}
                          className={`rounded-md border px-2.5 py-1.5 text-xs font-medium ${
                            nuevaHora === h ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                          }`}
                        >
                          {h}
                        </button>
                      ))
                    )}
                  </div>
                  {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setReprogramando(false)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-white">
                      Cancelar
                    </button>
                    <button
                      onClick={handleReprogramar}
                      disabled={!nuevaHora}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
                    >
                      Confirmar cambio
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-slate-200 p-4">
              {turno.estado_turno === 'pendiente_pago' && (
                <ActionButton onClick={handleConfirmar} icon={<CheckIcon className="h-3.5 w-3.5" />} label="Confirmar" tone="blue" />
              )}
              {turno.estado_turno !== 'completado' && turno.estado_turno !== 'cancelado' && (
                <ActionButton onClick={handleAtendido} icon={<CheckIcon className="h-3.5 w-3.5" />} label="Marcar atendido" tone="violet" />
              )}
              {turno.estado_turno !== 'cancelado' && (
                <ActionButton onClick={() => setReprogramando((v) => !v)} icon={<CalendarIcon className="h-3.5 w-3.5" />} label="Reprogramar" tone="slate" />
              )}
              {turno.estado_turno !== 'cancelado' && (
                <ActionButton onClick={handleCancelar} icon={<XIcon className="h-3.5 w-3.5" />} label="Cancelar" tone="red" />
              )}
              <a
                href={`https://wa.me/${turno.cliente.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
              >
                <WhatsappIcon className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className={`mt-0.5 font-medium text-slate-900 ${className ?? ''}`}>{value}</dd>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-slate-500">{label}</span>
      <span className={`font-medium ${highlight ? 'text-blue-600' : 'text-slate-900'}`}>{value}</span>
    </div>
  )
}

function ActionButton({
  onClick,
  icon,
  label,
  tone,
}: {
  onClick: () => void
  icon: React.ReactNode
  label: string
  tone: 'blue' | 'violet' | 'slate' | 'red'
}) {
  const tones: Record<string, string> = {
    blue: 'bg-blue-600 text-white hover:bg-blue-700',
    violet: 'bg-violet-600 text-white hover:bg-violet-700',
    slate: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    red: 'bg-red-50 text-red-600 hover:bg-red-100',
  }
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${tones[tone]}`}>
      {icon}
      {label}
    </button>
  )
}
