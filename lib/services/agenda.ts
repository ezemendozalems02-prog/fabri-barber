// ------------------------------------------------------------------
// Grilla visual de la agenda — función PURA (sin acceso a datos):
// recibe los turnos y bloqueos ya cargados (desde Supabase, ver
// lib/actions/agenda.ts) y arma las franjas de 10:00 a 19:00 cada
// 30 min con su estado. Se mantiene sync y sin dependencias de red
// para poder usarse tanto en la vista día como al armar semana/mes
// a partir de un único fetch por rango.
// ------------------------------------------------------------------

import { getServiceDuration, minutesToTime, timeToMinutes } from '../booking-data'
import type { BloqueoHorario, Turno } from '../types'

export type SlotStatus = 'disponible' | 'confirmado' | 'pendiente_pago' | 'completado' | 'bloqueado'

export type AgendaSlot = {
  hora: string
  status: SlotStatus
  turno: Turno | null
  esInicio: boolean
  motivoBloqueo?: string
}

const AGENDA_START = '10:00'
const AGENDA_END = '19:00'
const AGENDA_STEP = 30

export function buildAgendaGrid(turnosDelDia: Turno[], bloqueosDelDia: BloqueoHorario[]): AgendaSlot[] {
  const turnos = turnosDelDia.filter((t) => t.estado_turno !== 'cancelado')

  const start = timeToMinutes(AGENDA_START)
  const end = timeToMinutes(AGENDA_END)
  const slots: AgendaSlot[] = []

  for (let t = start; t < end; t += AGENDA_STEP) {
    const hora = minutesToTime(t)

    const bloqueo = bloqueosDelDia.find((b) => t >= timeToMinutes(b.hora_inicio) && t < timeToMinutes(b.hora_fin))
    const enAlmuerzo = t >= timeToMinutes('13:00') && t < timeToMinutes('14:00')

    if (bloqueo || enAlmuerzo) {
      slots.push({
        hora,
        status: 'bloqueado',
        turno: null,
        esInicio: bloqueo ? t === timeToMinutes(bloqueo.hora_inicio) : t === timeToMinutes('13:00'),
        motivoBloqueo: bloqueo?.motivo ?? 'Almuerzo',
      })
      continue
    }

    const turno = turnos.find((tu) => {
      const inicio = timeToMinutes(tu.hora_inicio)
      const fin = inicio + getServiceDuration(tu.servicio_id)
      return t >= inicio && t < fin
    })

    if (turno) {
      const status: SlotStatus =
        turno.estado_turno === 'completado' ? 'completado' : turno.estado_pago === 'pendiente' ? 'pendiente_pago' : 'confirmado'
      slots.push({ hora, status, turno, esInicio: t === timeToMinutes(turno.hora_inicio) })
      continue
    }

    slots.push({ hora, status: 'disponible', turno: null, esInicio: true })
  }

  return slots
}

export const SLOT_STATUS_META: Record<SlotStatus, { label: string; dot: string; bg: string; text: string; border: string }> = {
  disponible: { label: 'Disponible', dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  confirmado: { label: 'Confirmado', dot: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  pendiente_pago: { label: 'Pendiente de pago', dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  completado: { label: 'Atendido', dot: 'bg-violet-500', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  bloqueado: { label: 'Bloqueado', dot: 'bg-slate-500', bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-200' },
}
