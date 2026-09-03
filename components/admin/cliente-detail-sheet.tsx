'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/booking-data'
import { agregarNotaCliente, getCliente, listNotasCliente, type ClienteResumen } from '@/lib/actions/clientes'
import { listTurnos } from '@/lib/actions/turnos'
import { SERVICES } from '@/lib/site-data'
import type { Cliente, NotaCliente, Turno } from '@/lib/types'
import { WhatsappIcon, XIcon } from '@/components/icons'

const ESTADO_TURNO_LABEL: Record<Turno['estado_turno'], string> = {
  pendiente_pago: 'Pendiente de pago',
  'seña_pagada': 'Seña pagada',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  completado: 'Completado',
}

const ESTADO_TURNO_BADGE: Record<Turno['estado_turno'], string> = {
  pendiente_pago: 'bg-amber-50 text-amber-700 border-amber-200',
  'seña_pagada': 'bg-blue-50 text-blue-700 border-blue-200',
  confirmado: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelado: 'bg-red-50 text-red-700 border-red-200',
  completado: 'bg-violet-50 text-violet-700 border-violet-200',
}

export function ClienteDetailSheet({
  clienteId,
  onClose,
}: {
  clienteId: string | null
  onClose: () => void
}) {
  const [cliente, setCliente] = useState<(Cliente & { created_at: string }) | null>(null)
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [notas, setNotas] = useState<NotaCliente[]>([])
  const [nuevaNota, setNuevaNota] = useState('')
  const [loading, setLoading] = useState(false)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!clienteId) {
      setCliente(null)
      return
    }
    setLoading(true)
    Promise.all([getCliente(clienteId), listTurnos({ clienteId }), listNotasCliente(clienteId)]).then(
      ([c, t, n]) => {
        setCliente(c)
        setTurnos(t)
        setNotas(n)
        setLoading(false)
      },
    )
    setNuevaNota('')
  }, [clienteId])

  async function handleAgregarNota() {
    if (!clienteId || !nuevaNota.trim()) return
    setGuardando(true)
    await agregarNotaCliente(clienteId, nuevaNota.trim())
    const n = await listNotasCliente(clienteId)
    setNotas(n)
    setNuevaNota('')
    setGuardando(false)
  }

  const totalGastado = turnos
    .filter((t) => t.estado_turno === 'confirmado' || t.estado_turno === 'completado')
    .reduce((sum, t) => sum + t.precio_total, 0)

  return (
    <AnimatePresence>
      {clienteId && (
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
              <p className="text-sm font-semibold text-slate-900">Ficha del cliente</p>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Cerrar">
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            {loading || !cliente ? (
              <div className="flex flex-1 items-center justify-center text-sm text-slate-400">Cargando…</div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-5">
                  <h3 className="text-lg font-semibold text-slate-900">{cliente.nombre}</h3>
                  <p className="mt-1 text-sm text-slate-500">{cliente.whatsapp}</p>
                  {cliente.email && <p className="text-sm text-slate-500">{cliente.email}</p>}
                  <p className="mt-1 text-xs text-slate-400">
                    Cliente desde {new Date(cliente.created_at).toLocaleDateString('es-AR')}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">Turnos</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{turnos.length}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">Total gastado</p>
                      <p className="mt-1 text-lg font-semibold text-blue-600">{formatPrice(totalGastado)}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Notas internas</p>
                    <div className="mt-1.5 flex flex-col gap-2">
                      {notas.length === 0 ? (
                        <p className="text-xs text-slate-400">Sin notas todavía.</p>
                      ) : (
                        notas.map((n) => (
                          <div key={n.id} className="rounded-lg bg-slate-50 p-2.5 text-sm text-slate-700">
                            {n.texto}
                            <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                              {new Date(n.created_at).toLocaleDateString('es-AR')}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input
                        value={nuevaNota}
                        onChange={(e) => setNuevaNota(e.target.value)}
                        placeholder='Ej: "prefiere degradé bajo"'
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleAgregarNota()}
                      />
                      <button
                        onClick={handleAgregarNota}
                        disabled={!nuevaNota.trim() || guardando}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Historial de turnos</p>
                    <div className="mt-1.5 flex flex-col gap-2">
                      {turnos.length === 0 ? (
                        <p className="text-xs text-slate-400">Todavía no tiene turnos.</p>
                      ) : (
                        turnos
                          .slice()
                          .reverse()
                          .map((t) => {
                            const servicio = SERVICES.find((s) => s.id === t.servicio_id)
                            return (
                              <div key={t.id} className="rounded-lg border border-slate-200 p-2.5 text-sm">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-slate-900">{servicio?.title ?? t.servicio_id}</p>
                                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${ESTADO_TURNO_BADGE[t.estado_turno]}`}>
                                    {ESTADO_TURNO_LABEL[t.estado_turno]}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-xs text-slate-500">
                                  {t.fecha} · {t.hora_inicio} · {formatPrice(t.precio_total)}
                                </p>
                              </div>
                            )
                          })
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-200 p-4">
                  <a
                    href={`https://wa.me/${cliente.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                  >
                    <WhatsappIcon className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
