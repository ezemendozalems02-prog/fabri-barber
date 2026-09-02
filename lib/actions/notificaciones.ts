'use server'

import { supabaseAdmin } from '../supabase/server'
import type { Notificacion, TipoNotificacion } from '../types'

export async function listNotificaciones(): Promise<Notificacion[]> {
  const { data, error } = await supabaseAdmin
    .from('notificaciones')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw new Error(error.message)
  return data as Notificacion[]
}

export async function crearNotificacion(
  tipo: TipoNotificacion,
  titulo: string,
  descripcion: string,
  turnoId?: string,
) {
  const { error } = await supabaseAdmin
    .from('notificaciones')
    .insert({ tipo, titulo, descripcion, turno_id: turnoId ?? null })
  if (error) throw new Error(error.message)
}

export async function marcarLeida(id: string) {
  const { error } = await supabaseAdmin.from('notificaciones').update({ leida: true }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function marcarTodasLeidas() {
  const { error } = await supabaseAdmin.from('notificaciones').update({ leida: true }).eq('leida', false)
  if (error) throw new Error(error.message)
}

export async function contarNoLeidas(): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from('notificaciones')
    .select('id', { count: 'exact', head: true })
    .eq('leida', false)
  if (error) throw new Error(error.message)
  return count ?? 0
}
