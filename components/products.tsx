'use client'

import { formatPrice } from '@/lib/booking-data'
import { PRODUCTS, type Product } from '@/lib/site-data'
import { useCart } from './cart-provider'
import { BottleIcon, BrushIcon, CombIcon, DropIcon, JarIcon } from './icons'
import { Reveal, WordReveal } from './motion-primitives'

const PRODUCT_ICONS: Record<Product['icon'], typeof JarIcon> = {
  wax: JarIcon,
  comb: CombIcon,
  pomade: JarIcon,
  oil: DropIcon,
  shampoo: BottleIcon,
  brush: BrushIcon,
}

export function Products() {
  const { addItem } = useCart()

  return (
    <section id="productos" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-32">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end sm:gap-6">
          <div>
            <Reveal>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
                <span className="h-px w-6 bg-gold sm:w-8" />
                Productos
              </p>
            </Reveal>
            <h2 className="max-w-xl font-display text-3xl font-700 uppercase leading-[0.95] tracking-tight sm:text-4xl md:text-6xl">
              <WordReveal text="Llevá tu estilo a casa" />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              Los productos que usamos y recomendamos para mantener tu look todos los días.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => {
            const Icon = PRODUCT_ICONS[product.icon]
            return (
              <Reveal key={product.id} delay={(i % 3) * 0.08}>
                <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
                  <div className="flex aspect-square items-center justify-center rounded-lg border border-border bg-secondary/50">
                    <Icon className="h-10 w-10 text-gold sm:h-12 sm:w-12" />
                  </div>
                  <h3 className="mt-4 font-display text-sm font-700 uppercase tracking-tight sm:text-base">
                    {product.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-display text-base font-700 text-gold sm:text-lg">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      onClick={() => addItem(product)}
                      className="rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:border-gold hover:text-gold sm:text-sm"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-8 text-center sm:mt-12">
            <a
              href="/productos"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors hover:border-gold hover:text-gold"
            >
              Ver todos los productos →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
