'use client'

import { useEffect, useMemo, useState } from 'react'
import { formatPrice } from '@/lib/booking-data'
import { listBarberos } from '@/lib/actions/barberos'
import { listClientes, type ClienteResumen } from '@/lib/actions/clientes'
import { listPedidos } from '@/lib/actions/pedidos'
import { listTurnos } from '@/lib/actions/turnos'
import { SERVICES } from '@/lib/site-data'
import type { Barbero, Pedido, Turno } from '@/lib/types'

type Rango = 'hoy' | 'ayer' | '7dias' | 'mes' | 'personalizado'

function toKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

function rangoFechas(rango: Rango, desde: string, hasta: string) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  if (rango === 'hoy') return { desde: toKey(hoy), hasta: toKey(hoy) }
  if (rango === 'ayer') {
    const ayer = new Date(hoy)
    ayer.setDate(ayer.getDate() - 1)
    return { desde: toKey(ayer), hasta: toKey(ayer) }
  }
  if (rango === '7dias') {
    const inicio = new Date(hoy)
    inicio.setDate(inicio.getDate() - 6)
    return { desde: toKey(inicio), hasta: toKey(hoy) }
  }
  if (rango === 'mes') {
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    return { desde: toKey(inicio), hasta: toKey(hoy) }
  }
  return { desde: desde || toKey(hoy), hasta: hasta || toKey(hoy) }
}

const RANGO_LABEL: Record<Rango, string> = { hoy: 'Hoy', ayer: 'Ayer', '7dias': 'Últimos 7 días', mes: 'Este mes', personalizado: 'Personalizado' }

export default function ReportesPage() {
  const [rango, setRango] = useState<Rango>('7dias')
  const [desdeInput, setDesdeInput] = useState(toKey(new Date()))
  const [hastaInput, setHastaInput] = useState(toKey(new Date()))
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [barberos, setBarberos] = useState<Barbero[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [clientes, setClientes] = useState<ClienteResumen[]>([])
  const [loading, setLoading] = useState(true)

  const { desde, hasta } = rangoFechas(rango, desdeInput, hastaInput)

  function refresh() {
    setLoading(true)
    Promise.all([listTurnos({ fechaDesde: desde, fechaHasta: hasta }), listBarberos(), listPedidos(), listClientes()]).then(
      ([t, b, p, c]) => {
        setTurnos(t)
        setBarberos(b)
        setPedidos(p)
        setClientes(c)
        setLoading(false)
      },
    )
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desde, hasta])

  const facturables = useMemo(() => turnos.filter((t) => t.estado_turno === 'confirmado' || t.estado_turno === 'completado'), [turnos])
  const cancelados = useMemo(() => turnos.filter((t) => t.estado_turno === 'cancelado'), [turnos])
  const ingresosServicios = facturables.reduce((sum, t) => sum + t.precio_total, 0)
  const ingresosProductos = pedidos
    .filter((p) => p.created_at.slice(0, 10) >= desde && p.created_at.slice(0, 10) <= hasta)
    .reduce((sum, p) => sum + p.total, 0)

  const clientesNuevos = useMemo(
    () => clientes.filter((c) => c.created_at.slice(0, 10) >= desde && c.created_at.slice(0, 10) <= hasta).length,
    [clientes, desde, hasta],
  )
  const clientesRecurrentes = useMemo(() => {
    const idsEnRango = new Set(turnos.map((t) => t.cliente.id))
    return clientes.filter((c) => idsEnRango.has(c.id) && c.cantidad_turnos > 1).length
  }, [clientes, turnos])

  const rankingServicios = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>()
    facturables.forEach((t) => {
      const cur = map.get(t.servicio_id) ?? { count: 0, total: 0 }
      cur.count += 1
      cur.total += t.precio_total
      map.set(t.servicio_id, cur)
    })
    return Array.from(map.entries())
      .map(([id, v]) => ({ id, nombre: SERVICES.find((s) => s.id === id)?.title ?? id, ...v }))
      .sort((a, b) => b.count - a.count)
  }, [facturables])

  const rankingProductos = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>()
    pedidos
      .filter((p) => p.created_at.slice(0, 10) >= desde && p.created_at.slice(0, 10) <= hasta)
      .forEach((p) => {
        p.items.forEach((i) => {
          const cur = map.get(i.nombre) ?? { count: 0, total: 0 }
          cur.count += i.cantidad
          cur.total += i.precio * i.cantidad
          map.set(i.nombre, cur)
        })
      })
    return Array.from(map.entries())
      .map(([nombre, v]) => ({ nombre, ...v }))
      .sort((a, b) => b.count - a.count)
  }, [pedidos, desde, hasta])

  const rendimientoBarberos = useMemo(
    () =>
      barberos
        .map((b) => {
          const propios = facturables.filter((t) => t.barbero_id === b.id)
          return { barbero: b, turnos: propios.length, ingresos: propios.reduce((sum, t) => sum + t.precio_total, 0) }
        })
        .sort((a, b) => b.ingresos - a.ingresos),
    [barberos, facturables],
  )

  const maxServicio = Math.max(1, ...rankingServicios.map((s) => s.count))
  const maxProducto = Math.max(1, ...rankingProductos.map((p) => p.count))

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Reportes</h1>
          <p className="mt-1 text-sm text-slate-500">Ingresos, turnos, servicios y rendimiento por barbero.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={rango} onChange={(e) => setRango(e.target.value as Rango)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">
            {Object.entries(RANGO_LABEL).map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </select>
          {rango === 'personalizado' && (
            <>
              <input type="date" value={desdeInput} onChange={(e) => setDesdeInput(e.target.value)} className="rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-600" />
              <input type="date" value={hastaInput} onChange={(e) => setHastaInput(e.target.value)} className="rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-600" />
            </>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Ingresos totales" value={formatPrice(ingresosServicios + ingresosProductos)} tone="blue" />
        <StatCard label="Turnos atendidos/confirmados" value={String(facturables.length)} tone="slate" />
        <StatCard label="Cancelaciones" value={String(cancelados.length)} tone="red" />
        <StatCard label="Clientes nuevos" value={`${clientesNuevos} nuevos · ${clientesRecurrentes} recurrentes`} tone="violet" small />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RankingCard title="Servicios más vendidos" loading={loading} empty={rankingServicios.length === 0}>
          {rankingServicios.map((s) => (
            <BarRow key={s.id} label={s.nombre} count={s.count} total={formatPrice(s.total)} max={maxServicio} />
          ))}
        </RankingCard>

        <RankingCard title="Ranking de productos" loading={loading} empty={rankingProductos.length === 0}>
          {rankingProductos.map((p) => (
            <BarRow key={p.nombre} label={p.nombre} count={p.count} total={formatPrice(p.total)} max={maxProducto} />
          ))}
        </RankingCard>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-slate-900">Rendimiento por barbero</p>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-2.5 font-medium">Barbero</th>
                <th className="px-4 py-2.5 font-medium">Turnos</th>
                <th className="px-4 py-2.5 font-medium">Ingresos generados</th>
                <th className="px-4 py-2.5 font-medium">Comisión estimada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-xs text-slate-400">Cargando…</td>
                </tr>
              ) : rendimientoBarberos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-xs text-slate-400">Sin datos en este período.</td>
                </tr>
              ) : (
                rendimientoBarberos.map(({ barbero, turnos: t, ingresos }) => {
                  const comision =
                    barbero.comision_tipo === 'porcentaje' ? Math.round((ingresos * barbero.comision_valor) / 100) : Math.min(barbero.comision_valor * t, ingresos)
                  return (
                    <tr key={barbero.id}>
                      <td className="px-4 py-2.5 font-medium text-slate-900">{barbero.nombre}</td>
                      <td className="px-4 py-2.5 text-slate-700">{t}</td>
                      <td className="px-4 py-2.5 text-slate-700">{formatPrice(ingresos)}</td>
                      <td className="px-4 py-2.5 font-medium text-blue-600">{formatPrice(comision)}</td>
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

function StatCard({ label, value, tone, small }: { label: string; value: string; tone: 'blue' | 'slate' | 'red' | 'violet'; small?: boolean }) {
  const tones: Record<string, string> = { blue: 'text-blue-600', slate: 'text-slate-900', red: 'text-red-600', violet: 'text-violet-600' }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 font-semibold ${tones[tone]} ${small ? 'text-sm' : 'text-2xl'}`}>{value}</p>
    </div>
  )
}

function RankingCard({ title, loading, empty, children }: { title: string; loading: boolean; empty: boolean; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-900">{title}</p>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        {loading ? (
          <p className="py-6 text-center text-xs text-slate-400">Cargando…</p>
        ) : empty ? (
          <p className="py-6 text-center text-xs text-slate-400">Sin datos en este período.</p>
        ) : (
          <div className="flex flex-col gap-2.5">{children}</div>
        )}
      </div>
    </div>
  )
}

function BarRow({ label, count, total, max }: { label: string; count: number; total: string; max: number }) {
  const pct = Math.max(4, Math.round((count / max) * 100))
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-400">
          {count} · {total}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
