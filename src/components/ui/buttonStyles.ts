import { cn } from '../../utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'text'
export type ButtonSize = 'sm' | 'md'

export interface ButtonStyleOptions {
  variant?: ButtonVariant
  /** Ignored by the `text` variant, which always sizes to its content. */
  size?: ButtonSize
  fullWidth?: boolean
  /** Extra classes (e.g. margins). Not for overriding base styles – see `cn`. */
  className?: string
}

const base =
  'inline-flex items-center justify-center gap-3 font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<ButtonVariant, string> = {
  primary:
    'rounded-xs border border-forest bg-forest text-white hover:bg-forest-dark hover:border-forest-dark',
  secondary:
    'rounded-xs border border-forest bg-transparent text-forest hover:bg-mint',
  text: 'border-b border-field pb-1 text-forest hover:border-forest',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-4 text-xs',
  md: 'min-h-12 px-6 text-sm',
}

/** Shared by `Button` and `ButtonLink` so links can look like buttons (e.g. CTAs). */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    base,
    variants[variant],
    // Text links size to their content; the 44px touch target comes from line-height + padding.
    variant === 'text' ? 'min-h-11 text-sm' : sizes[size],
    fullWidth && variant !== 'text' && 'w-full',
    className,
  )
}
