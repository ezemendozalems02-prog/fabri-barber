'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { EXPERIENCE_STEPS } from '@/lib/site-data'
import { Reveal } from './motion-primitives'

export function Experience() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[80vh] items-center overflow-hidden border-y border-border"
    >
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="/images/experience.png"
          alt="Estudio de recuperación de Sports Recovery"
          className="h-[124%] w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-background/75" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
            <span className="h-px w-6 bg-electric sm:w-8" />
            La experiencia
          </p>
        </Reveal>
        <h2 className="max-w-3xl font-display text-3xl font-800 uppercase leading-[0.95] tracking-tight sm:text-6xl">
          Un espacio pensado para que recuperes de verdad.
        </h2>

        <ol className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-3 sm:mt-12 sm:gap-x-3 sm:gap-y-4">
          {EXPERIENCE_STEPS.map((step, i) => (
            <Reveal key={step} delay={i * 0.08}>
              <li className="flex items-center gap-2.5 sm:gap-3">
                <span className="font-display text-base font-800 uppercase tracking-tight sm:text-3xl">
                  {step}
                </span>
                {i < EXPERIENCE_STEPS.length - 1 && (
                  <span className="text-electric">→</span>
                )}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
