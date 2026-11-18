interface HeartIconProps {
  size?: number
  filled?: boolean
  className?: string
}

/** Heart outline from the NÓW Figma Make icon set. Decorative – label the parent control. */
export function HeartIcon({ size = 20, filled = false, className }: HeartIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20.8 5.7c-2.1-2.2-5.6-2.2-7.8 0L12 6.8l-1.1-1.1a5.48 5.48 0 0 0-7.8 7.7L12 22l8.8-8.6a5.48 5.48 0 0 0 0-7.7Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
    </svg>
  )
}
