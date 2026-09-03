'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useSiteConfig } from './catalog-provider'
import { useBooking } from './booking-provider'
import { WhatsappIcon } from './icons'

export function MobileCta() {
  const { requestBooking } = useBooking()
  const SITE = useSiteConfig()
  const [scrolledPast, setScrolledPast] = useState(false)
  const [inBookingSection, setInBookingSection] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolledPast(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Oculta la barra fija mientras el formulario de reserva está en pantalla:
  // ahí ya hay botones propios y la barra fija los tapa en celulares chicos.
  useEffect(() => {
    const el = document.getElementById('reservar')
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInBookingSection(entry.isIntersecting), {
      threshold: 0.15,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const show = scrolledPast && !inBookingSection

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg sm:bottom-6 sm:right-6"
            aria-label="Escribir por WhatsApp"
          >
            <WhatsappIcon className="h-5 w-5" />
          </motion.a>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 p-4 backdrop-blur-xl sm:hidden"
          >
            <button
              onClick={() => requestBooking()}
              className="w-full rounded-full bg-gold py-3.5 text-sm font-semibold uppercase tracking-wide text-background"
            >
              Reservar turno
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
