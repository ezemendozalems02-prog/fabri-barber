'use client'

import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/booking-data'
import { listServicios, setServicioEstado } from '@/lib/actions/servicios'
import type { Servicio } from '@/lib/types'
import { PlusIcon } from '@/components/icons'
import { ServicioFormModal } from '@/components/admin/servicio-form-modal'

const DIA_LABEL: Record<number, string> = { 0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb' }

export default function ServiciosAdminPage() {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Servicio | null>(null)

  function refresh() {
    setLoading(true)
    listServicios().then((data) => {
      setServicios(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    refresh()
  }, [])

  async function toggleEstado(s: Servicio) {
    await setServicioEstado(s.id, s.estado === 'activo' ? 'inactivo' : 'activo')
    refresh()
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Servicios</h1>
          <p className="mt-1 text-sm text-slate-500">Catálogo de servicios guardado en Supabase.</p>
        </div>
        <button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Nuevo servicio
        </button>
      </div>

      <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
        Estos servicios ya son los que se muestran y se pueden reservar en la web pública. Un cambio acá (precio,
        duración, días u horario) se ve reflejado ahí al instante.
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Servicio</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Duración</th>
                <th className="px-4 py-3 font-medium">Días</th>
                <th className="px-4 py-3 font-medium">Horario</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">Cargando servicios…</td>
                </tr>
              ) : servicios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">Todavía no hay servicios cargados.</td>
                </tr>
              ) : (
                servicios.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{s.nombre}</p>
                      <p className="max-w-xs truncate text-xs text-slate-400">{s.descripcion}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-blue-600">{formatPrice(s.precio)}</td>
                    <td className="px-4 py-3 text-slate-700">{s.duracion} min</td>
                    <td className="px-4 py-3 text-slate-700">{s.dias_disponibles.map((d) => DIA_LABEL[d]).join(', ')}</td>
                    <td className="px-4 py-3 text-slate-700">{s.hora_inicio}–{s.hora_fin}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                          s.estado === 'activo' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-500'
                        }`}
                      >
                        {s.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setEditing(s)
                            setFormOpen(true)
                          }}
                          className="text-xs font-medium text-blue-600 hover:underline"
                        >
                          Editar
                        </button>
                        <button onClick={() => toggleEstado(s)} className="text-xs font-medium text-slate-500 hover:underline">
                          {s.estado === 'activo' ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ServicioFormModal open={formOpen} onClose={() => setFormOpen(false)} onSaved={refresh} servicio={editing} />
    </div>
  )
}
