import type { ButtonHTMLAttributes } from 'react'
import { buttonClassName, type ButtonStyleOptions } from './buttonStyles'
import { LoadingSpinner } from './LoadingSpinner'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleOptions & {
    /** Disables the button and shows a spinner while loading. */
    isLoading?: boolean
  }

export function Button({
  variant,
  size,
  fullWidth,
  className,
  isLoading = false,
  disabled,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonClassName({ variant, size, fullWidth, className })}
    >
      {isLoading && <LoadingSpinner size="sm" decorative />}
      {children}
    </button>
  )
}
