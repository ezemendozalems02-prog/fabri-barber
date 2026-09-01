'use client'

import { useBooking } from './booking-provider'
import { Reveal } from './motion-primitives'

export function FinalCta() {
  const { open } = useBooking()

  return (
    <section id="contacto" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-40">
        <Reveal>
          <p className="mb-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-8 sm:text-xs sm:tracking-[0.25em]">
            <span className="h-px w-6 bg-electric sm:w-8" />
            Empecemos
          </p>
        </Reveal>
        <h2 className="font-display text-[12vw] font-900 uppercase leading-[0.9] tracking-tighter sm:text-[9vw] lg:text-[8rem]">
          <Reveal>
            <span className="block">El partido</span>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="block">termina. La</span>
          </Reveal>
          <Reveal delay={0.2}>
            <span className="block">
              recuperación
            </span>
          </Reveal>
          <Reveal delay={0.3}>
            <span className="block text-electric">empieza.</span>
          </Reveal>
        </h2>

        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap gap-3 sm:mt-12 sm:gap-4">
            <button
              onClick={() => open()}
              className="rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] sm:px-8 sm:py-4 sm:text-base"
            >
              Reservar sesión
            </button>
            <a
              href="#servicios"
              className="rounded-full border border-border px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-secondary sm:px-8 sm:py-4 sm:text-base"
            >
              Ver servicios
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
