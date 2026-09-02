'use server'

import { supabaseAdmin } from '../supabase/server'
import type { Cliente, NotaCliente } from '../types'

export async function findOrCreateCliente(input: { nombre: string; whatsapp: string; email?: string }): Promise<Cliente> {
  const { data: existing } = await supabaseAdmin
    .from('clientes')
    .select('id,nombre,whatsapp,email')
    .eq('whatsapp', input.whatsapp)
    .maybeSingle()

  if (existing) {
    // Si vino con datos nuevos (nombre/email actualizados), los sincroniza.
    if (existing.nombre !== input.nombre || (input.email && existing.email !== input.email)) {
      await supabaseAdmin.from('clientes').update({ nombre: input.nombre, email: input.email ?? existing.email }).eq('id', existing.id)
    }
    return { id: existing.id, nombre: input.nombre, whatsapp: input.whatsapp, email: input.email ?? existing.email ?? '' }
  }

  const { data, error } = await supabaseAdmin
    .from('clientes')
    .insert({ nombre: input.nombre, whatsapp: input.whatsapp, email: input.email ?? null })
    .select('id,nombre,whatsapp,email')
    .single()
  if (error) throw new Error(error.message)
  return { id: data.id, nombre: data.nombre, whatsapp: data.whatsapp, email: data.email ?? '' }
}

export type ClienteResumen = Cliente & {
  cantidad_turnos: number
  ultimo_turno: string | null
  total_gastado: number
  created_at: string
}

export async function listClientes(): Promise<ClienteResumen[]> {
  const { data: clientes, error } = await supabaseAdmin.from('clientes').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)

  const { data: turnos } = await supabaseAdmin
    .from('turnos')
    .select('cliente_id, fecha, precio_total, estado_turno')
    .neq('estado_turno', 'cancelado')

  return (clientes ?? []).map((c) => {
    const propios = (turnos ?? []).filter((t) => t.cliente_id === c.id)
    const ultimo = propios.reduce<string | null>((max, t) => (!max || t.fecha > max ? t.fecha : max), null)
    return {
      id: c.id,
      nombre: c.nombre,
      whatsapp: c.whatsapp,
      email: c.email ?? '',
      created_at: c.created_at,
      cantidad_turnos: propios.length,
      ultimo_turno: ultimo,
      total_gastado: propios
        .filter((t) => t.estado_turno === 'confirmado' || t.estado_turno === 'completado')
        .reduce((sum, t) => sum + t.precio_total, 0),
    }
  })
}

export async function getCliente(id: string) {
  const { data, error } = await supabaseAdmin.from('clientes').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data as Cliente & { created_at: string }
}

export async function listNotasCliente(clienteId: string): Promise<NotaCliente[]> {
  const { data, error } = await supabaseAdmin
    .from('notas_clientes')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data as NotaCliente[]
}

export async function agregarNotaCliente(clienteId: string, texto: string) {
  const { error } = await supabaseAdmin.from('notas_clientes').insert({ cliente_id: clienteId, texto })
  if (error) throw new Error(error.message)
}
