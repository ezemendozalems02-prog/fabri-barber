// ------------------------------------------------------------------
// Persistencia de DEMO usando localStorage, con la misma forma que
// tendría la base de datos real (ver lib/types.ts). Cuando se conecte
// un backend, estas funciones se reemplazan por llamadas a la API
// sin tener que tocar los componentes que las usan.
// ------------------------------------------------------------------

import { getServiceDuration, timeToMinutes, type OccupiedRange } from './booking-data'
import type { BloqueoHorario, Pedido, Turno } from './types'

const TURNOS_KEY = 'fabribarber_turnos'
const BLOQUEOS_KEY = 'fabribarber_bloqueos'
const PEDIDOS_KEY = 'fabribarber_pedidos'

function readList<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function writeList<T>(key: string, list: T[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(list))
}

export function getTurnos(): Turno[] {
  return readList<Turno>(TURNOS_KEY)
}

export function saveTurno(turno: Turno) {
  const turnos = getTurnos()
  turnos.push(turno)
  writeList(TURNOS_KEY, turnos)
}

export function updateTurno(id: string, patch: Partial<Turno>) {
  const turnos = getTurnos().map((t) => (t.id === id ? { ...t, ...patch } : t))
  writeList(TURNOS_KEY, turnos)
}

export function getBloqueos(): BloqueoHorario[] {
  return readList<BloqueoHorario>(BLOQUEOS_KEY)
}

export function saveBloqueo(bloqueo: BloqueoHorario) {
  const bloqueos = getBloqueos()
  bloqueos.push(bloqueo)
  writeList(BLOQUEOS_KEY, bloqueos)
}

export function deleteBloqueo(id: string) {
  writeList(
    BLOQUEOS_KEY,
    getBloqueos().filter((b) => b.id !== id),
  )
}

/** Rangos ocupados (turnos activos + bloqueos manuales) para una fecha, en minutos desde 00:00. */
export function getOccupiedRangesForDate(fecha: string): OccupiedRange[] {
  const turnosOcupados = getTurnos()
    .filter((t) => t.fecha === fecha && t.estado_turno !== 'cancelado')
    .map((t) => ({
      start: timeToMinutes(t.hora_inicio),
      end: timeToMinutes(t.hora_inicio) + getServiceDuration(t.servicio_id),
    }))

  const bloqueosOcupados = getBloqueos()
    .filter((b) => b.fecha === fecha)
    .map((b) => ({ start: timeToMinutes(b.hora_inicio), end: timeToMinutes(b.hora_fin) }))

  return [...turnosOcupados, ...bloqueosOcupados]
}

export function getPedidos(): Pedido[] {
  return readList<Pedido>(PEDIDOS_KEY)
}

export function savePedido(pedido: Pedido) {
  const pedidos = getPedidos()
  pedidos.push(pedido)
  writeList(PEDIDOS_KEY, pedidos)
}

export function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}
