'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { NAV_LINKS } from '@/lib/site-data'
import { useBooking } from './booking-provider'
import { useCart } from './cart-provider'
import { LogoMark, Wordmark } from './logo'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { requestBooking } = useBooking()
  const { count, open: openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-border bg-background/85 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-8">
          <a href="#inicio" className="flex items-center gap-2" aria-label="FABRI BARBER">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gold text-gold sm:h-9 sm:w-9">
              <LogoMark className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </span>
            <Wordmark className="text-xs sm:text-sm" />
          </a>

          <nav className="hidden items-center gap-7 xl:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-gold hover:text-gold"
              aria-label="Ver carrito"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6 4.5 2H2" />
                <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
                <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-background">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => requestBooking()}
              className="hidden rounded-full bg-gold px-5 py-2 text-sm font-semibold uppercase tracking-wide text-background transition-transform hover:scale-[1.03] sm:block"
            >
              Reservar turno
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border xl:hidden"
              aria-label="Abrir menú"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-background xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-14 items-center justify-between px-4 sm:h-16 sm:px-5">
              <span className="font-display text-sm font-700 uppercase tracking-widest">
                Menú
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-border"
                aria-label="Cerrar menú"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col px-4 pt-4 sm:px-5 sm:pt-6">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-border py-4 font-display text-2xl font-700 uppercase sm:py-5 sm:text-3xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  {link.label}
                </motion.a>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false)
                  requestBooking()
                }}
                className="mt-6 rounded-full bg-gold px-6 py-4 text-base font-semibold uppercase tracking-wide text-background sm:mt-8"
              >
                Reservar turno
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
