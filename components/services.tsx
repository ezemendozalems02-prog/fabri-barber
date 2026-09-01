'use client'

import { formatPrice } from '@/lib/booking-data'
import { SERVICES } from '@/lib/site-data'
import { useBooking } from './booking-provider'
import { BrowIcon, PaletteIcon, RazorIcon, ScissorsIcon, WaveIcon } from './icons'
import { Reveal, WordReveal } from './motion-primitives'

const SERVICE_ICONS: Record<string, typeof ScissorsIcon> = {
  corte: ScissorsIcon,
  barba: RazorIcon,
  cejas: BrowIcon,
  claritos: PaletteIcon,
  global: PaletteIcon,
  radiofrecuencia: WaveIcon,
}

export function Services() {
  const { requestBooking } = useBooking()

  return (
    <section id="servicios" className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-32">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end sm:gap-6">
          <div>
            <Reveal>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
                <span className="h-px w-6 bg-gold sm:w-8" />
                Servicios
              </p>
            </Reveal>
            <h2 className="max-w-2xl font-display text-3xl font-700 uppercase leading-[0.95] tracking-tight sm:text-4xl md:text-6xl">
              <WordReveal text="Servicios de barbería" />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              Precios claros, sin sorpresas. Elegí tu servicio y reservá en minutos.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = SERVICE_ICONS[service.id] ?? ScissorsIcon
            return (
              <Reveal key={service.id} delay={(i % 3) * 0.08} className="bg-card">
                <article className="group relative flex h-full flex-col p-6">
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-gold transition-colors group-hover:border-gold">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{service.index}</span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-700 uppercase tracking-tight">
                    {service.title}
                  </h3>
                  {service.note && (
                    <span className="mt-1 inline-block w-fit rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">
                      {service.note}
                    </span>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-display text-xl font-700 text-gold">
                      {formatPrice(service.price)}
                    </span>
                    <button
                      onClick={() => requestBooking(service.id)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors group-hover:text-gold"
                    >
                      Reservar
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
