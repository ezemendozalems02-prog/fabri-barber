'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { FAQS } from '@/lib/site-data'
import { Reveal, WordReveal } from './motion-primitives'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-32">
      <div className="mb-8 text-center sm:mb-12">
        <Reveal>
          <p className="mb-4 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-6 sm:text-xs sm:tracking-[0.25em]">
            <span className="h-px w-6 bg-electric sm:w-8" />
            Preguntas frecuentes
          </p>
        </Reveal>
        <h2 className="font-display text-3xl font-800 uppercase leading-[0.95] tracking-tight sm:text-6xl">
          <WordReveal text="Todo lo que necesitás saber" />
        </h2>
      </div>

      <div className="border-t border-border">
        {FAQS.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={i} className="border-b border-border">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left sm:py-6"
                aria-expanded={isOpen}
              >
                <span className="text-base font-semibold sm:text-xl">{item.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border sm:h-8 sm:w-8"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 pr-8 text-pretty text-sm leading-relaxed text-muted-foreground sm:pb-6 sm:pr-12 sm:text-base">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
