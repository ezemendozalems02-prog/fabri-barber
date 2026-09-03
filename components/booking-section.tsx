'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import {
  calcDeposit,
  formatDateLong,
  formatPrice,
  generateAvailableSlots,
  isDateAllowed,
  timeToMinutes,
} from '@/lib/booking-data'
import { getOccupiedRangesForDate, reservarTurnoPublico } from '@/lib/actions/turnos'
import { DEFAULT_BARBERO_ID } from '@/lib/constants'
import { HAIRCUTS } from '@/lib/site-data'
import type { Turno } from '@/lib/types'
import { useServices, useSiteConfig } from './catalog-provider'
import { useBooking } from './booking-provider'
import { CalendarIcon, CheckIcon, ClockIcon, WhatsappIcon } from './icons'
import { Reveal, WordReveal } from './motion-primitives'

const EASE = [0.22, 1, 0.36, 1] as const

type Phase =
  | 'servicio'
  | 'estilo'
  | 'fecha'
  | 'horario'
  | 'datos'
  | 'resumen'
  | 'pagando'
  | 'confirmado'
  | 'rechazado'

const PHASE_DOT: Record<Phase, number> = {
  servicio: 0,
  estilo: 0,
  fecha: 1,
  horario: 2,
  datos: 3,
  resumen: 4,
  pagando: 4,
  confirmado: 4,
  rechazado: 4,
}

const DOT_LABELS = ['Servicio', 'Fecha', 'Horario', 'Datos', 'Pago']

function buildDateOptions(days: number) {
  const out: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 0; i < days; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    out.push(d)
  }
  return out
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function buildIcs(turno: Turno, serviceName: string) {
  const [y, m, d] = turno.fecha.split('-').map(Number)
  const [sh, sm] = turno.hora_inicio.split(':').map(Number)
  const [eh, em] = turno.hora_fin.split(':').map(Number)
  const pad = (n: number) => n.toString().padStart(2, '0')
  const dtStart = `${y}${pad(m)}${pad(d)}T${pad(sh)}${pad(sm)}00`
  const dtEnd = `${y}${pad(m)}${pad(d)}T${pad(eh)}${pad(em)}00`
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:${turno.id}@fabribarber`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:Turno en FABRI BARBER — ${serviceName}`,
    `DESCRIPTION:Seña abonada: ${formatPrice(turno.monto_seña)}. Saldo en el local: ${formatPrice(turno.saldo)}.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function BookingSection() {
  const { request } = useBooking()
  const SERVICES = useServices()
  const config = useSiteConfig()

  const [phase, setPhase] = useState<Phase>('servicio')
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [styleId, setStyleId] = useState<string | null>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [nombre, setNombre] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [comentario, setComentario] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmedTurno, setConfirmedTurno] = useState<Turno | null>(null)

  useEffect(() => {
    if (!request) return
    setServiceId(request.serviceId ?? null)
    setStyleId(null)
    setDate(null)
    setTime(null)
    if (request.serviceId === 'corte') setPhase('estilo')
    else if (request.serviceId) setPhase('fecha')
    else setPhase('servicio')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.token])

  const service = SERVICES.find((s) => s.id === serviceId) ?? null
  const dateOptions = useMemo(() => buildDateOptions(28), [])

  const [daySlots, setDaySlots] = useState<{ morning: { time: string; taken: boolean }[]; afternoon: { time: string; taken: boolean }[] }>({
    morning: [],
    afternoon: [],
  })
  const [loadingSlots, setLoadingSlots] = useState(false)

  useEffect(() => {
    if (!service || !date) {
      setDaySlots({ morning: [], afternoon: [] })
      return
    }
    let cancelled = false
    setLoadingSlots(true)
    getOccupiedRangesForDate(toDateKey(date)).then((occupied) => {
      if (cancelled) return
      const candidates = generateAvailableSlots(service, date, [])
      const withStatus = candidates.map((t) => {
        const start = timeToMinutes(t)
        const end = start + service.duration
        const taken = occupied.some((r) => start < r.end && end > r.start)
        return { time: t, taken }
      })
      const breakStart = timeToMinutes('13:00')
      setDaySlots({
        morning: withStatus.filter((s) => timeToMinutes(s.time) < breakStart),
        afternoon: withStatus.filter((s) => timeToMinutes(s.time) >= breakStart),
      })
      setLoadingSlots(false)
    })
    return () => {
      cancelled = true
    }
  }, [service, date])

  const deposit = service ? calcDeposit(service.price, config.depositPercent) : null

  function resetFlow() {
    setPhase('servicio')
    setServiceId(null)
    setStyleId(null)
    setDate(null)
    setTime(null)
    setNombre('')
    setWhatsapp('')
    setComentario('')
    setErrors({})
    setConfirmedTurno(null)
  }

  function validateForm() {
    const next: Record<string, string> = {}
    if (!nombre.trim()) next.nombre = 'Ingresá tu nombre y apellido.'
    if (!whatsapp.trim()) next.whatsapp = 'Ingresá tu WhatsApp.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleReservar() {
    if (!service || !date || !time) return
    setPhase('pagando')

    const result = await reservarTurnoPublico({
      cliente: { nombre, whatsapp },
      servicioId: service.id,
      barberoId: DEFAULT_BARBERO_ID,
      estiloCorte: styleId ?? undefined,
      fecha: toDateKey(date),
      hora: time,
      comentario: comentario || undefined,
    })

    if ('motivo' in result) {
      // El horario se ocupó justo antes de confirmar — muy poco probable, pero se cubre.
      setPhase('rechazado')
      return
    }

    setConfirmedTurno(result)
    setPhase('confirmado')
  }

  function handleDownloadIcs() {
    if (!confirmedTurno || !service) return
    const ics = buildIcs(confirmedTurno, service.title)
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'turno-fabri-barber.ics'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const whatsappHref = useMemo(() => {
    if (!confirmedTurno || !service) return `https://wa.me/${config.whatsapp}`
    const msg = `Hola! Reservé un turno de *${service.title}* para el ${confirmedTurno.fecha} a las ${confirmedTurno.hora_inicio}. Mi nombre es ${nombre}. Ya transferí la seña de ${formatPrice(confirmedTurno.monto_seña)} al alias ${config.mercadopago.alias} — les adjunto la captura del comprobante.`
    return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(msg)}`
  }, [confirmedTurno, service, nombre, config])

  return (
    <section id="reservar" className="border-t border-border bg-card">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-32">
        <div className="mb-10 text-center sm:mb-12">
          <Reveal>
            <p className="mb-4 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
              <span className="h-px w-6 bg-gold sm:w-8" />
              Turnos online
            </p>
          </Reveal>
          <h2 className="font-display text-3xl font-700 uppercase leading-[0.95] tracking-tight sm:text-6xl">
            <WordReveal text="Reservá tu turno" />
          </h2>
        </div>

        {phase !== 'confirmado' && phase !== 'rechazado' && (
          <div className="mb-10 flex items-center justify-center gap-2 sm:mb-14">
            {DOT_LABELS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-8 rounded-full transition-colors sm:w-10 ${
                    i <= PHASE_DOT[phase] ? 'bg-gold' : 'bg-border'
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-border bg-background p-5 sm:p-8">
          <AnimatePresence mode="wait">
            {/* 1. SERVICIO */}
            {phase === 'servicio' && (
              <motion.div key="servicio" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE }}>
                <h3 className="font-display text-xl font-700 uppercase sm:text-2xl">Elegí un servicio</h3>
                <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setServiceId(s.id)
                        setPhase(s.id === 'corte' ? 'estilo' : 'fecha')
                      }}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary px-4 py-3.5 text-left text-sm font-medium transition-all hover:border-gold hover:bg-accent"
                    >
                      <span>{s.title}</span>
                      <span className="text-gold">{formatPrice(s.price)}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 2. ESTILO (opcional, solo corte) */}
            {phase === 'estilo' && (
              <motion.div key="estilo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE }}>
                <h3 className="font-display text-xl font-700 uppercase sm:text-2xl">¿Qué estilo querés? (opcional)</h3>
                <p className="mt-1 text-sm text-muted-foreground">Podés indicarlo ahora o decidirlo en el local.</p>
                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {HAIRCUTS.map((cut) => (
                    <button
                      key={cut.id}
                      onClick={() => setStyleId(cut.id === styleId ? null : cut.id)}
                      className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition-all sm:text-sm ${
                        styleId === cut.id
                          ? 'border-gold bg-gold text-background'
                          : 'border-border bg-secondary hover:border-foreground/40'
                      }`}
                    >
                      {cut.title}
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex gap-2">
                  <button onClick={() => setPhase('servicio')} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
                    Atrás
                  </button>
                  <button onClick={() => setPhase('fecha')} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                    Continuar
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. FECHA */}
            {phase === 'fecha' && service && (
              <motion.div key="fecha" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE }}>
                <h3 className="font-display text-xl font-700 uppercase sm:text-2xl">Elegí una fecha</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {service.id === 'radiofrecuencia' ? config.hoursRadiofrecuencia : config.hoursGeneral}
                </p>
                <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-2">
                  {dateOptions.map((d) => {
                    const allowed = isDateAllowed(service, d)
                    const isSelected = date && toDateKey(date) === toDateKey(d)
                    return (
                      <button
                        key={toDateKey(d)}
                        disabled={!allowed}
                        onClick={() => {
                          setDate(d)
                          setTime(null)
                          setPhase('horario')
                        }}
                        className={`flex w-14 flex-shrink-0 flex-col items-center rounded-lg border px-2 py-3 text-xs transition-all ${
                          isSelected
                            ? 'border-gold bg-gold text-background'
                            : allowed
                              ? 'border-border bg-secondary hover:border-foreground/40'
                              : 'cursor-not-allowed border-border/50 bg-secondary/30 text-muted-foreground/40'
                        }`}
                      >
                        <span className="uppercase">{d.toLocaleDateString('es-AR', { weekday: 'short' })}</span>
                        <span className="mt-1 font-display text-lg font-700">{d.getDate()}</span>
                      </button>
                    )
                  })}
                </div>
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setPhase(service.id === 'corte' ? 'estilo' : 'servicio')}
                    className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    Atrás
                  </button>
                </div>
              </motion.div>
            )}

            {/* 4. HORARIO */}
            {phase === 'horario' && service && date && (
              <motion.div key="horario" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE }}>
                <h3 className="font-display text-xl font-700 uppercase sm:text-2xl">Elegí un horario</h3>
                <p className="mt-1 text-sm capitalize text-muted-foreground">{formatDateLong(date)}</p>

                {loadingSlots ? (
                  <p className="mt-6 text-sm text-muted-foreground">Buscando horarios disponibles…</p>
                ) : daySlots.morning.length === 0 && daySlots.afternoon.length === 0 ? (
                  <p className="mt-6 text-sm text-muted-foreground">No hay horarios disponibles ese día. Probá con otra fecha.</p>
                ) : (
                  <div className="mt-5 space-y-5">
                    {daySlots.morning.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Mañana</p>
                        <div className="flex flex-wrap gap-2">
                          {daySlots.morning.map((s) => (
                            <button
                              key={s.time}
                              disabled={s.taken}
                              onClick={() => {
                                setTime(s.time)
                                setPhase('datos')
                              }}
                              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                                s.taken
                                  ? 'cursor-not-allowed border-border/50 text-muted-foreground/40 line-through'
                                  : time === s.time
                                    ? 'border-gold bg-gold text-background'
                                    : 'border-border bg-secondary hover:border-foreground/40'
                              }`}
                            >
                              {s.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-px flex-1 bg-border" />
                      13:00 a 14:00 hs — cerrado
                      <span className="h-px flex-1 bg-border" />
                    </div>

                    {daySlots.afternoon.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Tarde</p>
                        <div className="flex flex-wrap gap-2">
                          {daySlots.afternoon.map((s) => (
                            <button
                              key={s.time}
                              disabled={s.taken}
                              onClick={() => {
                                setTime(s.time)
                                setPhase('datos')
                              }}
                              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                                s.taken
                                  ? 'cursor-not-allowed border-border/50 text-muted-foreground/40 line-through'
                                  : time === s.time
                                    ? 'border-gold bg-gold text-background'
                                    : 'border-border bg-secondary hover:border-foreground/40'
                              }`}
                            >
                              {s.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 flex gap-2">
                  <button onClick={() => setPhase('fecha')} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
                    Atrás
                  </button>
                </div>
              </motion.div>
            )}

            {/* 5. DATOS */}
            {phase === 'datos' && service && date && time && (
              <motion.div key="datos" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE }}>
                <h3 className="font-display text-xl font-700 uppercase sm:text-2xl">Tus datos</h3>
                <div className="mt-5 flex flex-col gap-3.5">
                  <div>
                    <input
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Nombre y apellido"
                      className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-base outline-none transition-colors focus:border-gold sm:text-sm"
                    />
                    {errors.nombre && <p className="mt-1 text-xs text-destructive">{errors.nombre}</p>}
                  </div>
                  <div>
                    <input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="WhatsApp"
                      type="tel"
                      inputMode="tel"
                      className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-base outline-none transition-colors focus:border-gold sm:text-sm"
                    />
                    {errors.whatsapp && <p className="mt-1 text-xs text-destructive">{errors.whatsapp}</p>}
                  </div>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Comentario (opcional)"
                    rows={2}
                    className="w-full resize-none rounded-lg border border-border bg-secondary px-4 py-3 text-base outline-none transition-colors focus:border-gold sm:text-sm"
                  />
                </div>
                <div className="mt-6 flex gap-2">
                  <button onClick={() => setPhase('horario')} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
                    Atrás
                  </button>
                  <button
                    onClick={() => validateForm() && setPhase('resumen')}
                    className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                  >
                    Continuar
                  </button>
                </div>
              </motion.div>
            )}

            {/* 6. RESUMEN + PAGO */}
            {phase === 'resumen' && service && date && time && deposit && (
              <motion.div key="resumen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE }}>
                <h3 className="font-display text-xl font-700 uppercase sm:text-2xl">Resumen y seña</h3>
                <div className="mt-5 rounded-lg border border-border bg-secondary/50 p-4 text-sm">
                  <Row label="Servicio" value={service.title} />
                  {styleId && <Row label="Estilo" value={HAIRCUTS.find((c) => c.id === styleId)?.title ?? ''} />}
                  <Row label="Fecha" value={formatDateLong(date)} className="capitalize" />
                  <Row label="Horario" value={time} />
                  <Row label="Nombre" value={nombre} />
                  <div className="mt-3 border-t border-border pt-3">
                    <Row label="Precio total" value={formatPrice(service.price)} />
                    <Row label={`Seña para reservar (${deposit.percent}%)`} value={formatPrice(deposit.deposit)} highlight />
                    <Row label="Saldo restante (en el local)" value={formatPrice(deposit.balance)} />
                  </div>
                </div>

                <div className="mt-6 rounded-lg border border-gold/40 bg-gold/[0.06] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gold">Cómo pagar la seña</p>
                  <p className="mt-2 text-sm leading-relaxed">
                    Transferí <span className="font-semibold text-gold">{formatPrice(deposit.deposit)}</span> por Mercado Pago a este alias:
                  </p>
                  <div className="mt-3 flex flex-col gap-1 rounded-lg bg-background/60 p-3">
                    <Row label="Alias" value={config.mercadopago.alias} highlight />
                    <Row label="Titular" value={config.mercadopago.titular} />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Después de transferir, tocá el botón de abajo para reservar tu horario y enviarnos la captura del comprobante por WhatsApp. Tu turno queda confirmado al recibirla.
                  </p>
                </div>

                <button
                  onClick={handleReservar}
                  className="mt-6 w-full rounded-full bg-gold py-3.5 text-sm font-semibold uppercase tracking-wide text-background transition-transform hover:scale-[1.01]"
                >
                  Reservar turno y enviar comprobante
                </button>
                <button onClick={() => setPhase('datos')} className="mt-3 w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
                  Atrás
                </button>
              </motion.div>
            )}

            {/* 7. PAGANDO */}
            {phase === 'pagando' && (
              <motion.div key="pagando" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 py-10 text-center">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: 'linear' }}
                  className="h-10 w-10 rounded-full border-2 border-border border-t-gold"
                />
                <p className="font-display text-lg font-700 uppercase">Guardando tu reserva…</p>
                <p className="text-sm text-muted-foreground">No cierres esta ventana.</p>
              </motion.div>
            )}

            {/* 8a. CONFIRMADO */}
            {phase === 'confirmado' && confirmedTurno && service && (
              <motion.div key="confirmado" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold">
                  <CheckIcon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-2xl font-700 uppercase">¡Turno reservado!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Falta un paso: enviá la captura de tu transferencia por WhatsApp para confirmar el turno.
                </p>

                <div className="mt-6 rounded-lg border border-border bg-secondary/50 p-4 text-left text-sm">
                  <Row label="Servicio" value={service.title} />
                  <Row label="Fecha" value={formatDateLong(new Date(`${confirmedTurno.fecha}T00:00:00`))} className="capitalize" />
                  <Row label="Horario" value={confirmedTurno.hora_inicio} />
                  <Row label="Nombre" value={confirmedTurno.cliente.nombre} />
                  <div className="mt-3 border-t border-border pt-3">
                    <Row label="Seña a transferir" value={formatPrice(confirmedTurno.monto_seña)} highlight />
                    <Row label="Saldo pendiente" value={formatPrice(confirmedTurno.saldo)} />
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-gold/40 bg-gold/[0.06] p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gold">Alias de Mercado Pago</p>
                  <div className="mt-2 flex flex-col gap-1">
                    <Row label="Alias" value={config.mercadopago.alias} highlight />
                    <Row label="Titular" value={config.mercadopago.titular} />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                  <button
                    onClick={handleDownloadIcs}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Agregar al calendario
                  </button>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    <WhatsappIcon className="h-4 w-4" />
                    Enviar comprobante por WhatsApp
                  </a>
                </div>
                <button onClick={resetFlow} className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:underline">
                  Reservar otro turno
                </button>
              </motion.div>
            )}

            {/* 8b. RECHAZADO */}
            {phase === 'rechazado' && (
              <motion.div key="rechazado" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-destructive text-destructive">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </span>
                <h3 className="mt-4 font-display text-xl font-700 uppercase">Ese horario ya no está disponible</h3>
                <p className="mt-2 text-sm text-muted-foreground">Alguien reservó ese turno justo antes. Elegí otro horario.</p>
                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                  <button onClick={() => setPhase('horario')} className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-background">
                    Elegir otro horario
                  </button>
                  <button onClick={() => setPhase('datos')} className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary">
                    Volver
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <ClockIcon className="h-3.5 w-3.5" />
          {config.hoursGeneral} · {config.hoursBreak}
        </p>
      </div>
    </section>
  )
}

function Row({
  label,
  value,
  highlight,
  className,
}: {
  label: string
  value: string
  highlight?: boolean
  className?: string
}) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${highlight ? 'text-gold' : ''} ${className ?? ''}`}>{value}</span>
    </div>
  )
}
