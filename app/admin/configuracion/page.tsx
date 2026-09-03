'use client'

import { useEffect, useState } from 'react'
import { listBarberos } from '@/lib/actions/barberos'
import { getConfiguracion, updateConfiguracion } from '@/lib/actions/configuracion'
import { deleteUsuario, listUsuarios } from '@/lib/actions/usuarios'
import { PERMISOS, ROL_LABEL, useSession } from '@/lib/services/auth'
import type { Barbero, Configuracion, Usuario } from '@/lib/types'
import { PlusIcon } from '@/components/icons'
import { UsuarioFormModal } from '@/components/admin/usuario-form-modal'

export default function ConfiguracionPage() {
  const { user } = useSession()
  const [config, setConfig] = useState<Configuracion | null>(null)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [barberos, setBarberos] = useState<Barbero[]>([])
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Usuario | null>(null)
  const [errorUsuario, setErrorUsuario] = useState<string | null>(null)

  function refresh() {
    setLoading(true)
    Promise.all([getConfiguracion(), listUsuarios(), listBarberos()]).then(([c, u, b]) => {
      setConfig(c)
      setUsuarios(u)
      setBarberos(b)
      setLoading(false)
    })
  }

  useEffect(() => {
    refresh()
  }, [])

  if (user && !PERMISOS[user.rol].configuracionCritica) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">No tenés permiso para ver esta sección.</p>
      </div>
    )
  }

  async function handleGuardarConfig() {
    if (!config) return
    setGuardando(true)
    setGuardado(false)
    await updateConfiguracion(config)
    setGuardando(false)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2500)
  }

  async function handleEliminarUsuario(u: Usuario) {
    if (!window.confirm(`¿Eliminar a ${u.nombre}?`)) return
    setErrorUsuario(null)
    try {
      await deleteUsuario(u.id)
      refresh()
    } catch (e) {
      setErrorUsuario(e instanceof Error ? e.message : 'No se pudo eliminar el usuario.')
    }
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Configuración</h1>
        <p className="mt-1 text-sm text-slate-500">Datos de la barbería, reservas, y usuarios del panel.</p>
      </div>

      {loading || !config ? (
        <p className="mt-6 text-sm text-slate-400">Cargando…</p>
      ) : (
        <>
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
            Estos datos ya se guardan en Supabase, pero la web pública todavía usa los valores fijos que armamos con
            vos (WhatsApp, Instagram, horarios, % de seña). Conectarla a esta configuración es el próximo paso.
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">Datos de la barbería</p>
            <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field label="Nombre">
                <input value={config.nombre} onChange={(e) => setConfig({ ...config, nombre: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </Field>
              <Field label="Dirección">
                <input value={config.direccion} onChange={(e) => setConfig({ ...config, direccion: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </Field>
              <Field label="WhatsApp (sin +, con código de país)">
                <input value={config.whatsapp} onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </Field>
              <Field label="WhatsApp (texto para mostrar)">
                <input value={config.whatsapp_display} onChange={(e) => setConfig({ ...config, whatsapp_display: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </Field>
              <Field label="Instagram (link)">
                <input value={config.instagram} onChange={(e) => setConfig({ ...config, instagram: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </Field>
              <Field label="Instagram (usuario)">
                <input value={config.instagram_handle} onChange={(e) => setConfig({ ...config, instagram_handle: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </Field>
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-900">Horarios</p>
            <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field label="Horario general">
                <input value={config.horario_general} onChange={(e) => setConfig({ ...config, horario_general: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </Field>
              <Field label="Horario de corte / almuerzo">
                <input value={config.horario_break} onChange={(e) => setConfig({ ...config, horario_break: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </Field>
              <Field label="Horario de radiofrecuencia">
                <input value={config.horario_radiofrecuencia} onChange={(e) => setConfig({ ...config, horario_radiofrecuencia: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </Field>
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-900">Reservas</p>
            <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field label="Porcentaje de seña (%)">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={config.porcentaje_seña}
                  onChange={(e) => setConfig({ ...config, porcentaje_seña: Number(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </Field>
              <Field label="Anticipación mínima (horas)">
                <input
                  type="number"
                  min={0}
                  value={config.anticipacion_minima_horas}
                  onChange={(e) => setConfig({ ...config, anticipacion_minima_horas: Number(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </Field>
            </div>
            <div className="mt-3.5">
              <Field label="Política de cancelación">
                <textarea
                  value={config.politica_cancelacion}
                  onChange={(e) => setConfig({ ...config, politica_cancelacion: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </Field>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={handleGuardarConfig}
                disabled={guardando}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {guardando ? 'Guardando…' : 'Guardar cambios'}
              </button>
              {guardado && <span className="text-xs font-medium text-emerald-600">Guardado ✓</span>}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Usuarios y roles</p>
              <button
                onClick={() => {
                  setEditing(null)
                  setFormOpen(true)
                }}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <PlusIcon className="h-3.5 w-3.5" />
                Nuevo usuario
              </button>
            </div>

            {errorUsuario && <p className="mt-3 text-xs text-red-600">{errorUsuario}</p>}

            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-4 py-2.5 font-medium">Usuario</th>
                    <th className="px-4 py-2.5 font-medium">Rol</th>
                    <th className="px-4 py-2.5 font-medium">Barbero vinculado</th>
                    <th className="px-4 py-2.5 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-slate-900">{u.nombre}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </td>
                      <td className="px-4 py-2.5 text-slate-700">{ROL_LABEL[u.rol]}</td>
                      <td className="px-4 py-2.5 text-slate-500">{barberos.find((b) => b.id === u.barbero_id)?.nombre ?? '—'}</td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              setEditing(u)
                              setFormOpen(true)
                            }}
                            className="text-xs font-medium text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                          <button onClick={() => handleEliminarUsuario(u)} className="text-xs font-medium text-red-600 hover:underline">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              El login sigue siendo de demostración (sin contraseña): quien entre al panel elige uno de estos
              usuarios de una lista.
            </p>
          </div>
        </>
      )}

      <UsuarioFormModal open={formOpen} onClose={() => setFormOpen(false)} onSaved={refresh} usuario={editing} barberos={barberos} />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      {children}
    </div>
  )
}
