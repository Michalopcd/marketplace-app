import type { ElementType, ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface ContainerProps {
  /** Rendered element, e.g. `section` or `header`. */
  as?: ElementType
  className?: string
  children: ReactNode
}

/** Page-width wrapper: 16px gutters on mobile, 32px from `md`, max 1312px content. */
export function Container({
  as: Component = 'div',
  className,
  children,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-[calc(100%-32px)] max-w-[1312px] md:w-[calc(100%-64px)]',
        className,
      )}
    >
      {children}
    </Component>
  )
}
