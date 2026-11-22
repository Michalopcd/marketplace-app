import type { ReactNode } from 'react'

export interface IconProps {
  size?: number
  className?: string
}

interface IconBaseProps extends IconProps {
  fill?: string
  children: ReactNode
}

/**
 * Shared 24×24 SVG frame for the NÓW Figma Make icon set (stroke = currentColor).
 * Icons are decorative – always label the parent control instead.
 */
export function IconBase({
  size = 20,
  className,
  fill = 'none',
  children,
}: IconBaseProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}
