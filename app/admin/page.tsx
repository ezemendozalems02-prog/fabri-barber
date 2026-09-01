'use client'

import { useEffect, useMemo, useState } from 'react'
import { formatPrice } from '@/lib/booking-data'
import {
  deleteBloqueo,
  generateId,
  getBloqueos,
  getTurnos,
  saveBloqueo,
} from '@/lib/booking-store'
import { SERVICES } from '@/lib/site-data'
import type { BloqueoHorario, Turno } from '@/lib/types'

// ------------------------------------------------------------------
// Estructura de demo para el panel administrativo, leyendo desde el
// localStorage que simula la base de datos (ver lib/booking-store.ts).
// Cuando exista backend y autenticación, esta pantalla debería
// protegerse por rol y consumir la API real en vez de localStorage.
// ------------------------------------------------------------------

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function shiftDate(dateKey: string, days: number) {
  const d = new Date(`${dateKey}T00:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const ESTADO_LABEL: Record<Turno['estado_turno'], string> = {
  pendiente_pago: 'Pendiente de pago',
  'seña_pagada': 'Seña pagada',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  completado: 'Completado',
}

export default function AdminPage() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [bloqueos, setBloqueos] = useState<BloqueoHorario[]>([])
  const [selectedDate, setSelectedDate] = useState(todayKey())
  const [blockForm, setBlockForm] = useState({ hora_inicio: '10:00', hora_fin: '11:00', motivo: '' })

  const refresh = () => {
    setTurnos(getTurnos())
    setBloqueos(getBloqueos())
  }

  useEffect(() => {
    refresh()
  }, [])

  const stats = useMemo(() => {
    const hoy = todayKey()
    const activos = turnos.filter((t) => t.estado_turno !== 'cancelado')
    return {
      hoy: turnos.filter((t) => t.fecha === hoy && t.estado_turno !== 'cancelado').length,
      proximos: activos.filter((t) => t.fecha >= hoy).length,
      confirmados: turnos.filter((t) => t.estado_turno === 'confirmado').length,
      pendientes: turnos.filter((t) => t.estado_turno === 'pendiente_pago').length,
      cancelados: turnos.filter((t) => t.estado_turno === 'cancelado').length,
      facturacionSeñas: turnos
        .filter((t) => t.estado_pago === 'aprobado')
        .reduce((sum, t) => sum + t.monto_seña, 0),
    }
  }, [turnos])

  const dayTurnos = turnos
    .filter((t) => t.fecha === selectedDate)
    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))

  const dayBloqueos = bloqueos.filter((b) => b.fecha === selectedDate)

  function handleAddBlock() {
    saveBloqueo({
      id: generateId(),
      fecha: selectedDate,
      hora_inicio: blockForm.hora_inicio,
      hora_fin: blockForm.hora_fin,
      motivo: blockForm.motivo || undefined,
      created_at: new Date().toISOString(),
    })
    setBlockForm({ hora_inicio: '10:00', hora_fin: '11:00', motivo: '' })
    refresh()
  }

  function handleDeleteBlock(id: string) {
    deleteBloqueo(id)
    refresh()
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-gold">Panel administrativo</p>
          <h1 className="mt-2 font-display text-3xl font-700 uppercase tracking-tight">FABRI BARBER</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Demo local: los datos se guardan en este navegador (localStorage) con la misma
            estructura que va a tener la base de datos real. Al conectar un backend, esta
            pantalla debe protegerse con autenticación de administrador.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Turnos hoy" value={stats.hoy} />
          <StatCard label="Próximos turnos" value={stats.proximos} />
          <StatCard label="Confirmados" value={stats.confirmados} />
          <StatCard label="Pendientes" value={stats.pendientes} />
          <StatCard label="Cancelados" value={stats.cancelados} />
          <StatCard label="Señas cobradas" value={formatPrice(stats.facturacionSeñas)} />
        </div>

        <div className="mt-10 flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
          <button
            onClick={() => setSelectedDate((d) => shiftDate(d, -1))}
            className="rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary"
          >
            ← Anterior
          </button>
          <div className="text-center">
            <p className="font-display text-lg font-700">{selectedDate}</p>
            <button onClick={() => setSelectedDate(todayKey())} className="text-xs text-gold underline-offset-4 hover:underline">
              Ir a hoy
            </button>
          </div>
          <button
            onClick={() => setSelectedDate((d) => shiftDate(d, 1))}
            className="rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary"
          >
            Siguiente →
          </button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3">Hora</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Seña</th>
                <th className="px-4 py-3">Saldo</th>
                <th className="px-4 py-3">Pago</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {dayTurnos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                    Sin turnos para esta fecha.
                  </td>
                </tr>
              ) : (
                dayTurnos.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">{t.cliente.nombre}</td>
                    <td className="px-4 py-3">
                      {SERVICES.find((s) => s.id === t.servicio_id)?.title ?? t.servicio_id}
                    </td>
                    <td className="px-4 py-3">
                      {t.hora_inicio}–{t.hora_fin}
                    </td>
                    <td className="px-4 py-3">{formatPrice(t.precio_total)}</td>
                    <td className="px-4 py-3 text-gold">{formatPrice(t.monto_seña)}</td>
                    <td className="px-4 py-3">{formatPrice(t.saldo)}</td>
                    <td className="px-4 py-3 capitalize">{t.estado_pago}</td>
                    <td className="px-4 py-3">{ESTADO_LABEL[t.estado_turno]}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-700 uppercase">Bloquear horario manualmente</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Marcá un horario como no disponible aunque normalmente esté habilitado.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <input
                type="time"
                value={blockForm.hora_inicio}
                onChange={(e) => setBlockForm((f) => ({ ...f, hora_inicio: e.target.value }))}
                className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <input
                type="time"
                value={blockForm.hora_fin}
                onChange={(e) => setBlockForm((f) => ({ ...f, hora_fin: e.target.value }))}
                className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <input
                value={blockForm.motivo}
                onChange={(e) => setBlockForm((f) => ({ ...f, motivo: e.target.value }))}
                placeholder="Motivo (opcional)"
                className="col-span-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </div>
            <button
              onClick={handleAddBlock}
              className="mt-4 w-full rounded-lg bg-gold py-2.5 text-sm font-semibold text-background"
            >
              Bloquear {selectedDate}
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-700 uppercase">Bloqueos de {selectedDate}</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {dayBloqueos.length === 0 && (
                <li className="text-sm text-muted-foreground">Sin bloqueos manuales.</li>
              )}
              {dayBloqueos.map((b) => (
                <li key={b.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <span>
                    {b.hora_inicio}–{b.hora_fin}
                    {b.motivo ? ` · ${b.motivo}` : ''}
                  </span>
                  <button onClick={() => handleDeleteBlock(b.id)} className="text-xs text-muted-foreground hover:text-destructive">
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="font-display text-2xl font-700">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
