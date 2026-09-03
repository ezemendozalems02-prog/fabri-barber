'use client'

import { useEffect, useMemo, useState } from 'react'
import { formatPrice } from '@/lib/booking-data'
import { listTurnos } from '@/lib/actions/turnos'
import type { EstadoPago, Turno } from '@/lib/types'
import { useServices } from '@/components/catalog-provider'

const ESTADO_PAGO_LABEL: Record<EstadoPago, string> = { pendiente: 'Pendiente', aprobado: 'Aprobado', rechazado: 'Rechazado' }
const ESTADO_PAGO_BADGE: Record<EstadoPago, string> = {
  pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  aprobado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rechazado: 'bg-red-50 text-red-700 border-red-200',
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export default function PagosPage() {
  const SERVICES = useServices()
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [loading, setLoading] = useState(true)
  const [estadoPago, setEstadoPago] = useState<EstadoPago | ''>('')

  function refresh() {
    setLoading(true)
    listTurnos({ estadoPago: estadoPago || undefined }).then((data) => {
      setTurnos(data.filter((t) => t.estado_turno !== 'cancelado'))
      setLoading(false)
    })
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoPago])

  const hoy = todayKey()
  const señasHoy = useMemo(
    () => turnos.filter((t) => t.fecha === hoy && t.estado_pago === 'aprobado').reduce((sum, t) => sum + t.monto_seña, 0),
    [turnos, hoy],
  )
  const pendientes = useMemo(() => turnos.filter((t) => t.estado_pago === 'pendiente'), [turnos])
  const rechazados = useMemo(() => turnos.filter((t) => t.estado_pago === 'rechazado'), [turnos])

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Pagos</h1>
        <p className="mt-1 text-sm text-slate-500">Estado de señas y preparación para Mercado Pago.</p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard label="Señas cobradas hoy" value={formatPrice(señasHoy)} tone="emerald" />
        <SummaryCard label="Pagos pendientes" value={String(pendientes.length)} tone="amber" />
        <SummaryCard label="Pagos rechazados" value={String(rechazados.length)} tone="red" />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <select
          value={estadoPago}
          onChange={(e) => setEstadoPago(e.target.value as EstadoPago | '')}
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600"
        >
          <option value="">Todos los pagos</option>
          {Object.entries(ESTADO_PAGO_LABEL).map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Servicio</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Seña</th>
                <th className="px-4 py-3 font-medium">ID de pago</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                    Cargando pagos…
                  </td>
                </tr>
              ) : turnos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                    No hay pagos que coincidan con el filtro.
                  </td>
                </tr>
              ) : (
                turnos.map((t) => {
                  const servicio = SERVICES.find((s) => s.id === t.servicio_id)
                  return (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{t.cliente.nombre}</p>
                        <p className="text-xs text-slate-400">{t.cliente.whatsapp}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{servicio?.title ?? t.servicio_id}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {t.fecha} · {t.hora_inicio}
                      </td>
                      <td className="px-4 py-3 font-medium text-blue-600">{formatPrice(t.monto_seña)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{t.payment_id ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${ESTADO_PAGO_BADGE[t.estado_pago]}`}>
                          {ESTADO_PAGO_LABEL[t.estado_pago]}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, tone }: { label: string; value: string; tone: 'emerald' | 'amber' | 'red' }) {
  const tones: Record<string, string> = {
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${tones[tone]}`}>{value}</p>
    </div>
  )
}
