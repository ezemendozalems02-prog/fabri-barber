// ------------------------------------------------------------------
// Reglas de negocio del sistema de turnos.
// La disponibilidad depende del servicio elegido: la radiofrecuencia
// tiene un horario distinto al resto. La duración de cada servicio
// determina qué horarios quedan bloqueados.
// ------------------------------------------------------------------

import { SERVICES } from './site-data'

export type Schedule = {
  days: number[] // 0=domingo ... 6=sábado
  start: string // HH:mm
  end: string // HH:mm
  breakStart: string
  breakEnd: string
}

// Martes a Sábado, 10:00–19:00, sin atención 13:00–14:00.
export const GENERAL_SCHEDULE: Schedule = {
  days: [2, 3, 4, 5, 6],
  start: '10:00',
  end: '19:00',
  breakStart: '13:00',
  breakEnd: '14:00',
}

// Radiofrecuencia: Martes a Viernes, 10:00–19:00, sin atención 13:00–14:00.
export const RADIOFRECUENCIA_SCHEDULE: Schedule = {
  days: [2, 3, 4, 5],
  start: '10:00',
  end: '19:00',
  breakStart: '13:00',
  breakEnd: '14:00',
}

export function getScheduleForService(serviceId: string): Schedule {
  return serviceId === 'radiofrecuencia' ? RADIOFRECUENCIA_SCHEDULE : GENERAL_SCHEDULE
}

export function getServiceDuration(serviceId: string): number {
  return SERVICES.find((s) => s.id === serviceId)?.duration ?? 60
}

export function getServicePrice(serviceId: string): number {
  return SERVICES.find((s) => s.id === serviceId)?.price ?? 0
}

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
export function isDateAllowed(serviceId: string, date: Date): boolean {
  const schedule = getScheduleForService(serviceId)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  if (target < today) return false
  return schedule.days.includes(target.getDay())
}

export type OccupiedRange = { start: number; end: number }

export const SLOT_STEP = 30 // minutos, grilla de selección de horarios y bloqueo de turnos ya tomados

/**
 * Genera los horarios disponibles para un servicio en una fecha dada.
 * Un horario es válido si:
 *  - el día está habilitado para el servicio
 *  - el turno completo (inicio + duración) entra dentro del horario de atención
 *  - el turno completo no se superpone con el corte de 13:00 a 14:00
 *  - el turno completo no se superpone con ningún turno ya ocupado ese día
 */
export function generateAvailableSlots(
  serviceId: string,
  date: Date,
  occupied: OccupiedRange[] = [],
): string[] {
  if (!isDateAllowed(serviceId, date)) return []

  const schedule = getScheduleForService(serviceId)
  const duration = getServiceDuration(serviceId)

  const start = timeToMinutes(schedule.start)
  const end = timeToMinutes(schedule.end)
  const breakStart = timeToMinutes(schedule.breakStart)
  const breakEnd = timeToMinutes(schedule.breakEnd)

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

export function calcDeposit(price: number) {
  const DEPOSIT_PERCENT = 30
  const deposit = Math.round((price * DEPOSIT_PERCENT) / 100)
  const balance = price - deposit
  return { percent: DEPOSIT_PERCENT, deposit, balance }
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
