'use server'

import { supabaseAdmin } from '../supabase/server'
import type { Usuario } from '../types'

export async function listUsuarios(): Promise<Usuario[]> {
  const { data, error } = await supabaseAdmin.from('usuarios').select('*').order('nombre')
  if (error) throw new Error(error.message)
  return data as Usuario[]
}

export type CrearUsuarioInput = Omit<Usuario, 'id'>

export async function createUsuario(input: CrearUsuarioInput) {
  const { error } = await supabaseAdmin.from('usuarios').insert(input)
  if (error) throw new Error(error.message)
}

export async function updateUsuario(id: string, patch: Partial<Omit<Usuario, 'id'>>) {
  const { error } = await supabaseAdmin.from('usuarios').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteUsuario(id: string) {
  const { count, error: countError } = await supabaseAdmin
    .from('usuarios')
    .select('id', { count: 'exact', head: true })
    .eq('rol', 'admin')
  if (countError) throw new Error(countError.message)

  const { data: target, error: targetError } = await supabaseAdmin.from('usuarios').select('rol').eq('id', id).single()
  if (targetError) throw new Error(targetError.message)

  if (target.rol === 'admin' && (count ?? 0) <= 1) {
    throw new Error('No se puede eliminar el último usuario administrador.')
  }

  const { error } = await supabaseAdmin.from('usuarios').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
