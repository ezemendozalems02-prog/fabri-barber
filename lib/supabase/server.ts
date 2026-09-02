// ------------------------------------------------------------------
// Cliente de Supabase con la service role key — SOLO se importa desde
// lib/actions/*.ts (archivos "use server"). Nunca debe llegar al
// bundle del navegador: la service role key bypassea RLS por completo.
// ------------------------------------------------------------------

import { createClient } from '@supabase/supabase-js'

if (typeof window !== 'undefined') {
  throw new Error('lib/supabase/server.ts no debe importarse desde código de cliente.')
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en el entorno.')
}

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
