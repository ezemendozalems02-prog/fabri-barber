'use client'

import { HAIRCUTS } from '@/lib/site-data'
import { useBooking } from './booking-provider'
import { ScissorsIcon } from './icons'
import { Reveal, WordReveal } from './motion-primitives'

export function Haircuts() {
  const { requestBooking } = useBooking()

  return (
    <section id="cortes" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-32">
      <div className="mb-10 text-center sm:mb-14">
        <Reveal>
          <p className="mb-4 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
            <span className="h-px w-6 bg-gold sm:w-8" />
            Estilos
          </p>
        </Reveal>
        <h2 className="font-display text-3xl font-700 uppercase leading-[0.95] tracking-tight sm:text-6xl">
          <WordReveal text="Encontrá tu corte" />
        </h2>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Elegí el estilo que más te representa.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {HAIRCUTS.map((cut, i) => (
          <Reveal key={cut.id} delay={(i % 4) * 0.06}>
            <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-gold">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-gold transition-colors group-hover:border-gold">
                <ScissorsIcon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-4 font-display text-base font-700 uppercase tracking-tight sm:text-lg">
                {cut.title}
              </h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {cut.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-10 text-center sm:mt-16">
          <p className="font-display text-xl font-700 uppercase tracking-tight sm:text-2xl">
            ¿Ya sabés qué corte querés?
          </p>
          <button
            onClick={() => requestBooking('corte')}
            className="rounded-full bg-gold px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-background transition-transform hover:scale-[1.03]"
          >
            Reservá tu turno
          </button>
        </div>
      </Reveal>
    </section>
  )
}
