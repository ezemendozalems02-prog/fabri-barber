import { cn } from '@/lib/utils'

export function SRLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-display font-900 leading-none tracking-tighter select-none',
        className,
      )}
      aria-hidden="true"
    >
      SR
    </span>
  )
}
