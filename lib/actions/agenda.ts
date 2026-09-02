'use server'

import { supabaseAdmin } from '../supabase/server'
import type { BloqueoHorario, Turno } from '../types'

type TurnoRow = Omit<Turno, 'cliente'> & { cliente_id: string; cliente: Turno['cliente'] }

function rowToTurno(row: TurnoRow): Turno {
  const { cliente_id: _cliente_id, ...rest } = row
  return { ...rest, cliente: { id: row.cliente.id, nombre: row.cliente.nombre, whatsapp: row.cliente.whatsapp, email: row.cliente.email ?? '' } }
}

/** Trae turnos + bloqueos de un rango de fechas de una sola vez (usado por semana/mes). */
export async function getAgendaRangeData(fechaInicio: string, fechaFin: string, barberoId?: string) {
  let turnosQuery = supabaseAdmin
    .from('turnos')
    .select('*, cliente:clientes(*)')
    .gte('fecha', fechaInicio)
    .lte('fecha', fechaFin)
  if (barberoId) turnosQuery = turnosQuery.eq('barbero_id', barberoId)

  const [{ data: turnosData, error: e1 }, { data: bloqueosData, error: e2 }] = await Promise.all([
    turnosQuery,
    supabaseAdmin.from('bloqueos_horarios').select('*').gte('fecha', fechaInicio).lte('fecha', fechaFin),
  ])
  if (e1) throw new Error(e1.message)
  if (e2) throw new Error(e2.message)

  const turnos = (turnosData as TurnoRow[]).map(rowToTurno)
  const bloqueos = bloqueosData as BloqueoHorario[]

  return { turnos, bloqueos }
}

export async function getAgendaDayData(fecha: string, barberoId?: string) {
  return getAgendaRangeData(fecha, fecha, barberoId)
}
