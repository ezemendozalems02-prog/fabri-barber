export function ComingSoon({
  title,
  description,
  bullets,
  fase,
}: {
  title: string
  description: string
  bullets: string[]
  fase: string
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{description}</p>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{fase}</span>
        <p className="mx-auto mt-4 max-w-md text-sm text-slate-500">
          Esta sección todavía no está construida. Se va a implementar en el próximo bloque de trabajo, sobre la misma
          capa de servicios (<code className="rounded bg-slate-100 px-1 py-0.5 text-xs">lib/services/</code>) para no duplicar nada de lo que ya funciona.
        </p>
        <ul className="mx-auto mt-5 flex max-w-sm flex-col gap-2 text-left text-sm text-slate-600">
          {bullets.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
