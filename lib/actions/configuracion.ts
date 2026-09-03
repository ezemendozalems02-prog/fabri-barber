'use server'

import { supabaseAdmin } from '../supabase/server'
import type { Configuracion } from '../types'

export async function getConfiguracion(): Promise<Configuracion> {
  const { data, error } = await supabaseAdmin.from('configuracion').select('*').eq('id', 'default').single()
  if (error) throw new Error(error.message)
  return data as Configuracion
}

export async function updateConfiguracion(patch: Partial<Omit<Configuracion, 'id' | 'updated_at'>>) {
  const { error } = await supabaseAdmin
    .from('configuracion')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', 'default')
  if (error) throw new Error(error.message)
}
