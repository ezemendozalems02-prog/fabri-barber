-- ------------------------------------------------------------------
-- FABRI BARBER — esquema inicial de Supabase
-- Refleja el modelo de lib/types.ts. RLS habilitado en todas las
-- tablas: las escrituras y lecturas administrativas pasan siempre
-- por Server Actions con la service role key (nunca desde el
-- navegador); el anon key solo puede leer catálogo público activo.
-- ------------------------------------------------------------------

create extension if not exists pgcrypto;

-- ---------- servicios ----------
create table if not exists servicios (
  id text primary key,
  nombre text not null,
  descripcion text not null default '',
  precio integer not null,
  duracion integer not null, -- minutos
  dias_disponibles integer[] not null default '{2,3,4,5,6}',
  hora_inicio text not null default '10:00',
  hora_fin text not null default '19:00',
  estado text not null default 'activo' check (estado in ('activo', 'inactivo')),
  orden integer not null default 0
);

-- ---------- productos ----------
create table if not exists productos (
  id text primary key,
  nombre text not null,
  descripcion text not null default '',
  precio integer not null,
  imagen text not null default '',
  stock integer not null default 0,
  estado text not null default 'activo' check (estado in ('activo', 'inactivo'))
);

-- ---------- barberos ----------
create table if not exists barberos (
  id text primary key,
  nombre text not null,
  foto text,
  telefono text,
  email text,
  especialidad text,
  estado text not null default 'activo' check (estado in ('activo', 'inactivo')),
  comision_tipo text not null default 'porcentaje' check (comision_tipo in ('porcentaje', 'fijo')),
  comision_valor numeric not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- clientes ----------
create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  whatsapp text not null,
  email text,
  created_at timestamptz not null default now(),
  unique (whatsapp)
);

-- ---------- turnos ----------
create table if not exists turnos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id),
  servicio_id text not null references servicios(id),
  barbero_id text not null references barberos(id),
  estilo_corte text,
  fecha date not null,
  hora_inicio text not null,
  hora_fin text not null,
  precio_total integer not null,
  porcentaje_seña integer not null default 30,
  monto_seña integer not null,
  saldo integer not null,
  estado_turno text not null default 'pendiente_pago'
    check (estado_turno in ('pendiente_pago', 'seña_pagada', 'confirmado', 'cancelado', 'completado')),
  estado_pago text not null default 'pendiente' check (estado_pago in ('pendiente', 'aprobado', 'rechazado')),
  payment_id text,
  comentario text,
  notas_admin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create index if not exists idx_turnos_fecha on turnos (fecha);
create index if not exists idx_turnos_barbero_fecha on turnos (barbero_id, fecha);
create index if not exists idx_turnos_cliente on turnos (cliente_id);

-- ---------- bloqueos manuales de horario ----------
create table if not exists bloqueos_horarios (
  id uuid primary key default gen_random_uuid(),
  fecha date not null,
  hora_inicio text not null,
  hora_fin text not null,
  motivo text,
  created_at timestamptz not null default now()
);
create index if not exists idx_bloqueos_fecha on bloqueos_horarios (fecha);

-- ---------- pedidos (compras de productos) ----------
create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_nombre text not null,
  items jsonb not null default '[]',
  total integer not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'confirmado')),
  created_at timestamptz not null default now()
);

-- ---------- notificaciones del panel ----------
create table if not exists notificaciones (
  id uuid primary key default gen_random_uuid(),
  tipo text not null,
  titulo text not null,
  descripcion text not null,
  turno_id uuid references turnos(id) on delete set null,
  leida boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notificaciones_leida on notificaciones (leida);

-- ---------- notas internas de clientes ----------
create table if not exists notas_clientes (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  texto text not null,
  created_at timestamptz not null default now()
);

-- ---------- usuarios del panel (preparado para Supabase Auth real) ----------
create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null unique,
  rol text not null check (rol in ('admin', 'barbero', 'recepcion')),
  barbero_id text references barberos(id),
  avatar text
);

-- ------------------------------------------------------------------
-- RLS: todo cerrado por defecto. Las Server Actions usan la service
-- role key, que ignora RLS — son el único camino de escritura.
-- Se abre lectura pública (anon) solo para el catálogo activo.
-- ------------------------------------------------------------------

alter table servicios enable row level security;
alter table productos enable row level security;
alter table barberos enable row level security;
alter table clientes enable row level security;
alter table turnos enable row level security;
alter table bloqueos_horarios enable row level security;
alter table pedidos enable row level security;
alter table notificaciones enable row level security;
alter table notas_clientes enable row level security;
alter table usuarios enable row level security;

drop policy if exists "servicios activos son publicos" on servicios;
create policy "servicios activos son publicos" on servicios
  for select using (estado = 'activo');

drop policy if exists "productos activos son publicos" on productos;
create policy "productos activos son publicos" on productos
  for select using (estado = 'activo');

-- El resto de las tablas no tiene policies para anon/authenticated:
-- sin una policy que lo permita, RLS deniega todo por defecto salvo
-- a la service role (que se usa exclusivamente en el servidor).
