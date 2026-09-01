'use client'

import { INSTAGRAM_IMAGES, SITE } from '@/lib/site-data'
import { Reveal } from './motion-primitives'

export function Instagram() {
  return (
    <section className="border-t border-border bg-card py-16 sm:py-32">
      <div className="mx-auto mb-8 flex max-w-7xl flex-col justify-between gap-4 px-5 sm:mb-12 sm:flex-row sm:items-end sm:px-8">
        <div>
          <Reveal>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
              <span className="h-px w-6 bg-electric sm:w-8" />
              Instagram
            </p>
          </Reveal>
          <h2 className="font-display text-3xl font-800 uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Seguinos
          </h2>
        </div>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold transition-colors hover:text-electric"
        >
          {SITE.instagramHandle} →
        </a>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-6">
        {INSTAGRAM_IMAGES.map((src, i) => (
          <Reveal key={i} delay={(i % 6) * 0.05} className="bg-card">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden"
            >
              <img
                src={src || '/placeholder.svg'}
                alt="Publicación de Sports Recovery en Instagram"
                className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
