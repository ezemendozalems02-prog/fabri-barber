'use client'

import { useEffect, useMemo, useState } from 'react'
import { formatPrice } from '@/lib/booking-data'
import { listBarberos } from '@/lib/actions/barberos'
import { getAgendaRangeData } from '@/lib/actions/agenda'
import { buildAgendaGrid, SLOT_STATUS_META } from '@/lib/services/agenda'
import type { Barbero, BloqueoHorario, Turno } from '@/lib/types'
import { useServices } from '@/components/catalog-provider'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@/components/icons'
import { TurnoDetailSheet } from '@/components/admin/turno-detail-sheet'
import { TurnoFormModal } from '@/components/admin/turno-form-modal'

type ViewMode = 'dia' | 'semana' | 'mes'

function toKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

function startOfWeek(d: Date) {
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function startOfMonthGrid(d: Date) {
  const first = new Date(d.getFullYear(), d.getMonth(), 1)
  return startOfWeek(first)
}

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function AgendaPage() {
  const [view, setView] = useState<ViewMode>('dia')
  const [current, setCurrent] = useState(new Date())
  const [barberoId, setBarberoId] = useState<string>('todos')
  const [barberos, setBarberos] = useState<Barbero[]>([])
  const [selectedTurno, setSelectedTurno] = useState<string | null>(null)
  const [formPreset, setFormPreset] = useState<{ fecha: string; hora?: string } | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    listBarberos().then(setBarberos)
  }, [])

  function refresh() {
    setTick((v) => v + 1)
  }

  function shift(amount: number) {
    const d = new Date(current)
    if (view === 'dia') d.setDate(d.getDate() + amount)
    else if (view === 'semana') d.setDate(d.getDate() + amount * 7)
    else d.setMonth(d.getMonth() + amount)
    setCurrent(d)
  }

  const effectiveBarbero = barberoId === 'todos' ? undefined : barberoId

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Agenda</h1>
          <p className="mt-1 text-sm text-slate-500">Martes a sábados · 10:00–19:00 · 13:00–14:00 bloqueado.</p>
        </div>
        <button
          onClick={() => setFormPreset({ fecha: toKey(current) })}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Nuevo turno
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {(['dia', 'semana', 'mes'] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                view === v ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => shift(-1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button onClick={() => setCurrent(new Date())} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            Hoy
          </button>
          <button onClick={() => shift(1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        {barberos.length > 1 && (
          <select
            value={barberoId}
            onChange={(e) => setBarberoId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
          >
            <option value="todos">Todos los barberos</option>
            {barberos.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
        {Object.entries(SLOT_STATUS_META).map(([key, meta]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        ))}
      </div>

      <div className="mt-5">
        {view === 'dia' && (
          <DayView
            date={current}
            barberoId={effectiveBarbero}
            tick={tick}
            onSelectTurno={setSelectedTurno}
            onSelectEmpty={(hora) => setFormPreset({ fecha: toKey(current), hora })}
          />
        )}
        {view === 'semana' && (
          <WeekView
            date={current}
            barberoId={effectiveBarbero}
            tick={tick}
            onSelectTurno={setSelectedTurno}
            onPickDay={(d) => {
              setCurrent(d)
              setView('dia')
            }}
          />
        )}
        {view === 'mes' && (
          <MonthView
            date={current}
            barberoId={effectiveBarbero}
            tick={tick}
            onPickDay={(d) => {
              setCurrent(d)
              setView('dia')
            }}
          />
        )}
      </div>

      <TurnoDetailSheet turnoId={selectedTurno} onClose={() => setSelectedTurno(null)} onChanged={refresh} />
      <TurnoFormModal
        open={!!formPreset}
        onClose={() => setFormPreset(null)}
        onCreated={refresh}
        presetFecha={formPreset?.fecha}
        presetHora={formPreset?.hora}
      />
    </div>
  )
}

function DayView({
  date,
  barberoId,
  tick,
  onSelectTurno,
  onSelectEmpty,
}: {
  date: Date
  barberoId?: string
  tick: number
  onSelectTurno: (id: string) => void
  onSelectEmpty: (hora: string) => void
}) {
  const fecha = toKey(date)
  const services = useServices()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{ turnos: Turno[]; bloqueos: BloqueoHorario[] }>({ turnos: [], bloqueos: [] })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getAgendaRangeData(fecha, fecha, barberoId).then((res) => {
      if (!cancelled) {
        setData(res)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [fecha, barberoId, tick])

  const dayOfWeek = date.getDay()
  const cerrado = dayOfWeek === 0 || dayOfWeek === 1

  if (cerrado) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
        La barbería no atiende los {dayOfWeek === 0 ? 'domingos' : 'lunes'}.
      </div>
    )
  }

  if (loading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">Cargando agenda…</div>
  }

  const grid = buildAgendaGrid(data.turnos, data.bloqueos, services)

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-3">
        <p className="text-sm font-semibold capitalize text-slate-900">
          {date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>
      <ul className="divide-y divide-slate-100">
        {grid.map((slot) => {
          const meta = SLOT_STATUS_META[slot.status]
          if (!slot.esInicio) {
            return (
              <li key={slot.hora} className={`flex items-stretch ${meta.bg}`}>
                <span className="w-16 flex-shrink-0 border-r border-white/60 px-4 py-1.5 font-mono text-xs text-slate-400">{slot.hora}</span>
                <span className="flex-1 px-4 py-1.5 text-xs italic text-slate-400">continúa…</span>
              </li>
            )
          }
          const servicio = slot.turno && services.find((s) => s.id === slot.turno!.servicio_id)
          return (
            <li key={slot.hora}>
              <button
                onClick={() => (slot.turno ? onSelectTurno(slot.turno.id) : slot.status === 'disponible' ? onSelectEmpty(slot.hora) : undefined)}
                disabled={slot.status === 'bloqueado'}
                className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors ${meta.bg} ${
                  slot.status === 'bloqueado' ? 'cursor-not-allowed' : 'hover:brightness-95'
                }`}
              >
                <span className="w-12 flex-shrink-0 font-mono text-sm font-semibold text-slate-700">{slot.hora}</span>
                <span className={`h-2 w-2 flex-shrink-0 rounded-full ${meta.dot}`} />
                {slot.turno ? (
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-900">{slot.turno.cliente.nombre}</span>
                    <span className="block text-xs text-slate-500">
                      {servicio?.title} · {meta.label}
                    </span>
                  </span>
                ) : slot.status === 'bloqueado' ? (
                  <span className="flex-1 text-sm text-slate-400">{slot.motivoBloqueo}</span>
                ) : (
                  <span className="flex-1 text-sm text-emerald-700">Disponible — click para crear turno</span>
                )}
                {slot.turno && <span className="text-xs font-medium text-slate-400">{formatPrice(slot.turno.precio_total)}</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function WeekView({
  date,
  barberoId,
  tick,
  onSelectTurno,
  onPickDay,
}: {
  date: Date
  barberoId?: string
  tick: number
  onSelectTurno: (id: string) => void
  onPickDay: (d: Date) => void
}) {
  const monday = startOfWeek(date)
  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        return d
      }),
    [monday.getTime()],
  )
  const rangeStart = toKey(days[0])
  const rangeEnd = toKey(days[6])
  const services = useServices()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{ turnos: Turno[]; bloqueos: BloqueoHorario[] }>({ turnos: [], bloqueos: [] })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getAgendaRangeData(rangeStart, rangeEnd, barberoId).then((res) => {
      if (!cancelled) {
        setData(res)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [rangeStart, rangeEnd, barberoId, tick])

  if (loading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">Cargando agenda…</div>
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {days.map((d) => {
        const dow = d.getDay()
        const cerrado = dow === 0 || dow === 1
        if (cerrado) return null
        const fecha = toKey(d)
        const turnosDelDia = data.turnos.filter((t) => t.fecha === fecha)
        const bloqueosDelDia = data.bloqueos.filter((b) => b.fecha === fecha)
        const grid = buildAgendaGrid(turnosDelDia, bloqueosDelDia, services).filter((s) => s.esInicio && s.turno)

        return (
          <div key={fecha} className="flex flex-col rounded-xl border border-slate-200 bg-white">
            <button onClick={() => onPickDay(d)} className="border-b border-slate-100 px-3 py-2.5 text-left hover:bg-slate-50">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{WEEKDAY_LABELS[(dow + 6) % 7]}</p>
              <p className="text-sm font-semibold text-slate-900">{d.getDate()}</p>
            </button>
            <div className="flex-1 divide-y divide-slate-50">
              {grid.length === 0 ? (
                <p className="px-3 py-4 text-center text-xs text-slate-300">Sin turnos</p>
              ) : (
                grid.map((slot) => {
                  const meta = SLOT_STATUS_META[slot.status]
                  return (
                    <button
                      key={slot.turno!.id}
                      onClick={() => onSelectTurno(slot.turno!.id)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50"
                    >
                      <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${meta.dot}`} />
                      <span className="w-10 flex-shrink-0 font-mono text-[11px] text-slate-500">{slot.hora}</span>
                      <span className="truncate text-xs font-medium text-slate-700">{slot.turno!.cliente.nombre}</span>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MonthView({
  date,
  barberoId,
  tick,
  onPickDay,
}: {
  date: Date
  barberoId?: string
  tick: number
  onPickDay: (d: Date) => void
}) {
  const gridStart = startOfMonthGrid(date)
  const cells = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => {
        const d = new Date(gridStart)
        d.setDate(gridStart.getDate() + i)
        return d
      }),
    [gridStart.getTime()],
  )
  const month = date.getMonth()
  const rangeStart = toKey(cells[0])
  const rangeEnd = toKey(cells[41])

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{ turnos: Turno[]; bloqueos: BloqueoHorario[] }>({ turnos: [], bloqueos: [] })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getAgendaRangeData(rangeStart, rangeEnd, barberoId).then((res) => {
      if (!cancelled) {
        setData(res)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [rangeStart, rangeEnd, barberoId, tick])

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
        {WEEKDAY_LABELS.map((l) => (
          <div key={l} className="py-2">
            {l}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d) => {
          const dow = d.getDay()
          const cerrado = dow === 0 || dow === 1
          const inMonth = d.getMonth() === month
          const fecha = toKey(d)
          const turnos = loading || cerrado ? [] : data.turnos.filter((t) => t.fecha === fecha && t.estado_turno !== 'cancelado')
          const counts = {
            confirmado: turnos.filter((t) => t.estado_turno === 'confirmado').length,
            pendiente_pago: turnos.filter((t) => t.estado_turno === 'pendiente_pago' || t.estado_pago === 'pendiente').length,
            completado: turnos.filter((t) => t.estado_turno === 'completado').length,
          }

          return (
            <button
              key={fecha}
              onClick={() => !cerrado && onPickDay(d)}
              disabled={cerrado}
              className={`flex min-h-[84px] flex-col items-start gap-1 border-b border-r border-slate-100 p-2 text-left last:border-r-0 ${
                cerrado ? 'cursor-not-allowed bg-slate-50' : 'hover:bg-blue-50/50'
              } ${!inMonth ? 'opacity-40' : ''}`}
            >
              <span className={`text-xs font-medium ${cerrado ? 'text-slate-300' : 'text-slate-700'}`}>{d.getDate()}</span>
              {!cerrado && (
                <div className="flex flex-wrap gap-1">
                  {counts.confirmado > 0 && <Badge color="bg-blue-500" n={counts.confirmado} />}
                  {counts.pendiente_pago > 0 && <Badge color="bg-amber-500" n={counts.pendiente_pago} />}
                  {counts.completado > 0 && <Badge color="bg-violet-500" n={counts.completado} />}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Badge({ color, n }: { color: string; n: number }) {
  return (
    <span className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white ${color}`}>
      {n}
    </span>
  )
}
