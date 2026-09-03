'use client'

import { Footer } from '@/components/footer'
import { BottleIcon, BrushIcon, CombIcon, DropIcon, JarIcon } from '@/components/icons'
import { MobileCta } from '@/components/mobile-cta'
import { Navbar } from '@/components/navbar'
import { Reveal, WordReveal } from '@/components/motion-primitives'
import { useCart } from '@/components/cart-provider'
import { useProducts } from '@/components/catalog-provider'
import { formatPrice } from '@/lib/booking-data'
import type { Product } from '@/lib/site-data'

const PRODUCT_ICONS: Record<Product['icon'], typeof JarIcon> = {
  wax: JarIcon,
  comb: CombIcon,
  pomade: JarIcon,
  oil: DropIcon,
  shampoo: BottleIcon,
  brush: BrushIcon,
}

export default function ProductosPage() {
  const { addItem } = useCart()
  const PRODUCTS = useProducts()

  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-border bg-card pt-28 sm:pt-32">
          <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24">
            <Reveal>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
                <span className="h-px w-6 bg-gold sm:w-8" />
                Productos
              </p>
            </Reveal>
            <h1 className="max-w-2xl font-display text-3xl font-700 uppercase leading-[0.95] tracking-tight sm:text-6xl">
              <WordReveal text="Productos para llevar tu estilo a casa" />
            </h1>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                Los productos que usamos y recomendamos para mantener tu look todos los días.
                Catálogo de ejemplo — listo para reemplazar por el stock real.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {PRODUCTS.map((product, i) => {
              const Icon = PRODUCT_ICONS[product.icon]
              return (
                <Reveal key={product.id} delay={(i % 3) * 0.06}>
                  <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary/50">
                      {product.imagen ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.imagen} alt={product.title} className="h-full w-full object-cover" />
                      ) : (
                        <Icon className="h-12 w-12 text-gold" />
                      )}
                    </div>
                    <h3 className="mt-4 font-display text-base font-700 uppercase tracking-tight sm:text-lg">
                      {product.title}
                    </h3>
                    <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-display text-lg font-700 text-gold">
                        {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={() => addItem(product)}
                        className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors hover:border-gold hover:text-gold sm:text-sm"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
      <MobileCta />
    </>
  )
}
