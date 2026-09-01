'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import { RECOVERY_MENU } from '@/lib/site-data'
import { useBooking } from './booking-provider'
import { Reveal, WordReveal } from './motion-primitives'

export function RecoveryMenu() {
  const { open } = useBooking()
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="recovery" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-32">
      <div className="mb-8 sm:mb-12">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
            <span className="h-px w-6 bg-electric sm:w-8" />
            Menú de recuperación
          </p>
        </Reveal>
        <h2 className="font-display text-3xl font-800 uppercase leading-[0.95] tracking-tight sm:text-6xl">
          <WordReveal text="Elegí cómo recuperar" />
        </h2>
      </div>

      <div className="border-t border-border">
        {RECOVERY_MENU.map((option, i) => (
          <Reveal key={option.id}>
            <motion.button
              onClick={() => open(option.id)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative flex w-full flex-col gap-3 border-b border-border py-5 text-left transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-9"
            >
              <div className="flex items-baseline gap-3 sm:gap-10">
                <span className="font-mono text-xs text-muted-foreground">
                  0{i + 1}
                </span>
                <span className="font-display text-2xl font-800 uppercase tracking-tight transition-transform duration-300 group-hover:translate-x-2 sm:text-5xl">
                  {option.title}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pl-8 sm:justify-normal sm:gap-8 sm:pl-0">
                <span className="hidden max-w-xs text-right text-sm text-muted-foreground md:block">
                  {option.description}
                </span>
                <span className="whitespace-nowrap rounded-full border border-border px-3 py-1 text-xs font-medium">
                  {option.duration}
                </span>
                <motion.span
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border transition-colors group-hover:border-electric group-hover:bg-electric group-hover:text-white sm:h-10 sm:w-10"
                  animate={{ rotate: hovered === i ? 45 : 0 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </motion.span>
              </div>
            </motion.button>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
