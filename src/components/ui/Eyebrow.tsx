import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface Props {
  /** `light` for dark (forest) backgrounds. */
  tone?: 'default' | 'light'
  className?: string
  children: ReactNode
}

/** Small uppercase kicker with a leading rule, placed above section headings. */
export function Eyebrow({ tone = 'default', className, children }: Props) {
  return (
    <p
      className={cn(
        'flex items-center gap-2.5 text-[11px] font-bold tracking-[0.15em] uppercase',
        tone === 'light' ? 'text-white/70' : 'text-moss',
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-[25px] bg-current opacity-80" />
      {children}
    </p>
  )
}
