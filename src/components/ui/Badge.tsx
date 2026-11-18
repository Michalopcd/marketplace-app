import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type BadgeVariant = 'brand' | 'neutral' | 'muted'

interface BadgeProps {
  variant?: BadgeVariant
  className?: string
  children: ReactNode
}

const variants: Record<BadgeVariant, string> = {
  brand: 'bg-forest text-white',
  neutral: 'bg-white text-ink',
  muted: 'bg-ink/80 text-white',
}

export function Badge({ variant = 'brand', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1.5 text-[11px] leading-none font-bold tracking-[0.08em] uppercase',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
