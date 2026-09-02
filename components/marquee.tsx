const ITEMS = ['Cortes', 'Barba', 'Cejas', 'Color', 'Estilo', 'Actitud', 'Precisión']

export function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <section className="overflow-hidden border-y border-border bg-secondary py-3.5 sm:py-5" aria-hidden="true">
      <div className="flex w-max animate-marquee">
        {row.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="px-5 font-display text-lg font-700 uppercase tracking-tight sm:px-8 sm:text-3xl">
              {item}
            </span>
            <span className="text-gold">✕</span>
          </div>
        ))}
      </div>
    </section>
  )
}
