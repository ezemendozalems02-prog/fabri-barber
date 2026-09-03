'use client'

import { useEffect, useMemo, useState } from 'react'
import { formatPrice } from '@/lib/booking-data'
import { listClientes, type ClienteResumen } from '@/lib/actions/clientes'
import { SearchIcon } from '@/components/icons'
import { ClienteDetailSheet } from '@/components/admin/cliente-detail-sheet'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<ClienteResumen[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    listClientes().then((data) => {
      setClientes(data)
      setLoading(false)
    })
  }, [])

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return clientes
    return clientes.filter((c) => c.nombre.toLowerCase().includes(q) || c.whatsapp.toLowerCase().includes(q))
  }, [clientes, busqueda])

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Clientes</h1>
          <p className="mt-1 text-sm text-slate-500">{clientes.length} cliente(s) registrado(s).</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o WhatsApp"
            className="w-64 rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Turnos</th>
                <th className="px-4 py-3 font-medium">Último turno</th>
                <th className="px-4 py-3 font-medium">Total gastado</th>
                <th className="px-4 py-3 font-medium">Cliente desde</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                    Cargando clientes…
                  </td>
                </tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                    No hay clientes que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filtrados.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{c.nombre}</p>
                      <p className="text-xs text-slate-400">{c.whatsapp}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{c.cantidad_turnos}</td>
                    <td className="px-4 py-3 text-slate-700">{c.ultimo_turno ?? '—'}</td>
                    <td className="px-4 py-3 font-medium text-blue-600">{formatPrice(c.total_gastado)}</td>
                    <td className="px-4 py-3 text-slate-500">{new Date(c.created_at).toLocaleDateString('es-AR')}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelected(c.id)} className="text-xs font-medium text-blue-600 hover:underline">
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ClienteDetailSheet clienteId={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
