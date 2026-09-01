'use client'

import { ImageReveal, Reveal, WordReveal } from './motion-primitives'

const STATS = [
  { value: '360°', label: 'Enfoque integral' },
  { value: '6', label: 'Tipos de sesión' },
  { value: '1:1', label: 'Atención personalizada' },
]

export function About() {
  return (
    <section id="nosotros" className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-32">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ImageReveal
          src="/images/about.png"
          alt="Sesión de recuperación deportiva en Sports Recovery"
          className="aspect-[4/3] rounded-xl lg:order-2 lg:aspect-[4/5]"
        />

        <div className="flex flex-col justify-between lg:order-1">
          <div>
            <Reveal>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
                <span className="h-px w-6 bg-electric sm:w-8" />
                Nosotros
              </p>
            </Reveal>
            <h2 className="font-display text-3xl font-800 uppercase leading-[0.95] tracking-tight sm:text-6xl">
              <WordReveal text="Tu cuerpo es tu herramienta." />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg">
                Sports Recovery nace para acompañar a deportistas y personas activas en su
                proceso de recuperación y movimiento. No importa si competís, entrenás o
                simplemente querés moverte mejor: trabajamos para que tu cuerpo esté siempre
                listo.
              </p>
            </Reveal>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6 sm:mt-12 sm:gap-4 sm:pt-8">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={0.1 * i}>
                <div>
                  <p className="font-display text-2xl font-900 tracking-tight sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
