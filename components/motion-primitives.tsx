'use client'

import { motion, useInView } from 'motion/react'
import { useRef, type ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Reveals a heading word-by-word on scroll into view. */
export function WordReveal({
  text,
  className,
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const words = text.split(' ')
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: delay + i * 0.06 }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/** Image that reveals via a wiping mask and subtle scale. */
export function ImageReveal({
  src,
  alt,
  className,
  imgClassName,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.img
        src={src || '/placeholder.svg'}
        alt={alt}
        className={`h-full w-full object-cover ${imgClassName ?? ''}`}
        initial={{ scale: 1.2 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <motion.div
        className="absolute inset-0 bg-background"
        initial={{ scaleY: 1 }}
        animate={inView ? { scaleY: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ transformOrigin: 'top' }}
      />
    </div>
  )
}
