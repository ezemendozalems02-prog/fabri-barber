// ------------------------------------------------------------------
// Reglas de negocio del sistema de turnos.
// La disponibilidad depende del servicio elegido: días, horario y
// duración vienen del propio Service (cargado desde Supabase — ver
// components/catalog-provider.tsx), no de reglas fijas en este archivo.
// ------------------------------------------------------------------

import { DEFAULT_DEPOSIT_PERCENT, type Service } from './site-data'

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0')
  const m = (minutes % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

/** true si la fecha corresponde a un día habilitado para el servicio (y no es pasado). */
export function isDateAllowed(service: Service, date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  if (target < today) return false
  return service.diasDisponibles.includes(target.getDay())
}

export type OccupiedRange = { start: number; end: number }

const SLOT_STEP = 30 // minutos, grilla de selección de horarios
const BREAK_START = '13:00'
const BREAK_END = '14:00'

/**
 * Genera los horarios disponibles para un servicio en una fecha dada.
 * Un horario es válido si:
 *  - el día está habilitado para el servicio
 *  - el turno completo (inicio + duración) entra dentro del horario del servicio
 *  - el turno completo no se superpone con el corte de 13:00 a 14:00
 *  - el turno completo no se superpone con ningún turno ya ocupado ese día
 */
export function generateAvailableSlots(
  service: Service,
  date: Date,
  occupied: OccupiedRange[] = [],
): string[] {
  if (!isDateAllowed(service, date)) return []

  const duration = service.duration
  const start = timeToMinutes(service.horaInicio)
  const end = timeToMinutes(service.horaFin)
  const breakStart = timeToMinutes(BREAK_START)
  const breakEnd = timeToMinutes(BREAK_END)

  const slots: string[] = []

  for (let t = start; t + duration <= end; t += SLOT_STEP) {
    const slotEnd = t + duration
    const overlapsBreak = t < breakEnd && slotEnd > breakStart
    if (overlapsBreak) continue

    const overlapsOccupied = occupied.some((r) => t < r.end && slotEnd > r.start)
    if (overlapsOccupied) continue

    slots.push(minutesToTime(t))
  }

  return slots
}

export function calcDeposit(price: number, percent: number = DEFAULT_DEPOSIT_PERCENT) {
  const deposit = Math.round((price * percent) / 100)
  const balance = price - deposit
  return { percent, deposit, balance }
}

export function formatPrice(value: number) {
  return `$${value.toLocaleString('es-AR')}`
}

export function formatDateLong(date: Date) {
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}
