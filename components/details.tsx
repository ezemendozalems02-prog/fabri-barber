'use client'

import { BrowIcon, RazorIcon, ScissorsIcon } from './icons'
import { Reveal, WordReveal } from './motion-primitives'

const ITEMS = [
  {
    icon: ScissorsIcon,
    title: 'Corte',
    description: 'La base de tu imagen: estructura, proporción y terminación prolija.',
  },
  {
    icon: RazorIcon,
    title: 'Barba',
    description: 'Perfilado preciso que define el contorno del rostro.',
  },
  {
    icon: BrowIcon,
    title: 'Cejas',
    description: 'El detalle final que enmarca la mirada y completa el look.',
  },
]

export function Details() {
  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="mb-4 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
              <span className="h-px w-6 bg-gold sm:w-8" />
              Precisión
            </p>
          </Reveal>
          <h2 className="font-display text-3xl font-700 uppercase leading-[0.95] tracking-tight sm:text-6xl">
            <WordReveal text="Los detalles hacen la diferencia" />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-5 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Un buen corte cambia tu imagen. Los detalles terminan de definirla.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-6">
          {ITEMS.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delay={0.1 * i}>
              <div className="relative flex h-full flex-col items-center overflow-hidden rounded-xl border border-border bg-background p-8 text-center">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,161,92,0.12),transparent_60%)]" />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="relative mt-5 font-display text-xl font-700 uppercase tracking-tight">
                  {title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
