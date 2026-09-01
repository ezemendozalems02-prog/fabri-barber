const ITEMS = [
  'Recuperación',
  'Movilidad',
  'Kinesiología',
  'Recovery',
  'Rendimiento',
  'Descarga',
  'Prevención',
]

export function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <section className="border-y border-border bg-secondary py-3.5 sm:py-5" aria-hidden="true">
      <div className="flex w-max animate-marquee">
        {row.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="px-5 font-display text-lg font-800 uppercase tracking-tight sm:px-8 sm:text-3xl">
              {item}
            </span>
            <span className="text-electric">✕</span>
          </div>
        ))}
      </div>
    </section>
  )
}
