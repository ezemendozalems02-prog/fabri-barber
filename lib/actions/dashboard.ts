'use server'

import { supabaseAdmin } from '../supabase/server'
import type { Turno } from '../types'
import { listTurnos } from './turnos'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}
function yesterdayKey() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}
function isSameDay(iso: string, dateKey: string) {
  return iso.slice(0, 10) === dateKey
}
function isThisMonth(dateKey: string) {
  const now = new Date()
  const [y, m] = dateKey.split('-').map(Number)
  return y === now.getFullYear() && m === now.getMonth() + 1
}

type TurnoRow = Turno & { cliente: { whatsapp: string } }

export async function getDashboardMetrics() {
  const hoy = todayKey()
  const ayer = yesterdayKey()

  const [turnosHoy, turnosAyer, activosResp, pedidosResp] = await Promise.all([
    listTurnos({ fecha: hoy }),
    listTurnos({ fecha: ayer }),
    supabaseAdmin.from('turnos').select('*, cliente:clientes(whatsapp)').neq('estado_turno', 'cancelado'),
    supabaseAdmin.from('pedidos').select('total, created_at'),
  ])
  if (activosResp.error) throw new Error(activosResp.error.message)
  if (pedidosResp.error) throw new Error(pedidosResp.error.message)

  const activosTurnos = activosResp.data as TurnoRow[]
  const pedidos = (pedidosResp.data ?? []) as { total: number; created_at: string }[]

  const activosHoy = turnosHoy.filter((t) => t.estado_turno !== 'cancelado')
  const activosAyer = turnosAyer.filter((t) => t.estado_turno !== 'cancelado')

  const señasHoy = activosTurnos.filter((t) => isSameDay(t.created_at, hoy) && t.estado_pago === 'aprobado')
  const montoSeñasHoy = señasHoy.reduce((sum, t) => sum + t.monto_seña, 0)

  const pedidosHoy = pedidos.filter((p) => isSameDay(p.created_at, hoy))
  const ventasProductosHoy = pedidosHoy.reduce((sum, p) => sum + p.total, 0)
  const ventasHoy = montoSeñasHoy + ventasProductosHoy

  // "Cliente nuevo" = su turno más antiguo es de hoy.
  const primerTurnoPorCliente = new Map<string, string>()
  for (const t of activosTurnos) {
    const key = t.cliente.whatsapp
    const actual = primerTurnoPorCliente.get(key)
    if (!actual || t.fecha < actual) primerTurnoPorCliente.set(key, t.fecha)
  }
  const clientesNuevosHoy = [...primerTurnoPorCliente.values()].filter((f) => f === hoy).length

  const serviciosRealizadosHoy = activosHoy.filter((t) => t.estado_turno === 'completado').length

  const turnosDelMes = activosTurnos.filter(
    (t) => isThisMonth(t.fecha) && (t.estado_turno === 'confirmado' || t.estado_turno === 'completado'),
  )
  const ingresosServiciosMes = turnosDelMes.reduce((sum, t) => sum + t.precio_total, 0)
  const pedidosDelMes = pedidos.filter((p) => isThisMonth(p.created_at.slice(0, 10)))
  const ingresosProductosMes = pedidosDelMes.reduce((sum, p) => sum + p.total, 0)
  const ingresosDelMes = ingresosServiciosMes + ingresosProductosMes

  const señasPendientes = activosTurnos.filter((t) => t.estado_pago === 'pendiente').length
  const pagosRechazados = activosTurnos.filter((t) => t.estado_pago === 'rechazado').length

  return {
    turnosHoy: activosHoy.length,
    turnosAyer: activosAyer.length,
    deltaTurnos: activosHoy.length - activosAyer.length,
    ventasHoy,
    clientesNuevosHoy,
    serviciosRealizadosHoy,
    señasCobradasHoy: montoSeñasHoy,
    ingresosDelMes,
    señasPendientes,
    pagosRechazados,
  }
}

export async function getAgendaHoyPreview(limit = 6): Promise<Turno[]> {
  const hoy = todayKey()
  const turnos = await listTurnos({ fecha: hoy })
  return turnos.filter((t) => t.estado_turno !== 'cancelado').slice(0, limit)
}
