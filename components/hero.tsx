'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useBooking } from './booking-provider'

const EASE = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { open } = useBooking()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.9])

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      {/* background image */}
      <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
        <img
          src="/images/hero-bg.png"
          alt="Deportista en proceso de recuperación"
          className="h-full w-full object-cover object-[65%_50%]"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
      <motion.div
        className="absolute inset-0 bg-background"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />

      {/* content */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-12 pt-24 sm:px-8 sm:pb-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]"
        >
          <span className="h-px w-6 bg-electric sm:w-8" />
          Recuperación deportiva
        </motion.p>

        <h1 className="font-display max-w-3xl text-[clamp(2.75rem,13vw,4.5rem)] font-900 uppercase leading-[0.95] tracking-tighter sm:text-7xl lg:text-8xl">
          {['Recuperá', 'Movete', 'Rendí'].map((word, i) => (
            <span key={word} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.3 + i * 0.12 }}
              >
                {word}
                {i === 2 && <span className="text-electric"> mejor.</span>}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
          className="mt-6 flex flex-col gap-6 sm:mt-10 sm:max-w-lg sm:gap-8"
        >
          <p className="max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground sm:max-w-none sm:text-base">
            Kinesiología, recovery y movilidad para acompañarte antes, durante y después
            del entrenamiento. Tu cuerpo es tu herramienta — cuidalo.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => open()}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] sm:px-7 sm:py-3.5"
            >
              Reservar sesión
            </button>
            <a
              href="#servicios"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary sm:px-7 sm:py-3.5"
            >
              Ver servicios
            </a>
          </div>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="pointer-events-none absolute bottom-6 right-5 hidden items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground sm:right-8 sm:flex"
      >
        Scroll
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.6 }}
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  )
}
