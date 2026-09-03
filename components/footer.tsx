'use client'

import { NAV_LINKS } from '@/lib/site-data'
import { useSiteConfig } from './catalog-provider'
import { InstagramIcon, WhatsappIcon } from './icons'
import { LogoMark, Wordmark } from './logo'

export function Footer() {
  const SITE = useSiteConfig()
  const year = new Date().getFullYear()
  const waHref = `https://wa.me/${SITE.whatsapp}`

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="col-span-full sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold text-gold">
                <LogoMark className="h-4 w-4" />
              </span>
              <Wordmark className="text-sm" />
            </div>
            <p className="mt-5 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              {SITE.tagline}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
              >
                <WhatsappIcon className="h-4 w-4" />
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Navegación
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Horarios
            </p>
            <div className="mt-5 flex flex-col gap-1 text-sm">
              <p>Martes a Sábados</p>
              <p>10:00 a 19:00 hs</p>
              <p className="text-muted-foreground">13:00 a 14:00 hs cerrado</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Radiofrecuencia
            </p>
            <div className="mt-5 flex flex-col gap-1 text-sm">
              <p>Martes a Viernes</p>
              <p>10:00 a 19:00 hs</p>
              <p className="text-muted-foreground">13:00 a 14:00 hs cerrado</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:mt-16 sm:flex-row sm:items-center sm:gap-4 sm:pt-8">
          <p className="text-xs text-muted-foreground">
            © {year} FABRI BARBER. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">{SITE.address}</p>
        </div>
      </div>
    </footer>
  )
}
