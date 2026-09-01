'use client'

import { METHOD } from '@/lib/site-data'
import { Reveal, WordReveal } from './motion-primitives'

export function Methodology() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-32">
      <div className="mb-10 sm:mb-14">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
            <span className="h-px w-6 bg-electric sm:w-8" />
            Metodología
          </p>
        </Reveal>
        <h2 className="max-w-2xl font-display text-3xl font-800 uppercase leading-[0.95] tracking-tight sm:text-6xl">
          <WordReveal text="Cómo trabajamos" />
        </h2>
      </div>

      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {METHOD.map((item, i) => (
          <Reveal key={item.step} delay={i * 0.08} className="bg-background">
            <div className="group flex h-full flex-col p-6 sm:p-8">
              <span className="font-display text-4xl font-900 tracking-tighter text-muted/40 transition-colors duration-500 group-hover:text-electric sm:text-5xl">
                {item.step}
              </span>
              <h3 className="mt-6 font-display text-xl font-800 uppercase tracking-tight sm:mt-8 sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
