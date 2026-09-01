'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useBooking } from './booking-provider'

export function MobileCta() {
  const { open } = useBooking()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
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
            onClick={() => open()}
            className="w-full rounded-full bg-electric py-3.5 text-sm font-semibold text-white"
          >
            Reservar sesión
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
