'use server'

import { supabaseAdmin } from '../supabase/server'
import type { Pedido } from '../types'

export async function listPedidos(): Promise<Pedido[]> {
  const { data, error } = await supabaseAdmin.from('pedidos').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data as Pedido[]
}

export async function savePedido(pedido: Omit<Pedido, 'id' | 'created_at'>) {
  const { error } = await supabaseAdmin.from('pedidos').insert(pedido)
  if (error) throw new Error(error.message)
}
