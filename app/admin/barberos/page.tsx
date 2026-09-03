'use client'

import { useEffect, useState } from 'react'
import { listBarberos, updateBarbero } from '@/lib/actions/barberos'
import type { Barbero } from '@/lib/types'
import { PlusIcon, UserBadgeIcon } from '@/components/icons'
import { BarberoFormModal } from '@/components/admin/barbero-form-modal'

export default function BarberosPage() {
  const [barberos, setBarberos] = useState<Barbero[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Barbero | null>(null)

  function refresh() {
    setLoading(true)
    listBarberos().then((data) => {
      setBarberos(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    refresh()
  }, [])

  async function toggleEstado(b: Barbero) {
    await updateBarbero(b.id, { estado: b.estado === 'activo' ? 'inactivo' : 'activo' })
    refresh()
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Barberos</h1>
          <p className="mt-1 text-sm text-slate-500">Equipo, especialidades y comisiones.</p>
        </div>
        <button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Nuevo barbero
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-slate-400">Cargando barberos…</p>
      ) : barberos.length === 0 ? (
        <p className="mt-6 text-sm text-slate-400">Todavía no hay barberos cargados.</p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {barberos.map((b) => (
            <div key={b.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <UserBadgeIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{b.nombre}</p>
                    <p className="text-xs text-slate-500">{b.especialidad || 'Sin especialidad'}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                    b.estado === 'activo' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-500'
                  }`}
                >
                  {b.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500">
                {b.telefono && <p>Tel: {b.telefono}</p>}
                {b.email && <p>{b.email}</p>}
                <p>
                  Comisión: {b.comision_tipo === 'porcentaje' ? `${b.comision_valor}%` : `$${b.comision_valor.toLocaleString('es-AR')}`}
                </p>
              </div>

              <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => {
                    setEditing(b)
                    setFormOpen(true)
                  }}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button onClick={() => toggleEstado(b)} className="text-xs font-medium text-slate-500 hover:underline">
                  {b.estado === 'activo' ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BarberoFormModal open={formOpen} onClose={() => setFormOpen(false)} onSaved={refresh} barbero={editing} />
    </div>
  )
}
