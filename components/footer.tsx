'use client'

import { NAV_LINKS, SITE } from '@/lib/site-data'
import { SRLogo } from './sr-logo'

export function Footer() {
  const year = new Date().getFullYear()
  const waHref = `https://wa.me/${SITE.whatsapp}`

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div className="col-span-full sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <SRLogo className="text-base" />
              </span>
              <span className="font-display text-sm font-800 uppercase tracking-widest">
                Sports Recovery
              </span>
            </div>
            <p className="mt-5 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              {SITE.tagline} Recuperá mejor, movete mejor, rendí mejor.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Navegación
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-2">
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
              Contacto
            </p>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              <li>
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-electric">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-electric">
                  {SITE.instagramHandle}
                </a>
              </li>
              <li className="text-muted-foreground">{SITE.hours}</li>
              <li className="text-muted-foreground">{SITE.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:mt-16 sm:flex-row sm:items-center sm:gap-4 sm:pt-8">
          <p className="text-xs text-muted-foreground">
            © {year} Sports Recovery. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Diseño premium · Contenido de ejemplo editable
          </p>
        </div>
      </div>
    </footer>
  )
}
