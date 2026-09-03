'use client'

import { motion } from 'motion/react'
import { useSiteConfig } from './catalog-provider'
import { useBooking } from './booking-provider'
import { CalendarIcon, ClockIcon, ScissorsIcon, UserIcon } from './icons'

const EASE = [0.22, 1, 0.36, 1] as const

const INDICATORS = [
  { icon: ScissorsIcon, label: 'Cortes profesionales' },
  { icon: UserIcon, label: 'Atención personalizada' },
  { icon: CalendarIcon, label: 'Turnos online' },
]

/** Ilustración cinematográfica de línea — reemplaza a una foto real hasta contar con material fotográfico propio. */
function BarberVisual() {
  return (
    <div className="relative aspect-[4/5] w-full max-w-md">
      <div className="absolute inset-0 rounded-2xl border border-border bg-gradient-to-b from-secondary/60 to-background" />
      <div className="absolute -inset-px rounded-2xl bg-[radial-gradient(circle_at_70%_20%,rgba(200,161,92,0.18),transparent_60%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.svg
          viewBox="0 0 240 300"
          className="h-[78%] w-[78%] text-gold/80"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            {/* silla de barbero, estilizada */}
            <path d="M60 260h120" opacity="0.5" />
            <path d="M75 260v-30a15 15 0 0 1 15-15h60a15 15 0 0 1 15 15v30" />
            <path d="M90 215v-70a10 10 0 0 1 10-10h40a10 10 0 0 1 10 10v70" />
            <path d="M70 150h100" />
            <path d="M78 150v-15M162 150v-15" />
            <path d="M100 90c0-16 9-28 20-28s20 12 20 28" />
            <circle cx="120" cy="70" r="26" />
          </g>
          {/* tijera flotante */}
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(150 40) rotate(20)"
          >
            <circle cx="0" cy="0" r="6" />
            <circle cx="0" cy="30" r="6" />
            <path d="M4.5 4 40 60M4.5 26 40 -30" />
          </g>
        </motion.svg>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_80px_20px_rgba(0,0,0,0.55)]" />
    </div>
  )
}

export function Hero() {
  const { requestBooking } = useBooking()
  const SITE = useSiteConfig()

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-background pt-24 sm:pt-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,161,92,0.12),transparent_55%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-14 sm:px-8 sm:pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground sm:mb-6 sm:text-xs"
          >
            <span className="h-px w-6 bg-gold sm:w-8" />
            Barbería moderna
          </motion.p>

          <h1 className="font-display max-w-2xl text-[clamp(2.4rem,8vw,4.25rem)] font-700 uppercase leading-[0.98] tracking-tight sm:leading-[0.95]">
            {['Tu estilo.', 'Tu corte.', 'Tu barbería.'].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, ease: EASE, delay: 0.25 + i * 0.1 }}
                >
                  {i === 2 ? <span className="text-gold">{line}</span> : line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
            className="mt-6 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            Cortes, barba, color y cuidado masculino con el estilo que te representa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.85 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <button
              onClick={() => requestBooking()}
              className="rounded-full bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-wide text-background transition-transform hover:scale-[1.03] sm:px-7 sm:py-3.5"
            >
              Reservar turno
            </button>
            <a
              href="#servicios"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-secondary sm:px-7 sm:py-3.5"
            >
              Ver servicios
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 1 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6 sm:mt-12"
          >
            {INDICATORS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <Icon className="h-4 w-4 text-gold" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <BarberVisual />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
            className="absolute -bottom-4 left-1/2 w-[92%] -translate-x-1/2 rounded-xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur sm:left-auto sm:right-0 sm:w-64 sm:translate-x-0"
          >
            <div className="flex items-center gap-2 text-gold">
              <ClockIcon className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Horarios</span>
            </div>
            <p className="mt-2 text-sm font-medium">Martes a Sábados</p>
            <p className="text-sm font-medium">10:00 a 19:00 hs</p>
            <p className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
              {SITE.hoursBreak}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
