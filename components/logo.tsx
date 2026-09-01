import { cn } from '@/lib/utils'

/** Emblema de tijera minimalista — usado dentro de un badge circular en navbar/footer. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="6" cy="18" r="2.4" />
      <path d="M7.8 7.6 20 18M7.8 16.4 20 6" />
      <path d="M9.5 12 8 12" />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-display font-700 uppercase leading-none tracking-widest select-none',
        className,
      )}
    >
      Fabri Barber
    </span>
  )
}
