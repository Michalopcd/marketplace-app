import { cn } from '../../utils/cn'

interface LoadingSpinnerProps {
  /** Accessible text announced to screen readers (ignored when `decorative`). */
  label?: string
  size?: 'sm' | 'md'
  /**
   * Visual only – no live region. Use inside controls that already expose their
   * state (e.g. a button with `aria-busy`), where a nested `role="status"` is ignored.
   */
  decorative?: boolean
  className?: string
}

const sizes = {
  sm: 'size-4 border-2',
  md: 'size-8 border-[3px]',
}

export function LoadingSpinner({
  label = 'Ładowanie…',
  size = 'md',
  decorative = false,
  className,
}: LoadingSpinnerProps) {
  const spinner = (
    <span
      aria-hidden="true"
      className={cn(
        'animate-spin motion-reduce:animate-none rounded-full border-current border-t-transparent',
        sizes[size],
      )}
    />
  )

  if (decorative) {
    return <span className={cn('inline-flex items-center', className)}>{spinner}</span>
  }

  return (
    <span role="status" className={cn('inline-flex items-center', className)}>
      {spinner}
      <span className="sr-only">{label}</span>
    </span>
  )
}
