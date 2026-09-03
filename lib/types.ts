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
  orden: number
  nota?: string | null
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
  barbero_id: string
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
  notas_admin?: string // notas internas, no visibles para el cliente
  created_at: string // ISO
  updated_at?: string // ISO
}

export type ComisionTipo = 'porcentaje' | 'fijo'

export interface Barbero {
  id: string
  nombre: string
  foto?: string
  telefono?: string
  email?: string
  especialidad?: string
  estado: 'activo' | 'inactivo'
  comision_tipo: ComisionTipo
  comision_valor: number // % (0-100) si es porcentaje, monto fijo si es fijo
  created_at: string
}

export type Rol = 'admin' | 'barbero' | 'recepcion'

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: Rol
  barbero_id?: string // vincula al registro de Barbero cuando rol === 'barbero'
  avatar?: string
}

export interface NotaCliente {
  id: string
  cliente_id: string // hoy: whatsapp o email del cliente, ver lib/services/clientes.ts
  texto: string
  created_at: string
}

export type TipoNotificacion =
  | 'nuevo_turno'
  | 'seña_recibida'
  | 'turno_pendiente_pago'
  | 'cancelacion'
  | 'stock_bajo'
  | 'nuevo_cliente'

export interface Notificacion {
  id: string
  tipo: TipoNotificacion
  titulo: string
  descripcion: string
  turno_id?: string
  leida: boolean
  created_at: string
}

export interface BloqueoHorario {
  id: string
  fecha: string // YYYY-MM-DD
  hora_inicio: string
  hora_fin: string
  motivo?: string
  created_at: string
}

export interface Configuracion {
  id: string
  nombre: string
  whatsapp: string
  whatsapp_display: string
  instagram: string
  instagram_handle: string
  direccion: string
  horario_general: string
  horario_break: string
  horario_radiofrecuencia: string
  porcentaje_seña: number
  anticipacion_minima_horas: number
  politica_cancelacion: string
  mp_alias: string
  mp_titular: string
  updated_at: string
}

export interface Pedido {
  id: string
  cliente_nombre: string
  items: { producto_id: string; nombre: string; precio: number; cantidad: number }[]
  total: number
  estado: 'pendiente' | 'confirmado'
  created_at: string
}
