'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import { SERVICES } from '@/lib/site-data'
import { useBooking } from './booking-provider'
import { Reveal, WordReveal } from './motion-primitives'

export function Services() {
  const { open } = useBooking()
  const [active, setActive] = useState<string | null>(null)

  return (
    <section id="servicios" className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-32">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end sm:gap-6">
          <div>
            <Reveal>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
                <span className="h-px w-6 bg-electric sm:w-8" />
                Servicios
              </p>
            </Reveal>
            <h2 className="max-w-2xl font-display text-3xl font-800 uppercase leading-[0.95] tracking-tight sm:text-4xl md:text-6xl">
              <WordReveal text="Lo que hacemos por vos" />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              Cada sesión se adapta a tu estado y objetivo. Elegí lo que necesitás.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.id} delay={(i % 3) * 0.08} className="bg-card">
              <motion.article
                onMouseEnter={() => setActive(service.id)}
                onMouseLeave={() => setActive(null)}
                className="group relative flex h-full flex-col overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={service.image || '/placeholder.svg'}
                    alt={service.title}
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  <span className="absolute left-5 top-5 font-mono text-xs text-muted-foreground">
                    {service.index}
                  </span>
                  <span className="absolute right-5 top-5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    {service.duration}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl font-800 uppercase tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {service.bullets.slice(0, 4).map((b) => (
                      <span
                        key={b}
                        className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {service.price}
                    </span>
                    <button
                      onClick={() => open(service.id)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors group-hover:text-electric"
                    >
                      Reservar
                      <motion.span
                        animate={{ x: active === service.id ? 4 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        →
                      </motion.span>
                    </button>
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
