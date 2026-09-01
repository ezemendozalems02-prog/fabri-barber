'use client'

import { FOR_WHO } from '@/lib/site-data'
import { ImageReveal, Reveal, WordReveal } from './motion-primitives'

export function ForWho() {
  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:gap-12 sm:px-8 sm:py-32 lg:grid-cols-2 lg:gap-16">
        <ImageReveal
          src="/images/athlete.png"
          alt="Deportista en movimiento"
          className="order-2 aspect-[4/3] rounded-xl lg:order-1 lg:aspect-[4/5]"
        />

        <div className="order-1 flex flex-col justify-center lg:order-2">
          <Reveal>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
              <span className="h-px w-6 bg-electric sm:w-8" />
              Para quién
            </p>
          </Reveal>
          <h2 className="font-display text-3xl font-800 uppercase leading-[0.95] tracking-tight sm:text-6xl">
            <WordReveal text="Pensado para tu ritmo" />
          </h2>

          <ul className="mt-7 flex flex-col sm:mt-10">
            {FOR_WHO.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.05}>
                <li className="flex items-center gap-4 border-b border-border py-3.5 sm:gap-5 sm:py-4">
                  <span className="font-mono text-xs text-muted-foreground">
                    {item.index}
                  </span>
                  <span className="font-display text-lg font-700 uppercase tracking-tight sm:text-2xl">
                    {item.label}
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
