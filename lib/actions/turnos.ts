'use server'

import {
  calcDeposit,
  generateAvailableSlots,
  getServiceDuration,
  minutesToTime,
  timeToMinutes,
  type OccupiedRange,
} from '../booking-data'
import { SERVICES } from '../site-data'
import { supabaseAdmin } from '../supabase/server'
import type { Cliente, EstadoPago, EstadoTurno, Turno } from '../types'
import { findOrCreateCliente } from './clientes'
import { crearNotificacion } from './notificaciones'

type TurnoRow = Omit<Turno, 'cliente'> & { cliente_id: string; cliente: Cliente & { created_at?: string } }

function rowToTurno(row: TurnoRow): Turno {
  const { cliente_id: _cliente_id, ...rest } = row
  return { ...rest, cliente: { id: row.cliente.id, nombre: row.cliente.nombre, whatsapp: row.cliente.whatsapp, email: row.cliente.email ?? '' } }
}

const TURNO_SELECT = '*, cliente:clientes(*)'

export type TurnoFiltros = {
  fecha?: string
  servicioId?: string
  barberoId?: string
  estadoTurno?: EstadoTurno
  estadoPago?: EstadoPago
  busqueda?: string
}

export async function listTurnos(filtros: TurnoFiltros = {}): Promise<Turno[]> {
  let query = supabaseAdmin.from('turnos').select(TURNO_SELECT)
  if (filtros.fecha) query = query.eq('fecha', filtros.fecha)
  if (filtros.servicioId) query = query.eq('servicio_id', filtros.servicioId)
  if (filtros.barberoId) query = query.eq('barbero_id', filtros.barberoId)
  if (filtros.estadoTurno) query = query.eq('estado_turno', filtros.estadoTurno)
  if (filtros.estadoPago) query = query.eq('estado_pago', filtros.estadoPago)

  const { data, error } = await query.order('fecha').order('hora_inicio')
  if (error) throw new Error(error.message)

  let turnos = (data as TurnoRow[]).map(rowToTurno)
  if (filtros.busqueda) {
    const q = filtros.busqueda.trim().toLowerCase()
    turnos = turnos.filter((t) => t.cliente.nombre.toLowerCase().includes(q) || t.cliente.whatsapp.toLowerCase().includes(q))
  }
  return turnos
}

export async function getTurno(id: string): Promise<Turno | null> {
  const { data, error } = await supabaseAdmin.from('turnos').select(TURNO_SELECT).eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data ? rowToTurno(data as TurnoRow) : null
}

/** Turnos activos + bloqueos para una fecha, como rangos ocupados (minutos desde 00:00). */
export async function getOccupiedRangesForDate(
  fecha: string,
  barberoId?: string,
  excludeTurnoId?: string,
): Promise<OccupiedRange[]> {
  let turnosQuery = supabaseAdmin
    .from('turnos')
    .select('id, hora_inicio, servicio_id, barbero_id')
    .eq('fecha', fecha)
    .neq('estado_turno', 'cancelado')
  if (barberoId) turnosQuery = turnosQuery.eq('barbero_id', barberoId)

  const [{ data: turnos, error: e1 }, { data: bloqueos, error: e2 }] = await Promise.all([
    turnosQuery,
    supabaseAdmin.from('bloqueos_horarios').select('hora_inicio, hora_fin').eq('fecha', fecha),
  ])
  if (e1) throw new Error(e1.message)
  if (e2) throw new Error(e2.message)

  const turnoRanges = (turnos ?? [])
    .filter((t) => t.id !== excludeTurnoId)
    .map((t) => ({
      start: timeToMinutes(t.hora_inicio),
      end: timeToMinutes(t.hora_inicio) + getServiceDuration(t.servicio_id),
    }))
  const bloqueoRanges = (bloqueos ?? []).map((b) => ({ start: timeToMinutes(b.hora_inicio), end: timeToMinutes(b.hora_fin) }))

  return [...turnoRanges, ...bloqueoRanges]
}

export type ConflictoTurno = { motivo: string }

export async function validarDisponibilidad(
  servicioId: string,
  barberoId: string,
  fecha: string,
  hora: string,
  excludeTurnoId?: string,
): Promise<ConflictoTurno | null> {
  const date = new Date(`${fecha}T00:00:00`)
  const occupied = await getOccupiedRangesForDate(fecha, barberoId, excludeTurnoId)
  const validos = generateAvailableSlots(servicioId, date, occupied)
  if (!validos.includes(hora)) {
    return { motivo: 'Ese horario no está disponible (día no habilitado, cruza el almuerzo, cierre, o ya está ocupado).' }
  }
  return null
}

type CrearTurnoInput = {
  cliente: { nombre: string; whatsapp: string; email?: string }
  servicioId: string
  barberoId: string
  estiloCorte?: string
  fecha: string
  hora: string
  comentario?: string
  notasAdmin?: string
  estadoTurno: EstadoTurno
  estadoPago: EstadoPago
  paymentId?: string | null
}

async function crearTurno(input: CrearTurnoInput): Promise<Turno | ConflictoTurno> {
  const conflicto = await validarDisponibilidad(input.servicioId, input.barberoId, input.fecha, input.hora)
  if (conflicto) return conflicto

  const servicio = SERVICES.find((s) => s.id === input.servicioId)
  if (!servicio) return { motivo: 'Servicio inválido.' }

  const cliente = await findOrCreateCliente(input.cliente)
  const duration = getServiceDuration(input.servicioId)
  const horaFin = minutesToTime(timeToMinutes(input.hora) + duration)
  const { deposit, balance } = calcDeposit(servicio.price)

  const { data, error } = await supabaseAdmin
    .from('turnos')
    .insert({
      cliente_id: cliente.id,
      servicio_id: input.servicioId,
      barbero_id: input.barberoId,
      estilo_corte: input.estiloCorte ?? null,
      fecha: input.fecha,
      hora_inicio: input.hora,
      hora_fin: horaFin,
      precio_total: servicio.price,
      porcentaje_seña: 30,
      monto_seña: deposit,
      saldo: balance,
      estado_turno: input.estadoTurno,
      estado_pago: input.estadoPago,
      payment_id: input.paymentId ?? null,
      comentario: input.comentario ?? null,
      notas_admin: input.notasAdmin ?? null,
    })
    .select(TURNO_SELECT)
    .single()
  if (error) return { motivo: error.message }

  const turno = rowToTurno(data as TurnoRow)

  await crearNotificacion(
    'nuevo_turno',
    'Nuevo turno creado',
    `${turno.cliente.nombre} — ${servicio.title} el ${turno.fecha} ${turno.hora_inicio}`,
    turno.id,
  )
  if (turno.estado_pago === 'aprobado') {
    await crearNotificacion('seña_recibida', 'Seña recibida', `${cliente.nombre} — ${servicio.title}`, turno.id)
  }

  return turno
}

export type CrearTurnoAdminInput = Omit<CrearTurnoInput, 'estadoTurno' | 'estadoPago' | 'paymentId'> & {
  marcarComoConfirmado?: boolean
}

export async function crearTurnoAdmin(input: CrearTurnoAdminInput): Promise<Turno | ConflictoTurno> {
  const confirmado = input.marcarComoConfirmado ?? true
  return crearTurno({
    ...input,
    estadoTurno: confirmado ? 'confirmado' : 'pendiente_pago',
    estadoPago: confirmado ? 'aprobado' : 'pendiente',
  })
}

export type CrearTurnoPublicoInput = Omit<CrearTurnoInput, 'estadoTurno' | 'estadoPago'>

/**
 * Reserva pública: el cliente transfiere la seña por Alias de Mercado Pago y
 * envía la captura por WhatsApp. El turno queda "pendiente_pago" hasta que
 * el barbero confirma manualmente la seña recibida desde el panel admin.
 */
export async function reservarTurnoPublico(input: CrearTurnoPublicoInput): Promise<Turno | ConflictoTurno> {
  return crearTurno({ ...input, estadoTurno: 'pendiente_pago', estadoPago: 'pendiente', paymentId: null })
}

export async function confirmarTurno(id: string) {
  const { error } = await supabaseAdmin.from('turnos').update({ estado_turno: 'confirmado', updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function marcarAtendido(id: string) {
  const { error } = await supabaseAdmin.from('turnos').update({ estado_turno: 'completado', updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function cancelarTurno(id: string, motivo?: string) {
  const turno = await getTurno(id)
  const notas = motivo ? `${turno?.notas_admin ? turno.notas_admin + ' · ' : ''}Cancelado: ${motivo}` : turno?.notas_admin
  const { error } = await supabaseAdmin
    .from('turnos')
    .update({ estado_turno: 'cancelado', notas_admin: notas ?? null, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
  if (turno) {
    await crearNotificacion('cancelacion', 'Turno cancelado', `${turno.cliente.nombre} — ${turno.fecha} ${turno.hora_inicio}`, id)
  }
}

export type ReprogramarResult = { ok: true; turno: Turno } | { ok: false; motivo: string }

export async function reprogramarTurno(id: string, fecha: string, hora: string): Promise<ReprogramarResult> {
  const turno = await getTurno(id)
  if (!turno) return { ok: false, motivo: 'Turno no encontrado.' }

  const conflicto = await validarDisponibilidad(turno.servicio_id, turno.barbero_id, fecha, hora, id)
  if (conflicto) return { ok: false, motivo: conflicto.motivo }

  const duration = getServiceDuration(turno.servicio_id)
  const horaFin = minutesToTime(timeToMinutes(hora) + duration)
  const { error } = await supabaseAdmin
    .from('turnos')
    .update({ fecha, hora_inicio: hora, hora_fin: horaFin, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { ok: false, motivo: error.message }

  return { ok: true, turno: { ...turno, fecha, hora_inicio: hora, hora_fin: horaFin } }
}

export async function actualizarNotasAdmin(id: string, notas: string) {
  const { error } = await supabaseAdmin.from('turnos').update({ notas_admin: notas, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
}
