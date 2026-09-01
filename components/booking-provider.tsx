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
import { RECOVERY_MENU, SAMPLE_TIMES, SERVICES, SITE } from '@/lib/site-data'

type BookingContextValue = {
  open: (preselectedService?: string) => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}

const ALL_OPTIONS = [
  ...SERVICES.map((s) => ({ id: s.id, title: s.title })),
  ...RECOVERY_MENU.filter((r) => !SERVICES.some((s) => s.id === r.id)).map((r) => ({
    id: r.id,
    title: r.title,
  })),
]

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [service, setService] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [name, setName] = useState('')

  const open = useCallback((preselectedService?: string) => {
    setService(preselectedService ?? null)
    setStep(preselectedService ? 1 : 0)
    setTime(null)
    setName('')
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  const serviceTitle = ALL_OPTIONS.find((o) => o.id === service)?.title ?? ''

  const whatsappHref = useMemo(() => {
    const msg = `Hola! Quiero coordinar una sesión de *${serviceTitle}*${
      time ? ` para el horario ${time}` : ''
    }.${name ? ` Mi nombre es ${name}.` : ''}`
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`
  }, [serviceTitle, time, name])

  const value = useMemo(() => ({ open }), [open])

  return (
    <BookingContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
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
              aria-label="Reservar sesión"
              className="relative w-full max-w-lg overflow-hidden rounded-t-xl border border-border bg-card sm:rounded-xl"
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5 sm:px-6 sm:py-4">
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map((s) => (
                    <span
                      key={s}
                      className={`h-1 w-6 rounded-full transition-colors sm:w-8 ${
                        s <= step ? 'bg-electric' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={close}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Cerrar"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-5 py-5 sm:px-6 sm:py-6">
                {step === 0 && (
                  <div>
                    <h3 className="font-display text-xl font-800 sm:text-2xl">¿Qué necesitás?</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Elegí el tipo de sesión para empezar.
                    </p>
                    <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {ALL_OPTIONS.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => {
                            setService(o.id)
                            setStep(1)
                          }}
                          className="rounded-lg border border-border bg-secondary px-4 py-3 text-left text-sm font-medium transition-all hover:border-electric hover:bg-accent"
                        >
                          {o.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h3 className="font-display text-xl font-800 sm:text-2xl">Elegí un horario</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Horarios de referencia · confirmás por WhatsApp.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {SAMPLE_TIMES.map((t) => (
                        <button
                          key={t}
                          onClick={() => setTime(t)}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                            time === t
                              ? 'border-electric bg-electric text-white'
                              : 'border-border bg-secondary hover:border-foreground/40'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-2">
                      <button
                        onClick={() => setStep(0)}
                        className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                      >
                        Atrás
                      </button>
                      <button
                        disabled={!time}
                        onClick={() => setStep(2)}
                        className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h3 className="font-display text-xl font-800 sm:text-2xl">Casi listo</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Confirmá tu reserva por WhatsApp.
                    </p>
                    <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Tu nombre (opcional)
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nombre y apellido"
                      className="mt-2 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm outline-none transition-colors focus:border-electric"
                    />
                    <div className="mt-5 rounded-lg border border-border bg-secondary/50 p-4 text-sm">
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Servicio</span>
                        <span className="font-medium">{serviceTitle}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Horario</span>
                        <span className="font-medium">{time}</span>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                      <button
                        onClick={() => setStep(1)}
                        className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                      >
                        Atrás
                      </button>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={close}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-electric px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
                        </svg>
                        Reservar por WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </BookingContext.Provider>
  )
}
