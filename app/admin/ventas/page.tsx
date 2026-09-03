'use client'

import { useEffect, useMemo, useState } from 'react'
import { formatPrice } from '@/lib/booking-data'
import { listPedidos } from '@/lib/actions/pedidos'
import { listTurnos } from '@/lib/actions/turnos'
import { SERVICES } from '@/lib/site-data'
import type { Pedido, Turno } from '@/lib/types'

type Periodo = 'hoy' | 'semana' | 'mes' | 'todo'

function inPeriod(dateStr: string, periodo: Periodo) {
  if (periodo === 'todo') return true
  const d = new Date(dateStr)
  const now = new Date()
  if (periodo === 'hoy') return d.toDateString() === now.toDateString()
  if (periodo === 'semana') {
    const weekAgo = new Date(now)
    weekAgo.setDate(now.getDate() - 7)
    return d >= weekAgo
  }
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

const PERIODO_LABEL: Record<Periodo, string> = { hoy: 'Hoy', semana: 'Últimos 7 días', mes: 'Este mes', todo: 'Todo' }

export default function VentasPage() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState<Periodo>('semana')

  useEffect(() => {
    Promise.all([listTurnos(), listPedidos()]).then(([t, p]) => {
      setTurnos(t)
      setPedidos(p)
      setLoading(false)
    })
  }, [])

  const turnosFacturables = useMemo(
    () =>
      turnos.filter(
        (t) => (t.estado_turno === 'confirmado' || t.estado_turno === 'completado') && inPeriod(t.fecha, periodo),
      ),
    [turnos, periodo],
  )
  const pedidosPeriodo = useMemo(() => pedidos.filter((p) => inPeriod(p.created_at, periodo)), [pedidos, periodo])

  const totalServicios = turnosFacturables.reduce((sum, t) => sum + t.precio_total, 0)
  const totalProductos = pedidosPeriodo.reduce((sum, p) => sum + p.total, 0)

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Ventas</h1>
          <p className="mt-1 text-sm text-slate-500">Servicios y productos vendidos, por período.</p>
        </div>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value as Periodo)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
        >
          {Object.entries(PERIODO_LABEL).map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Servicios ({turnosFacturables.length})</p>
          <p className="mt-1 text-2xl font-semibold text-blue-600">{formatPrice(totalServicios)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Productos ({pedidosPeriodo.length})</p>
          <p className="mt-1 text-2xl font-semibold text-violet-600">{formatPrice(totalProductos)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total {PERIODO_LABEL[periodo].toLowerCase()}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{formatPrice(totalServicios + totalProductos)}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-900">Turnos facturados</p>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-4 py-2.5 font-medium">Cliente</th>
                    <th className="px-4 py-2.5 font-medium">Servicio</th>
                    <th className="px-4 py-2.5 font-medium">Fecha</th>
                    <th className="px-4 py-2.5 font-medium">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-xs text-slate-400">Cargando…</td>
                    </tr>
                  ) : turnosFacturables.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-xs text-slate-400">Sin ventas de servicios en este período.</td>
                    </tr>
                  ) : (
                    turnosFacturables.map((t) => (
                      <tr key={t.id}>
                        <td className="px-4 py-2.5 text-slate-700">{t.cliente.nombre}</td>
                        <td className="px-4 py-2.5 text-slate-700">{SERVICES.find((s) => s.id === t.servicio_id)?.title ?? t.servicio_id}</td>
                        <td className="px-4 py-2.5 text-slate-500">{t.fecha}</td>
                        <td className="px-4 py-2.5 font-medium text-slate-900">{formatPrice(t.precio_total)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-900">Pedidos de productos</p>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-4 py-2.5 font-medium">Cliente</th>
                    <th className="px-4 py-2.5 font-medium">Items</th>
                    <th className="px-4 py-2.5 font-medium">Fecha</th>
                    <th className="px-4 py-2.5 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-xs text-slate-400">Cargando…</td>
                    </tr>
                  ) : pedidosPeriodo.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-xs text-slate-400">Sin pedidos en este período.</td>
                    </tr>
                  ) : (
                    pedidosPeriodo.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-2.5 text-slate-700">{p.cliente_nombre}</td>
                        <td className="px-4 py-2.5 text-slate-500">{p.items.reduce((n, i) => n + i.cantidad, 0)} u.</td>
                        <td className="px-4 py-2.5 text-slate-500">{new Date(p.created_at).toLocaleDateString('es-AR')}</td>
                        <td className="px-4 py-2.5 font-medium text-slate-900">{formatPrice(p.total)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
