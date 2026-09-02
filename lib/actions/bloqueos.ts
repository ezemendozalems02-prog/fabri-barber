'use server'

import { supabaseAdmin } from '../supabase/server'
import type { BloqueoHorario } from '../types'

export async function getBloqueos(fecha?: string): Promise<BloqueoHorario[]> {
  let query = supabaseAdmin.from('bloqueos_horarios').select('*').order('fecha').order('hora_inicio')
  if (fecha) query = query.eq('fecha', fecha)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as BloqueoHorario[]
}

export async function saveBloqueo(bloqueo: Omit<BloqueoHorario, 'id' | 'created_at'>) {
  const { error } = await supabaseAdmin.from('bloqueos_horarios').insert(bloqueo)
  if (error) throw new Error(error.message)
}

export async function deleteBloqueo(id: string) {
  const { error } = await supabaseAdmin.from('bloqueos_horarios').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
