'use server'

import { supabaseAdmin } from '../supabase/server'
import type { Producto } from '../types'

export async function listProductosAdmin(): Promise<Producto[]> {
  const { data, error } = await supabaseAdmin.from('productos').select('*').order('nombre')
  if (error) throw new Error(error.message)
  return data as Producto[]
}

export async function getProductoAdmin(id: string): Promise<Producto | null> {
  const { data, error } = await supabaseAdmin.from('productos').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data as Producto | null
}

export type CrearProductoInput = Omit<Producto, 'estado'>

export async function createProducto(input: CrearProductoInput) {
  const { error } = await supabaseAdmin.from('productos').insert({ ...input, estado: 'activo' })
  if (error) throw new Error(error.message)
}

export async function updateProducto(id: string, patch: Partial<Producto>) {
  const { error } = await supabaseAdmin.from('productos').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function setProductoEstado(id: string, estado: Producto['estado']) {
  const { error } = await supabaseAdmin.from('productos').update({ estado }).eq('id', id)
  if (error) throw new Error(error.message)
}
