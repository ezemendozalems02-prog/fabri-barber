'use client'

import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/booking-data'
import { listProductosAdmin, setProductoEstado } from '@/lib/actions/productos'
import type { Producto } from '@/lib/types'
import { PlusIcon } from '@/components/icons'
import { ProductoFormModal } from '@/components/admin/producto-form-modal'

export default function ProductosAdminPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Producto | null>(null)

  function refresh() {
    setLoading(true)
    listProductosAdmin().then((data) => {
      setProductos(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    refresh()
  }, [])

  async function toggleEstado(p: Producto) {
    await setProductoEstado(p.id, p.estado === 'activo' ? 'inactivo' : 'activo')
    refresh()
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Productos</h1>
          <p className="mt-1 text-sm text-slate-500">Catálogo y stock guardado en Supabase.</p>
        </div>
        <button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Nuevo producto
        </button>
      </div>

      <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
        Este catálogo ya es el que se muestra en la web pública y en "Ver todos los productos". Un cambio acá
        (precio, stock, imagen) se ve reflejado ahí al instante.
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">Cargando productos…</td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">Todavía no hay productos cargados.</td>
                </tr>
              ) : (
                productos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{p.nombre}</p>
                      <p className="max-w-xs truncate text-xs text-slate-400">{p.descripcion}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-blue-600">{formatPrice(p.precio)}</td>
                    <td className="px-4 py-3">
                      <span className={p.stock <= 3 ? 'font-medium text-red-600' : 'text-slate-700'}>{p.stock} u.</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                          p.estado === 'activo' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-500'
                        }`}
                      >
                        {p.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setEditing(p)
                            setFormOpen(true)
                          }}
                          className="text-xs font-medium text-blue-600 hover:underline"
                        >
                          Editar
                        </button>
                        <button onClick={() => toggleEstado(p)} className="text-xs font-medium text-slate-500 hover:underline">
                          {p.estado === 'activo' ? 'Desactivar' : 'Activar'}
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

      <ProductoFormModal open={formOpen} onClose={() => setFormOpen(false)} onSaved={refresh} producto={editing} />
    </div>
  )
}
