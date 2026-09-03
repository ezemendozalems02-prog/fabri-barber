'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/booking-data'
import { listBarberos } from '@/lib/actions/barberos'
import { getDashboardMetrics, getAgendaHoyPreview } from '@/lib/actions/dashboard'
import { useSession } from '@/lib/services/auth'
import type { Barbero, Turno } from '@/lib/types'
import { useServices } from '@/components/catalog-provider'
import {
  AlertIcon,
  CalendarClockIcon,
  CreditCardIcon,
  PlusIcon,
  ScissorsIcon,
  TrendingUpIcon,
  UsersIcon,
} from '@/components/icons'
import { TurnoDetailSheet } from '@/components/admin/turno-detail-sheet'
import { TurnoFormModal } from '@/components/admin/turno-form-modal'

export default function AdminDashboardPage() {
  const { user } = useSession()
  const SERVICES = useServices()
  const [metrics, setMetrics] = useState<Awaited<ReturnType<typeof getDashboardMetrics>> | null>(null)
  const [agendaHoy, setAgendaHoy] = useState<Turno[]>([])
  const [barberos, setBarberos] = useState<Barbero[]>([])
  const [selectedTurno, setSelectedTurno] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  async function refresh() {
    const [m, agenda, b] = await Promise.all([getDashboardMetrics(), getAgendaHoyPreview(6), listBarberos()])
    setMetrics(m)
    setAgendaHoy(agenda)
    setBarberos(b)
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Resumen de la barbería</h1>
          <p className="mt-1 text-sm text-slate-500">Esto es lo que está pasando hoy en FABRI BARBER.</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Nuevo turno
        </button>
      </div>

      {metrics && (
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            label="Turnos de hoy"
            value={String(metrics.turnosHoy)}
            delta={metrics.deltaTurnos}
            icon={<CalendarClockIcon className="h-4 w-4" />}
          />
          <MetricCard label="Ventas de hoy" value={formatPrice(metrics.ventasHoy)} icon={<TrendingUpIcon className="h-4 w-4" />} />
          <MetricCard label="Clientes nuevos" value={String(metrics.clientesNuevosHoy)} icon={<UsersIcon className="h-4 w-4" />} />
          <MetricCard label="Servicios realizados" value={String(metrics.serviciosRealizadosHoy)} icon={<ScissorsIcon className="h-4 w-4" />} />
          <MetricCard label="Señas cobradas" value={formatPrice(metrics.señasCobradasHoy)} icon={<CreditCardIcon className="h-4 w-4" />} />
          <MetricCard label="Ingresos del mes" value={formatPrice(metrics.ingresosDelMes)} icon={<TrendingUpIcon className="h-4 w-4" />} accent />
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Agenda de hoy</h2>
            <Link href="/admin/agenda" className="text-xs font-medium text-blue-600 hover:underline">
              Ver agenda completa →
            </Link>
          </div>
          {agendaHoy.length === 0 ? (
            <p className="mt-6 py-8 text-center text-sm text-slate-400">Todavía no hay turnos para hoy.</p>
          ) : (
            <ul className="mt-4 flex flex-col divide-y divide-slate-100">
              {agendaHoy.map((t) => {
                const servicio = SERVICES.find((s) => s.id === t.servicio_id)
                const barbero = barberos.find((b) => b.id === t.barbero_id)
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => setSelectedTurno(t.id)}
                      className="flex w-full items-center gap-3 py-3 text-left hover:bg-slate-50"
                    >
                      <span className="w-14 flex-shrink-0 font-mono text-sm font-medium text-slate-700">{t.hora_inicio}</span>
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-slate-900">{t.cliente.nombre}</span>
                        <span className="block text-xs text-slate-500">
                          {servicio?.title} · {barbero?.nombre}
                        </span>
                      </span>
                      <span className="text-xs font-medium text-slate-400">{formatPrice(t.precio_total)}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {metrics && metrics.señasPendientes > 0 && (
            <AlertCard
              title="Señas pendientes"
              description={`${metrics.señasPendientes} turno(s) esperando confirmación de pago.`}
              href="/admin/turnos"
              tone="amber"
            />
          )}
          {metrics && metrics.pagosRechazados > 0 && (
            <AlertCard
              title="Pagos rechazados"
              description={`${metrics.pagosRechazados} intento(s) de pago rechazado.`}
              href="/admin/pagos"
              tone="red"
            />
          )}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">Accesos rápidos</p>
            <div className="mt-3 flex flex-col gap-2">
              <QuickLink href="/admin/turnos" label="Ver todos los turnos" />
              <QuickLink href="/admin/clientes" label="Gestionar clientes" />
              {user?.rol === 'admin' && <QuickLink href="/admin/reportes" label="Ver reportes" />}
            </div>
          </div>
        </div>
      </div>

      <TurnoDetailSheet turnoId={selectedTurno} onClose={() => setSelectedTurno(null)} onChanged={refresh} />
      <TurnoFormModal open={formOpen} onClose={() => setFormOpen(false)} onCreated={refresh} />
    </div>
  )
}

function MetricCard({
  label,
  value,
  delta,
  icon,
  accent,
}: {
  label: string
  value: string
  delta?: number
  icon: React.ReactNode
  accent?: boolean
}) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? 'border-blue-200 bg-blue-50/50' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">{icon}</span>
        {typeof delta === 'number' && (
          <span className={`text-xs font-medium ${delta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {delta >= 0 ? '+' : ''}
            {delta} vs. ayer
          </span>
        )}
      </div>
      <p className="mt-3 text-xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{label}</p>
    </div>
  )
}

function AlertCard({
  title,
  description,
  href,
  tone,
}: {
  title: string
  description: string
  href: string
  tone: 'amber' | 'red'
}) {
  const tones = {
    amber: 'border-amber-200 bg-amber-50 text-amber-800',
    red: 'border-red-200 bg-red-50 text-red-800',
  }
  return (
    <Link href={href} className={`flex items-start gap-2.5 rounded-xl border p-4 transition-opacity hover:opacity-90 ${tones[tone]}`}>
      <AlertIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs opacity-80">{description}</span>
      </span>
    </Link>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-blue-300 hover:text-blue-700">
      {label}
    </Link>
  )
}
