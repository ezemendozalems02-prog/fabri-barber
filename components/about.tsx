'use client'

import { CheckIcon } from './icons'
import { Reveal, WordReveal } from './motion-primitives'

const BULLETS = [
  'Atención personalizada',
  'Cortes adaptados a tu estilo',
  'Productos seleccionados',
  'Profesionales especializados',
]

function BrandPlate() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary/40 lg:aspect-[4/5]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(200,161,92,0.14),transparent_55%)]" />
      <div className="absolute inset-6 stripes-accent opacity-[0.06]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-[8rem] font-700 leading-none text-foreground/[0.06] sm:text-[11rem]">
          FB
        </span>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold sm:h-20 sm:w-20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-7 w-7 sm:h-8 sm:w-8">
            <circle cx="6" cy="6" r="2.4" />
            <circle cx="6" cy="18" r="2.4" />
            <path d="M7.8 7.6 20 18M7.8 16.4 20 6" />
          </svg>
        </span>
        <p className="font-display text-xs font-700 uppercase tracking-[0.3em] text-muted-foreground">
          Est. Fabri Barber
        </p>
      </div>
    </div>
  )
}

export function About() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-32">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="lg:order-2">
          <BrandPlate />
        </Reveal>

        <div className="flex flex-col justify-between lg:order-1">
          <div>
            <Reveal>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
                <span className="h-px w-6 bg-gold sm:w-8" />
                Tu estilo empieza acá
              </p>
            </Reveal>
            <h2 className="font-display text-3xl font-700 uppercase leading-[0.95] tracking-tight sm:text-6xl">
              <WordReveal text="Más que un corte" />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg">
                En FABRI BARBER buscamos que cada visita sea parte de tu estilo. Trabajamos
                cada corte y cada detalle de forma personalizada para que salgas con una
                imagen que realmente te represente.
              </p>
            </Reveal>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:mt-12 sm:grid-cols-2 sm:pt-8">
            {BULLETS.map((b, i) => (
              <Reveal key={b} delay={0.08 * i}>
                <li className="flex items-center gap-2.5 text-sm">
                  <CheckIcon className="h-4 w-4 flex-shrink-0 text-gold" />
                  {b}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
