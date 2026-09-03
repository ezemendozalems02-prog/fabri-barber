// ------------------------------------------------------------------
// Mapea las filas de Supabase (servicios/productos/configuracion) a
// las formas que ya consume toda la UI (Service/Product/SiteConfig).
// Función pura, sin 'use client'/'use server' — se usa tanto en
// Server Actions como en el CatalogProvider del cliente.
// ------------------------------------------------------------------

import type { Configuracion, Producto, Servicio } from '../types'
import { DEFAULT_DEPOSIT_PERCENT, type Product, type Service } from '../site-data'

export function mapServicio(s: Servicio): Service {
  return {
    id: s.id,
    index: String(s.orden ?? 0).padStart(2, '0'),
    title: s.nombre,
    description: s.descripcion,
    price: s.precio,
    duration: s.duracion,
    note: s.nota ?? undefined,
    diasDisponibles: s.dias_disponibles,
    horaInicio: s.hora_inicio,
    horaFin: s.hora_fin,
  }
}

export function mapProducto(p: Producto): Product {
  return {
    id: p.id,
    title: p.nombre,
    description: p.descripcion,
    price: p.precio,
    icon: 'wax',
    imagen: p.imagen || undefined,
  }
}

export type SiteConfig = {
  name: string
  tagline: string
  whatsapp: string
  whatsappDisplay: string
  instagram: string
  instagramHandle: string
  address: string
  hoursGeneral: string
  hoursBreak: string
  hoursRadiofrecuencia: string
  depositPercent: number
  anticipacionMinimaHoras: number
  politicaCancelacion: string
  mercadopago: { alias: string; titular: string }
}

export function mapConfiguracion(c: Configuracion, tagline: string): SiteConfig {
  return {
    name: c.nombre,
    tagline,
    whatsapp: c.whatsapp,
    whatsappDisplay: c.whatsapp_display,
    instagram: c.instagram,
    instagramHandle: c.instagram_handle,
    address: c.direccion,
    hoursGeneral: c.horario_general,
    hoursBreak: c.horario_break,
    hoursRadiofrecuencia: c.horario_radiofrecuencia,
    depositPercent: c.porcentaje_seña || DEFAULT_DEPOSIT_PERCENT,
    anticipacionMinimaHoras: c.anticipacion_minima_horas,
    politicaCancelacion: c.politica_cancelacion,
    mercadopago: { alias: c.mp_alias, titular: c.mp_titular },
  }
}
