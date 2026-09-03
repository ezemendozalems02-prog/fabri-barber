'use server'

import { supabaseAdmin } from '../supabase/server'
import type { Servicio } from '../types'

export async function listServicios(): Promise<Servicio[]> {
  const { data, error } = await supabaseAdmin.from('servicios').select('*').order('orden')
  if (error) throw new Error(error.message)
  return data as Servicio[]
}

export async function getServicioAdmin(id: string): Promise<Servicio | null> {
  const { data, error } = await supabaseAdmin.from('servicios').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data as Servicio | null
}

export type CrearServicioInput = Omit<Servicio, 'estado'> & { orden?: number }

export async function createServicio(input: CrearServicioInput) {
  const { error } = await supabaseAdmin.from('servicios').insert({ ...input, estado: 'activo' })
  if (error) throw new Error(error.message)
}

export async function updateServicio(id: string, patch: Partial<Servicio>) {
  const { error } = await supabaseAdmin.from('servicios').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function setServicioEstado(id: string, estado: Servicio['estado']) {
  const { error } = await supabaseAdmin.from('servicios').update({ estado }).eq('id', id)
  if (error) throw new Error(error.message)
}
