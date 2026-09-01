'use client'

import { AnimatePresence, motion } from 'motion/react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { formatPrice } from '@/lib/booking-data'
import { generateId, savePedido } from '@/lib/booking-store'
import type { Product } from '@/lib/site-data'

type CartItem = { id: string; title: string; price: number; qty: number }

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  setQty: (id: string, qty: number) => void
  open: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

const STORAGE_KEY = 'fabribarber_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'confirming' | 'done'>('idle')
  const [name, setName] = useState('')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { id: product.id, title: product.title, price: product.price, qty: 1 }]
    })
    setIsOpen(true)
    setStatus('idle')
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const setQty = useCallback((id: string, qty: number) => {
    if (qty < 1) return
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }, [])

  const open = useCallback(() => {
    setStatus('idle')
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])

  const count = items.reduce((n, i) => n + i.qty, 0)
  const total = items.reduce((n, i) => n + i.price * i.qty, 0)

  const confirmOrder = () => {
    setStatus('confirming')
    // Demo — sin pasarela de pago conectada todavía para productos.
    // Preparado para reemplazar por preferencia de Mercado Pago real.
    setTimeout(() => {
      savePedido({
        id: generateId(),
        cliente_nombre: name || 'Sin nombre',
        items: items.map((i) => ({
          producto_id: i.id,
          nombre: i.title,
          precio: i.price,
          cantidad: i.qty,
        })),
        total,
        estado: 'pendiente',
        created_at: new Date().toISOString(),
      })
      setItems([])
      setStatus('done')
    }, 900)
  }

  const value = useMemo(
    () => ({ items, count, total, addItem, removeItem, setQty, open }),
    [items, count, total, addItem, removeItem, setQty, open],
  )

  return (
    <CartContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[110] flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={close}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Carrito de compras"
              className="relative flex h-full w-full max-w-sm flex-col overflow-hidden border-l border-border bg-card"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h3 className="font-display text-lg font-700 uppercase tracking-wide">
                  Tu carrito
                </h3>
                <button
                  onClick={close}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Cerrar carrito"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {status === 'done' ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m5 12 4 4 10-10" />
                    </svg>
                  </span>
                  <p className="font-display text-xl font-700 uppercase">¡Pedido registrado!</p>
                  <p className="max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
                    Te contactaremos por WhatsApp para coordinar el pago y la entrega.
                  </p>
                  <button
                    onClick={close}
                    className="mt-3 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
                  >
                    Cerrar
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
                  <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    <ul className="flex flex-col gap-4">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3 border-b border-border pb-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                          </div>
                          <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                            <button
                              onClick={() => setQty(item.id, item.qty - 1)}
                              className="flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                              aria-label="Restar"
                            >
                              −
                            </button>
                            <span className="w-4 text-center text-sm">{item.qty}</span>
                            <button
                              onClick={() => setQty(item.id, item.qty + 1)}
                              className="flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                              aria-label="Sumar"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                            aria-label="Quitar"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-border px-5 py-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="font-display text-xl font-700">{formatPrice(total)}</span>
                    </div>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre (para coordinar la entrega)"
                      className="mb-3 w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm outline-none transition-colors focus:border-gold"
                    />
                    <button
                      onClick={confirmOrder}
                      disabled={status === 'confirming'}
                      className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                      {status === 'confirming' ? 'Confirmando…' : 'Confirmar pedido'}
                    </button>
                    <p className="mt-2 text-center text-[11px] text-muted-foreground">
                      Pago online próximamente vía Mercado Pago.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  )
}
