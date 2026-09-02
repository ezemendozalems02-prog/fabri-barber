'use server'

import { supabaseAdmin } from '../supabase/server'
import type { Barbero } from '../types'

export async function listBarberos(): Promise<Barbero[]> {
  const { data, error } = await supabaseAdmin.from('barberos').select('*').order('nombre')
  if (error) throw new Error(error.message)
  return data as Barbero[]
}

export async function listBarberosActivos(): Promise<Barbero[]> {
  const { data, error } = await supabaseAdmin.from('barberos').select('*').eq('estado', 'activo').order('nombre')
  if (error) throw new Error(error.message)
  return data as Barbero[]
}

export async function getBarbero(id: string): Promise<Barbero | null> {
  const { data, error } = await supabaseAdmin.from('barberos').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data as Barbero | null
}

export async function createBarbero(data: Omit<Barbero, 'created_at'>): Promise<Barbero> {
  const { data: row, error } = await supabaseAdmin
    .from('barberos')
    .insert({ ...data })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return row as Barbero
}

export async function updateBarbero(id: string, patch: Partial<Barbero>) {
  const { error } = await supabaseAdmin.from('barberos').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteBarbero(id: string) {
  const { error } = await supabaseAdmin.from('barberos').update({ estado: 'inactivo' }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function calcComision(barbero: Barbero, monto: number) {
  if (barbero.comision_tipo === 'fijo') return Math.min(barbero.comision_valor, monto)
  return Math.round((monto * barbero.comision_valor) / 100)
}
