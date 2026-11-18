import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface EmptyStateProps {
  title: string
  description?: string
  /** Decorative icon shown in a mint circle. */
  icon?: ReactNode
  /** Usually a `Button` or `ButtonLink`. */
  action?: ReactNode
  /** Smaller variant with a border, for use inside lists. */
  compact?: boolean
  headingLevel?: 'h2' | 'h3'
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  compact = false,
  headingLevel: Heading = 'h2',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-4 py-12 text-center',
        compact ? 'min-h-80 border border-line' : 'min-h-96',
        className,
      )}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="mb-5 grid size-[74px] place-items-center rounded-full bg-mint text-moss"
        >
          {icon}
        </div>
      )}
      <Heading className="font-display text-3xl">{title}</Heading>
      {description && (
        <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
