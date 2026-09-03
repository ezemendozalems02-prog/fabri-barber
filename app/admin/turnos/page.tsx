'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { formatPrice } from '@/lib/booking-data'
import { listBarberos } from '@/lib/actions/barberos'
import { listTurnos, type TurnoFiltros } from '@/lib/actions/turnos'
import type { Barbero, EstadoPago, EstadoTurno, Turno } from '@/lib/types'
import { useServices } from '@/components/catalog-provider'
import { PlusIcon, SearchIcon } from '@/components/icons'
import { TurnoDetailSheet } from '@/components/admin/turno-detail-sheet'
import { TurnoFormModal } from '@/components/admin/turno-form-modal'

const ESTADO_TURNO_LABEL: Record<EstadoTurno, string> = {
  pendiente_pago: 'Pendiente de pago',
  'seña_pagada': 'Seña pagada',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  completado: 'Completado',
}

const ESTADO_TURNO_BADGE: Record<EstadoTurno, string> = {
  pendiente_pago: 'bg-amber-50 text-amber-700 border-amber-200',
  'seña_pagada': 'bg-blue-50 text-blue-700 border-blue-200',
  confirmado: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelado: 'bg-red-50 text-red-700 border-red-200',
  completado: 'bg-violet-50 text-violet-700 border-violet-200',
}

const ESTADO_PAGO_LABEL: Record<EstadoPago, string> = { pendiente: 'Pendiente', aprobado: 'Aprobado', rechazado: 'Rechazado' }

function TurnosPageInner() {
  const searchParams = useSearchParams()
  const SERVICES = useServices()
  const [filtros, setFiltros] = useState<TurnoFiltros>({})
  const [busquedaInput, setBusquedaInput] = useState('')
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [barberos, setBarberos] = useState<Barbero[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTurno, setSelectedTurno] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    const fromQuery = searchParams.get('turno')
    if (fromQuery) setSelectedTurno(fromQuery)
  }, [searchParams])

  useEffect(() => {
    const t = setTimeout(() => setFiltros((f) => ({ ...f, busqueda: busquedaInput })), 250)
    return () => clearTimeout(t)
  }, [busquedaInput])

  useEffect(() => {
    listBarberos().then(setBarberos)
  }, [])

  function refresh() {
    setLoading(true)
    listTurnos(filtros).then((data) => {
      setTurnos(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros])

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Turnos</h1>
          <p className="mt-1 text-sm text-slate-500">{turnos.length} turno(s) según los filtros aplicados.</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Nuevo turno
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={busquedaInput}
            onChange={(e) => setBusquedaInput(e.target.value)}
            placeholder="Buscar por nombre o WhatsApp"
            className="w-56 rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-blue-500"
          />
        </div>
        <input
          type="date"
          value={filtros.fecha ?? ''}
          onChange={(e) => setFiltros((f) => ({ ...f, fecha: e.target.value || undefined }))}
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 outline-none focus:border-blue-500"
        />
        <select
          value={filtros.servicioId ?? ''}
          onChange={(e) => setFiltros((f) => ({ ...f, servicioId: e.target.value || undefined }))}
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600"
        >
          <option value="">Todos los servicios</option>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        {barberos.length > 1 && (
          <select
            value={filtros.barberoId ?? ''}
            onChange={(e) => setFiltros((f) => ({ ...f, barberoId: e.target.value || undefined }))}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600"
          >
            <option value="">Todos los barberos</option>
            {barberos.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre}
              </option>
            ))}
          </select>
        )}
        <select
          value={filtros.estadoTurno ?? ''}
          onChange={(e) => setFiltros((f) => ({ ...f, estadoTurno: (e.target.value || undefined) as EstadoTurno | undefined }))}
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600"
        >
          <option value="">Todos los estados</option>
          {Object.entries(ESTADO_TURNO_LABEL).map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
        <select
          value={filtros.estadoPago ?? ''}
          onChange={(e) => setFiltros((f) => ({ ...f, estadoPago: (e.target.value || undefined) as EstadoPago | undefined }))}
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600"
        >
          <option value="">Todos los pagos</option>
          {Object.entries(ESTADO_PAGO_LABEL).map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
        {(filtros.fecha || filtros.servicioId || filtros.barberoId || filtros.estadoTurno || filtros.estadoPago || filtros.busqueda) && (
          <button
            onClick={() => {
              setFiltros({})
              setBusquedaInput('')
            }}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Servicio</th>
                <th className="px-4 py-3 font-medium">Barbero</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Hora</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Seña</th>
                <th className="px-4 py-3 font-medium">Saldo</th>
                <th className="px-4 py-3 font-medium">Pago</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-10 text-center text-sm text-slate-400">
                    Cargando turnos…
                  </td>
                </tr>
              ) : turnos.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-10 text-center text-sm text-slate-400">
                    No hay turnos que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                turnos.map((t) => {
                  const servicio = SERVICES.find((s) => s.id === t.servicio_id)
                  const barbero = barberos.find((b) => b.id === t.barbero_id)
                  return (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{t.cliente.nombre}</p>
                        <p className="text-xs text-slate-400">{t.cliente.whatsapp}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{servicio?.title ?? t.servicio_id}</td>
                      <td className="px-4 py-3 text-slate-700">{barbero?.nombre ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-700">{t.fecha}</td>
                      <td className="px-4 py-3 text-slate-700">{t.hora_inicio}</td>
                      <td className="px-4 py-3 text-slate-700">{formatPrice(t.precio_total)}</td>
                      <td className="px-4 py-3 text-blue-600">{formatPrice(t.monto_seña)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatPrice(t.saldo)}</td>
                      <td className="px-4 py-3 text-slate-700">{ESTADO_PAGO_LABEL[t.estado_pago]}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${ESTADO_TURNO_BADGE[t.estado_turno]}`}>
                          {ESTADO_TURNO_LABEL[t.estado_turno]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setSelectedTurno(t.id)} className="text-xs font-medium text-blue-600 hover:underline">
                          Ver
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TurnoDetailSheet turnoId={selectedTurno} onClose={() => setSelectedTurno(null)} onChanged={refresh} />
      <TurnoFormModal open={formOpen} onClose={() => setFormOpen(false)} onCreated={refresh} />
    </div>
  )
}

export default function TurnosPage() {
  return (
    <Suspense>
      <TurnosPageInner />
    </Suspense>
  )
}
