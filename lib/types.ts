// ------------------------------------------------------------------
// Estructura de datos — preparada para conectar a una base de datos real.
// Hoy no hay backend: estos tipos documentan el modelo que va a usar
// el panel administrativo, el sistema de turnos y Mercado Pago cuando
// se conecten. lib/booking-store.ts es una implementación de demo
// (localStorage) que respeta exactamente esta forma.
// ------------------------------------------------------------------

export type EstadoTurno = 'pendiente_pago' | 'seña_pagada' | 'confirmado' | 'cancelado' | 'completado'

export type EstadoPago = 'pendiente' | 'aprobado' | 'rechazado'

export interface Cliente {
  id: string
  nombre: string
  whatsapp: string
  email: string
}

export interface Servicio {
  id: string
  nombre: string
  descripcion: string
  precio: number
  duracion: number // minutos
  dias_disponibles: number[] // 0=domingo ... 6=sábado
  hora_inicio: string // HH:mm
  hora_fin: string // HH:mm
  estado: 'activo' | 'inactivo'
}

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  imagen: string
  stock: number
  estado: 'activo' | 'inactivo'
}

export interface Turno {
  id: string
  cliente: Cliente
  servicio_id: string
  estilo_corte?: string // opcional, solo aplica al servicio "corte"
  fecha: string // YYYY-MM-DD
  hora_inicio: string // HH:mm
  hora_fin: string // HH:mm
  precio_total: number
  porcentaje_seña: number // 30
  monto_seña: number
  saldo: number
  estado_turno: EstadoTurno
  estado_pago: EstadoPago
  payment_id: string | null
  comentario?: string
  created_at: string // ISO
}

export interface BloqueoHorario {
  id: string
  fecha: string // YYYY-MM-DD
  hora_inicio: string
  hora_fin: string
  motivo?: string
  created_at: string
}

export interface Pedido {
  id: string
  cliente_nombre: string
  items: { producto_id: string; nombre: string; precio: number; cantidad: number }[]
  total: number
  estado: 'pendiente' | 'confirmado'
  created_at: string
}
