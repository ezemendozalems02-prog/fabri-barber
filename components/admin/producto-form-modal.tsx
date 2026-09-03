'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { createProducto, updateProducto } from '@/lib/actions/productos'
import type { Producto } from '@/lib/types'
import { XIcon } from '@/components/icons'

function slugify(nombre: string) {
  const ACCENTS: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n', ü: 'u' }
  const base = nombre
    .trim()
    .toLowerCase()
    .split('')
    .map((ch) => ACCENTS[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return base || `producto-${Date.now()}`
}

export function ProductoFormModal({
  open,
  onClose,
  onSaved,
  producto,
}: {
  open: boolean
  onClose: () => void
  onSaved: () => void
  producto: Producto | null
}) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('0')
  const [stock, setStock] = useState('0')
  const [imagen, setImagen] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setNombre(producto?.nombre ?? '')
    setDescripcion(producto?.descripcion ?? '')
    setPrecio(String(producto?.precio ?? 0))
    setStock(String(producto?.stock ?? 0))
    setImagen(producto?.imagen ?? '')
    setError(null)
  }, [open, producto])

  async function handleSubmit() {
    if (!nombre.trim()) {
      setError('Ingresá el nombre del producto.')
      return
    }
    setSubmitting(true)
    const payload = {
      nombre,
      descripcion,
      precio: Number(precio) || 0,
      stock: Number(stock) || 0,
      imagen,
    }
    if (producto) {
      await updateProducto(producto.id, payload)
    } else {
      await createProducto({ id: slugify(nombre), ...payload })
    }
    setSubmitting(false)
    onSaved()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="admin-light fixed inset-0 z-[90] flex items-end justify-center sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />
          <motion.div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <p className="text-sm font-semibold text-slate-900">{producto ? 'Editar producto' : 'Nuevo producto'}</p>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Cerrar">
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3.5 p-5">
              <Field label="Nombre">
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Cera Brillo Coco"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </Field>
              <Field label="Descripción">
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Precio ($)">
                  <input
                    type="number"
                    min={0}
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </Field>
                <Field label="Stock">
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </Field>
              </div>
              <Field label="Imagen (URL, opcional)">
                <input
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                  placeholder="https://…"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </Field>

              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 p-4">
              <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? 'Guardando…' : producto ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
