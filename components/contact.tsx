'use client'

import { useSiteConfig } from './catalog-provider'
import { InstagramIcon, PinIcon, WhatsappIcon } from './icons'
import { Reveal, WordReveal } from './motion-primitives'

export function Contact() {
  const SITE = useSiteConfig()
  const waHref = `https://wa.me/${SITE.whatsapp}`
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(SITE.address)}`

  return (
    <section id="contacto" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-32">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
                <span className="h-px w-6 bg-gold sm:w-8" />
                Contacto
              </p>
            </Reveal>
            <h2 className="font-display text-3xl font-700 uppercase leading-[0.95] tracking-tight sm:text-5xl">
              <WordReveal text="¿Nos vemos en la barbería?" />
            </h2>

            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-col gap-4 sm:mt-10">
                <p className="font-display text-lg font-700 uppercase tracking-wide">{SITE.name}</p>

                <div className="flex items-center gap-3 text-sm">
                  <WhatsappIcon className="h-4 w-4 flex-shrink-0 text-gold" />
                  <span>{SITE.whatsappDisplay}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <InstagramIcon className="h-4 w-4 flex-shrink-0 text-gold" />
                  <span>{SITE.instagramHandle}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <PinIcon className="h-4 w-4 flex-shrink-0 text-gold" />
                  <span>{SITE.address}</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold uppercase tracking-wide text-background transition-transform hover:scale-[1.03]"
                >
                  <WhatsappIcon className="h-4 w-4" />
                  Escribir por WhatsApp
                </a>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-secondary"
                >
                  <InstagramIcon className="h-4 w-4" />
                  Ver Instagram
                </a>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-secondary"
                >
                  <PinIcon className="h-4 w-4" />
                  Cómo llegar
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary/40 lg:aspect-auto lg:h-full">
              <div className="absolute inset-0 opacity-[0.25]" style={{
                backgroundImage:
                  'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }} />
              <div className="relative flex flex-col items-center gap-2 text-center">
                <PinIcon className="h-8 w-8 text-gold" />
                <p className="text-sm font-medium">Mapa a definir</p>
                <p className="max-w-[220px] text-xs text-muted-foreground">
                  Acá va a integrarse el mapa con la ubicación real de FABRI BARBER.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
