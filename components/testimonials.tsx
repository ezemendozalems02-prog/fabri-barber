'use client'

import { TESTIMONIALS } from '@/lib/site-data'
import { Reveal, WordReveal } from './motion-primitives'

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-32">
      <div className="mb-10 sm:mb-14">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
            <span className="h-px w-6 bg-gold sm:w-8" />
            Testimonios
          </p>
        </Reveal>
        <h2 className="max-w-2xl font-display text-3xl font-700 uppercase leading-[0.95] tracking-tight sm:text-6xl">
          <WordReveal text="Lo que dicen nuestros clientes" />
        </h2>
      </div>

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <figure className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 sm:p-8">
              <span className="font-display text-4xl font-700 leading-none text-gold sm:text-5xl">
                &ldquo;
              </span>
              <blockquote className="mt-4 flex-1 text-pretty text-base leading-relaxed sm:text-lg">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-5 sm:mt-8">
                <p className="font-display text-sm font-700 uppercase tracking-wide">
                  {t.name}
                </p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t.activity}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
